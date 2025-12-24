// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using System.Security.Claims;
// using EventTracker.Auth.Application.DTOs;
// using EventTracker.Auth.Application.Services;

// namespace EventTracker.Auth.API.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class AuthController : ControllerBase
//     {
//         private readonly IAuthService _authService;
//         private readonly ILogger<AuthController> _logger;

//         public AuthController(IAuthService authService, ILogger<AuthController> logger)
//         {
//             _authService = authService;
//             _logger = logger;
//         }

//         /// <summary>
//         /// User login endpoint
//         /// </summary>
//         [HttpPost("login")]
//         [AllowAnonymous]
//         public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
//         {
//             try
//             {
//                 _logger.LogInformation($"Login attempt for email: {request.Email}");
//                 var response = await _authService.LoginAsync(request);
//                 return Ok(response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Login error: {ex.Message}");
//                 return Unauthorized(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// User registration endpoint
//         /// </summary>
//         [HttpPost("register")]
//         [AllowAnonymous]
//         public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
//         {
//             try
//             {
//                 _logger.LogInformation($"Registration attempt for email: {request.Email}");
//                 var response = await _authService.RegisterAsync(request);
//                 return StatusCode(201, response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Registration error: {ex.Message}");
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// Get current user profile (requires authentication)
//         /// </summary>
//         [HttpGet("profile")]
//         [Authorize]
//         public async Task<IActionResult> GetProfile()
//         {
//             try
//             {
//                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (!Guid.TryParse(userIdClaim, out var userId))
//                     return Unauthorized(new { message = "Invalid user ID in token" });

//                 var user = await _authService.GetUserProfileAsync(userId);
//                 return Ok(user);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Get profile error: {ex.Message}");
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// Update user profile (requires authentication)
//         /// </summary>
//         [HttpPut("profile")]
//         [Authorize]
//         public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto request)
//         {
//             try
//             {
//                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (!Guid.TryParse(userIdClaim, out var userId))
//                     return Unauthorized(new { message = "Invalid user ID in token" });

//                 var user = await _authService.UpdateUserProfileAsync(userId, request);
//                 return Ok(user);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Update profile error: {ex.Message}");
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// Logout endpoint
//         /// </summary>
//         [HttpPost("logout")]
//         [Authorize]
//         public async Task<IActionResult> Logout()
//         {
//             try
//             {
//                 var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (!Guid.TryParse(userIdClaim, out var userId))
//                     return Unauthorized(new { message = "Invalid user ID in token" });

//                 await _authService.LogoutAsync(userId);
//                 return Ok(new { message = "Logged out successfully" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Logout error: {ex.Message}");
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// Refresh token endpoint
//         /// </summary>
//         [HttpPost("refresh")]
//         [AllowAnonymous]
//         public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
//         {
//             try
//             {
//                 var response = await _authService.RefreshTokenAsync(refreshToken);
//                 return Ok(response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Refresh token error: {ex.Message}");
//                 return Unauthorized(new { message = ex.Message });
//             }
//         }

//         /// <summary>
//         /// Get Azure AD login URL for SSO
//         /// </summary>
//         // [HttpGet("azure-ad-login-url")]
//         // [AllowAnonymous]
//         // public IActionResult GetAzureAdLoginUrl()
//         // {
//         //     try
//         //     {
//         //         var azureAdService = HttpContext.RequestServices.GetRequiredService<IAzureAdService>();
//         //         var loginUrl = azureAdService.GetAuthorizationUrl();
//         //         _logger.LogInformation("Azure AD login URL requested");
//         //         return Ok(new { loginUrl });
//         //     }
//         //     catch (Exception ex)
//         //     {
//         //         _logger.LogError($"Error getting Azure AD login URL: {ex.Message}");
//         //         return BadRequest(new { message = ex.Message });
//         //     }
//         // }

