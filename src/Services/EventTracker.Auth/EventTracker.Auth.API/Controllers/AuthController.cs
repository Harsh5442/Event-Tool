using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Application.Services;

namespace EventTracker.Auth.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// User login endpoint
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                _logger.LogInformation($"Login attempt for email: {request.Email}");
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
        }

        /// <summary>
        /// User registration endpoint
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            try
            {
                _logger.LogInformation($"Registration attempt for email: {request.Email}");
                var response = await _authService.RegisterAsync(request);
                return StatusCode(201, response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get current user profile (requires authentication)
        /// </summary>
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "Invalid user ID in token" });

                var user = await _authService.GetUserProfileAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Get profile error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Update user profile (requires authentication)
        /// </summary>
        [HttpPut("profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "Invalid user ID in token" });

                var user = await _authService.UpdateUserProfileAsync(userId, request);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Update profile error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Logout endpoint
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!Guid.TryParse(userIdClaim, out var userId))
                    return Unauthorized(new { message = "Invalid user ID in token" });

                await _authService.LogoutAsync(userId);
                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Logout error: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Refresh token endpoint
        /// </summary>
        [HttpPost("refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            try
            {
                var response = await _authService.RefreshTokenAsync(refreshToken);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Refresh token error: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get Azure AD login URL for SSO
        /// </summary>
        [HttpGet("azure-ad-login-url")]
        [AllowAnonymous]
        public IActionResult GetAzureAdLoginUrl()
        {
            try
            {
                var azureAdService = HttpContext.RequestServices.GetRequiredService<IAzureAdService>();
                var loginUrl = azureAdService.GetAuthorizationUrl();
                _logger.LogInformation("Azure AD login URL requested");
                return Ok(new { loginUrl });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting Azure AD login URL: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Verify Azure AD token and create user session
        /// </summary>
        [HttpPost("azure-ad-callback")]
        [AllowAnonymous]
        public async Task<IActionResult> AzureAdCallback([FromBody] AzureAdCallbackDto request)
        {
            try
            {
                _logger.LogInformation("Azure AD callback received");
                var azureAdService = HttpContext.RequestServices.GetRequiredService<IAzureAdService>();
                var response = await azureAdService.AuthenticateWithAzureAdAsync(request.AccessToken);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Azure AD callback error: {ex.Message}");
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}