


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