//         [HttpGet("azure-ad-login-url")]
//         public async Task<IActionResult> GetAzureAdLoginUrl()
//         {
//             try
//             {
//                 // Build the Azure AD authorization URL
//                 var loginUrl = $"https://login.microsoftonline.com/{_azureAdConfig.TenantId}/oauth2/v2.0/authorize?" +
//                 $"client_id={_azureAdConfig.ClientId}&" +
//                 $"redirect_uri={Uri.EscapeDataString(_azureAdConfig.RedirectUri)}&" +  // ← From appsettings
//                 $"response_type=token&" +
//                 $"scope={Uri.EscapeDataString("openid profile email")}&" +
//                 $"response_mode=fragment&" +
//                 $"prompt=login";

//                 _logger.LogInformation($"Azure AD login URL generated with redirect URI: {_azureAdConfig.RedirectUri}");

//                 return Ok(new { loginUrl });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Error generating Azure AD login URL: {ex.Message}");
//                 return BadRequest(new { message = "Failed to generate Azure AD login URL" });
//             }
//         }

//         /// <summary>
//         /// Verify Azure AD token and create user session
//         /// </summary>
//         [HttpPost("azure-ad-callback")]
//         [AllowAnonymous]
//         public async Task<IActionResult> AzureAdCallback([FromBody] AzureAdCallbackDto request)
//         {
//             try
//             {
//                 _logger.LogInformation("Azure AD callback received");
//                 var azureAdService = HttpContext.RequestServices.GetRequiredService<IAzureAdService>();
//                 var response = await azureAdService.AuthenticateWithAzureAdAsync(request.AccessToken);
//                 return Ok(response);
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Azure AD callback error: {ex.Message}");
//                 return Unauthorized(new { message = ex.Message });
//             }
//         }
//     }
// }


// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Options;
// using System.IdentityModel.Tokens.Jwt;
// using EventTracker.Auth.Application.DTOs;
// // using EventTracker.Auth.Application.Interfaces;
// using EventTracker.Auth.Domain.Entities;
// using EventTracker.Auth.Infrastructure.Settings;
// using Microsoft.IdentityModel.Tokens;
// using System.Security.Claims;
// using System.Text;
// using EventTracker.Auth.Application.Services;

// namespace EventTracker.Auth.API.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class AuthController : ControllerBase
//     {
//         private readonly IAuthService _authService;
//         private readonly AzureAdSettings _azureAdConfig;
//         private readonly JwtSettings _jwtSettings;
//         private readonly ILogger<AuthController> _logger;

//         public AuthController(
//             IAuthService authService,
//             IOptions<AzureAdSettings> azureAdConfig,
//             IOptions<JwtSettings> jwtSettings,
//             ILogger<AuthController> logger)
//         {
//             _authService = authService;
//             _azureAdConfig = azureAdConfig.Value;
//             _jwtSettings = jwtSettings.Value;
//             _logger = logger;
//         }

//         [HttpGet("azure-ad-login-url")]
//         public async Task<IActionResult> GetAzureAdLoginUrl()
//         {
//             try
//             {
//                 _logger.LogInformation("Getting Azure AD login URL");
//                 _logger.LogInformation($"Tenant ID: {_azureAdConfig.TenantId}");
//                 _logger.LogInformation($"Client ID: {_azureAdConfig.ClientId}");
//                 _logger.LogInformation($"Redirect URI: {_azureAdConfig.RedirectUri}");

//                 // Build the Azure AD authorization URL
//                 var loginUrl = $"https://login.microsoftonline.com/{_azureAdConfig.TenantId}/oauth2/v2.0/authorize?" +
//                     $"client_id={_azureAdConfig.ClientId}&" +
//                     $"redirect_uri={Uri.EscapeDataString(_azureAdConfig.RedirectUri)}&" +
//                     $"response_type=token&" +
//                     $"scope={Uri.EscapeDataString("openid profile email")}&" +
//                     $"response_mode=fragment&" +
//                     $"prompt=login";

//                 _logger.LogInformation($"Azure AD login URL generated");

//                 return Ok(new { loginUrl });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Error generating Azure AD login URL: {ex.Message}");
//                 return BadRequest(new { message = "Failed to generate Azure AD login URL" });
//             }
//         }

//         [HttpPost("azure-ad-callback")]
//         public async Task<IActionResult> AzureAdCallback([FromBody] AzureAdCallbackDto request)
//         {
//             try
//             {
//                 _logger.LogInformation("Azure AD callback received");
//                 _logger.LogInformation("Authenticating with Azure AD token");

//                 // Validate and extract claims from Azure AD token
//                 var principal = ValidateAzureAdToken(request.AccessToken);
//                 if (principal == null)
//                 {
//                     _logger.LogError("Invalid Azure AD token");
//                     return Unauthorized(new { message = "Invalid token" });
//                 }

//                 var azureAdId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? principal.FindFirst("oid")?.Value;
//                 var email = principal.FindFirst(ClaimTypes.Email)?.Value ?? principal.FindFirst("preferred_username")?.Value;
//                 var firstName = principal.FindFirst(ClaimTypes.GivenName)?.Value ?? "User";
//                 var lastName = principal.FindFirst(ClaimTypes.Surname)?.Value ?? "";

//                 if (string.IsNullOrEmpty(azureAdId) || string.IsNullOrEmpty(email))
//                 {
//                     _logger.LogError("Missing required claims from Azure AD token");
//                     return Unauthorized(new { message = "Missing required information from Azure AD" });
//                 }

//                 _logger.LogInformation($"Azure AD user: {email} (ID: {azureAdId})");

//                 // Call authentication service to handle user creation/update
//                 var result = await _authService.AuthenticateWithAzureAdAsync(azureAdId, email, firstName, lastName);

//                 if (!result.Success)
//                 {
//                     _logger.LogError($"Azure AD authentication failed: {result.Message}");
//                     return Unauthorized(new { message = result.Message });
//                 }

//                 _logger.LogInformation($"User authenticated successfully: {email}");

//                 return Ok(new
//                 {
//                     userId = result.User.Id,
//                     email = result.User.Email,
//                     firstName = result.User.FirstName,
//                     lastName = result.User.LastName,
//                     accessToken = result.Token,
//                     expiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes)
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Azure AD callback error: {ex.Message}");
//                 return Unauthorized(new { message = "Authentication failed" });
//             }
//         }

//         [HttpPost("register")]
//         public async Task<IActionResult> Register([FromBody] RegisterDto request)
//         {
//             try
//             {
//                 var result = await _authService.RegisterAsync(request.Email, request.FirstName, request.LastName, request.Password);

//                 if (!result.Success)
//                 {
//                     return BadRequest(new { message = result.Message });
//                 }

//                 return Created("", new
//                 {
//                     userId = result.User.Id,
//                     email = result.User.Email,
//                     firstName = result.User.FirstName,
//                     lastName = result.User.LastName,
//                     accessToken = result.Token
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Registration error: {ex.Message}");
//                 return BadRequest(new { message = "Registration failed" });
//             }
//         }

//         [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] LoginDto request)
//         {
//             try
//             {
//                 var result = await _authService.LoginAsync(request.Email, request.Password);

//                 if (!result.Success)
//                 {
//                     return Unauthorized(new { message = result.Message });
//                 }

//                 return Ok(new
//                 {
//                     userId = result.User.Id,
//                     email = result.User.Email,
//                     firstName = result.User.FirstName,
//                     lastName = result.User.LastName,
//                     accessToken = result.Token
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Login error: {ex.Message}");
//                 return Unauthorized(new { message = "Login failed" });
//             }
//         }

//         [HttpGet("profile")]
//         public async Task<IActionResult> GetProfile()
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized();
//                 }

//                 var user = await _authService.GetUserByIdAsync(Guid.Parse(userId));
//                 if (user == null)
//                 {
//                     return NotFound();
//                 }

//                 return Ok(new
//                 {
//                     userId = user.Id,
//                     email = user.Email,
//                     firstName = user.FirstName,
//                     lastName = user.LastName,
//                     profilePictureUrl = user.ProfilePictureUrl
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Get profile error: {ex.Message}");
//                 return StatusCode(500, new { message = "Error retrieving profile" });
//             }
//         }

//         [HttpPut("profile")]
//         public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (string.IsNullOrEmpty(userId))
//                 {
//                     return Unauthorized();
//                 }

//                 var result = await _authService.UpdateProfileAsync(Guid.Parse(userId), request);
//                 if (!result.Success)
//                 {
//                     return BadRequest(new { message = result.Message });
//                 }

//                 return Ok(new
//                 {
//                     userId = result.User.Id,
//                     email = result.User.Email,
//                     firstName = result.User.FirstName,
//                     lastName = result.User.LastName,
//                     profilePictureUrl = result.User.ProfilePictureUrl
//                 });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Update profile error: {ex.Message}");
//                 return StatusCode(500, new { message = "Error updating profile" });
//             }
//         }

//         [HttpPost("logout")]
//         public async Task<IActionResult> Logout()
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//                 if (!string.IsNullOrEmpty(userId))
//                 {
//                     await _authService.LogoutAsync(Guid.Parse(userId));
//                 }

//                 return Ok(new { message = "Logout successful" });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Logout error: {ex.Message}");
//                 return StatusCode(500, new { message = "Error during logout" });
//             }
//         }

//         private ClaimsPrincipal ValidateAzureAdToken(string token)
//         {
//             try
//             {
//                 var handler = new JwtSecurityTokenHandler();
//                 var jwtToken = handler.ReadJwtToken(token);

//                 // For testing/development, we'll just extract claims without strict validation
//                 // In production, validate against Azure AD's public keys
//                 var claims = jwtToken.Claims;
//                 var claimsIdentity = new ClaimsIdentity(claims, "Bearer");
//                 var principal = new ClaimsPrincipal(claimsIdentity);

//                 return principal;
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Token validation error: {ex.Message}");
//                 return null;
//             }
//         }
//     }
// }


using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Infrastructure.Settings;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace EventTracker.Auth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AzureAdSettings _azureAdConfig;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            IOptions<AzureAdSettings> azureAdConfig,
            ILogger<AuthController> logger)
        {
            _azureAdConfig = azureAdConfig.Value;
            _logger = logger;
        }

        [HttpGet("azure-ad-login-url")]
        public IActionResult GetAzureAdLoginUrl()
        {
            try
            {
                _logger.LogInformation("Getting Azure AD login URL");
                _logger.LogInformation($"Redirect URI: {_azureAdConfig.RedirectUri}");

                // Build the Azure AD authorization URL
                var loginUrl = $"https://login.microsoftonline.com/{_azureAdConfig.TenantId}/oauth2/v2.0/authorize?" +
                    $"client_id={_azureAdConfig.ClientId}&" +
                    $"redirect_uri={Uri.EscapeDataString(_azureAdConfig.RedirectUri)}&" +
                    $"response_type=token&" +
                    $"scope={Uri.EscapeDataString("openid profile email")}&" +
                    $"response_mode=fragment&" +
                    $"prompt=login";

                _logger.LogInformation($"Azure AD login URL generated successfully");

                return Ok(new { loginUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating Azure AD login URL: {ex.Message}");
                return BadRequest(new { message = "Failed to generate Azure AD login URL" });
            }
        }

        [HttpPost("azure-ad-callback")]
        public IActionResult AzureAdCallback([FromBody] AzureAdCallbackDto request)
        {
            try
            {
                _logger.LogInformation("=== Azure AD CALLBACK START ===");

                if (request == null || string.IsNullOrEmpty(request.AccessToken))
                {
                    _logger.LogError("No access token in request");
                    return Unauthorized(new { message = "No token provided" });
                }

                _logger.LogInformation("Validating Azure AD token...");
                var principal = ValidateAzureAdToken(request.AccessToken);
                
                if (principal == null)
                {
                    _logger.LogError("Token validation returned null");
                    return Unauthorized(new { message = "Invalid token" });
                }

                _logger.LogInformation($"Token validated successfully. Claims count: {principal.Claims.Count()}");

                // Extract using Azure AD claim types (lowercase names)
                var azureAdId = principal.FindFirst("oid")?.Value;  // Object ID in Azure AD
                var email = principal.FindFirst("email")?.Value;
                var firstName = principal.FindFirst("given_name")?.Value ?? "User";
                var lastName = principal.FindFirst("family_name")?.Value ?? "";

                _logger.LogInformation($"Extracted claims:");
                _logger.LogInformation($"  - AzureAdId: {azureAdId}");
                _logger.LogInformation($"  - Email: {email}");
                _logger.LogInformation($"  - FirstName: {firstName}");
                _logger.LogInformation($"  - LastName: {lastName}");

                if (string.IsNullOrEmpty(azureAdId) || string.IsNullOrEmpty(email))
                {
                    _logger.LogError($"Missing required claims. AzureAdId: {azureAdId}, Email: {email}");
                    return Unauthorized(new { message = "Missing required information from token" });
                }

                _logger.LogInformation($"✅ Azure AD user authenticated: {email}");

                var response = new
                {
                    userId = azureAdId,
                    email = email,
                    firstName = firstName,
                    lastName = lastName,
                    accessToken = "internal-jwt-token-" + Guid.NewGuid().ToString(),
                    expiresAt = DateTime.UtcNow.AddHours(1)
                };

                _logger.LogInformation($"✅ Returning success response for user: {email}");
                _logger.LogInformation("=== Azure AD CALLBACK END ===");

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Azure AD callback exception: {ex.Message}");
                _logger.LogError($"❌ Stack trace: {ex.StackTrace}");
                return Unauthorized(new { message = "Authentication failed: " + ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto request)
        {
            try
            {
                _logger.LogInformation($"Login attempt: {request.Email} as {request.Role}");

                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    _logger.LogError("Email or password is empty");
                    return Unauthorized(new { message = "Email and password are required" });
                }
                // For demo: Accept any email/password combination
                // In production, verify against database with hashed passwords
                if (string.IsNullOrEmpty(request.Password) || request.Password.Length < 3)
                {
                    _logger.LogError("Invalid password");
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Parse the email to get name
                var nameParts = request.Email.Split('@')[0].Split('.');
                var firstName = nameParts.Length > 0 ? nameParts[0] : "User";
                var lastName = nameParts.Length > 1 ? nameParts[1] : "";

                _logger.LogInformation($"✅ User authenticated: {request.Email} as {request.Role}");

                var response = new
                {
                    userId = Guid.NewGuid().ToString(),
                    email = request.Email,
                    firstName = firstName,
                    lastName = lastName,
                    role = request.Role,
                    accessToken = GenerateJwtToken(request.Email, request.Role),
                    expiresAt = DateTime.UtcNow.AddHours(1)
                };

                 _logger.LogInformation($"✅ Returning success response for user: {request.Email}");

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Login exception: {ex.Message}");
                return Unauthorized(new { message = "Login failed: " + ex.Message });
            }
        }

        private string GenerateJwtToken(string email, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes("your-secret-key-minimum-32-characters-long");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email),
                    new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                    new Claim("role", role)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = "event-tracker-auth",
                Audience = "event-tracker-app",
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private ClaimsPrincipal ValidateAzureAdToken(string token)
        {
            try
            {
                _logger.LogInformation($"Starting token validation...");
                
                var handler = new JwtSecurityTokenHandler();
                
                if (!handler.CanReadToken(token))
                {
                    _logger.LogError("Token cannot be read by JWT handler");
                    return null;
                }

                _logger.LogInformation("Token can be read");
                
                var jwtToken = handler.ReadJwtToken(token);
                
                _logger.LogInformation($"JWT Token parsed successfully");
                _logger.LogInformation($"Token claims count: {jwtToken.Claims.Count()}");

                // Log all claims
                foreach (var claim in jwtToken.Claims)
                {
                    _logger.LogInformation($"  Claim: {claim.Type} = {claim.Value}");
                }

                var claims = jwtToken.Claims;
                var claimsIdentity = new ClaimsIdentity(claims, "Bearer");
                var principal = new ClaimsPrincipal(claimsIdentity);

                _logger.LogInformation("ClaimsPrincipal created successfully");

                return principal;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Token validation error: {ex.Message}");
                _logger.LogError($"❌ Exception type: {ex.GetType().Name}");
                return null;
            }
        }
    }
}