// using EventTracker.Auth.Application.DTOs;
// using EventTracker.Auth.Domain.Entities;
// using EventTracker.Auth.Domain.Exceptions;
// using EventTracker.Auth.Domain.Interfaces;
// using EventTracker.Auth.Domain.Enums;
// using AutoMapper;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Logging;
// using System.IdentityModel.Tokens.Jwt;

// namespace EventTracker.Auth.Application.Services
// {
//     public class AzureAdService : IAzureAdService
//     {
//         private readonly IUserRepository _userRepository;
//         private readonly IMapper _mapper;
//         private readonly IConfiguration _configuration;
//         private readonly ILogger<AzureAdService> _logger;

//         public AzureAdService(
//             IUserRepository userRepository,
//             IMapper mapper,
//             IConfiguration configuration,
//             ILogger<AzureAdService> logger)
//         {
//             _userRepository = userRepository;
//             _mapper = mapper;
//             _configuration = configuration;
//             _logger = logger;
//         }

//         public async Task<LoginResponseDto> AuthenticateWithAzureAdAsync(string accessToken)
//         {
//             try
//             {
//                 _logger.LogInformation("Authenticating with Azure AD token");

//                 // Decode the JWT token from Azure AD
//                 var handler = new JwtSecurityTokenHandler();
//                 var token = handler.ReadJwtToken(accessToken);

//                 // Extract claims from Azure AD token
//                 var azureAdId = token.Claims.FirstOrDefault(c => c.Type == "oid")?.Value 
//                     ?? token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                
//                 var email = token.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value 
//                     ?? token.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                
//                 var firstName = token.Claims.FirstOrDefault(c => c.Type == "given_name")?.Value ?? "User";
//                 var lastName = token.Claims.FirstOrDefault(c => c.Type == "family_name")?.Value ?? "";

//                 if (string.IsNullOrEmpty(azureAdId) || string.IsNullOrEmpty(email))
//                 {
//                     throw new DomainException("Invalid Azure AD token - missing required claims");
//                 }

//                 _logger.LogInformation($"Azure AD user: {email} (ID: {azureAdId})");

//                 // Check if user exists in our database
//                 var user = await _userRepository.GetByAzureAdIdAsync(azureAdId);

//                 if (user == null)
//                 {
//                     // Create new user from Azure AD
//                     _logger.LogInformation($"Creating new user from Azure AD: {email}");
                    
//                     user = new User
//                     {
//                         Id = Guid.NewGuid(),
//                         Email = email,
//                         FirstName = firstName,
//                         LastName = lastName,
//                         AzureAdId = azureAdId,
//                         Role = UserRole.Participant,
//                         IsActive = true,
//                         CreatedAt = DateTime.UtcNow
//                     };

//                     await _userRepository.CreateAsync(user);
//                 }
//                 else
//                 {
//                     // Update existing user's login time
//                     user.LastLoginAt = DateTime.UtcNow;
//                     await _userRepository.UpdateAsync(user);
//                 }

//                 // Generate our internal JWT token
//                 var internalAccessToken = GenerateInternalAccessToken(user);
//                 var refreshToken = GenerateRefreshToken();

//                 return new LoginResponseDto
//                 {
//                     UserId = user.Id,
//                     Email = user.Email,
//                     FirstName = user.FirstName,
//                     LastName = user.LastName,
//                     AccessToken = internalAccessToken,
//                     RefreshToken = refreshToken,
//                     ExpiresAt = DateTime.UtcNow.AddHours(1)
//                 };
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Azure AD authentication failed: {ex.Message}");
//                 throw;
//             }
//         }

//         public string GetAuthorizationUrl()
//         {
//             var tenantId = _configuration["AzureAd:TenantId"];
//             var clientId = _configuration["AzureAd:ClientId"];
//             var redirectUri = $"{_configuration["AzureAd:Instance"]}{tenantId}/oauth2/v2.0/authorize";

//             var authUrl = $"{redirectUri}?" +
//                 $"client_id={clientId}&" +
//                 $"redirect_uri=http://localhost:5000/signin-oidc&" +
//                 $"response_type=code&" +
//                 $"scope=openid profile email&" +
//                 $"response_mode=form_post";

//             return authUrl;
//         }

//         private string GenerateInternalAccessToken(User user)
//         {
//             // TODO: Implement JWT token generation (we'll do this in next step)
//             return "internal-token-placeholder";
//         }

//         private string GenerateRefreshToken()
//         {
//             return Convert.ToBase64String(
//                 System.Security.Cryptography.RandomNumberGenerator.GetBytes(64)
//             );
//         }
//     }
// }

using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Domain.Entities;
using EventTracker.Auth.Domain.Exceptions;
using EventTracker.Auth.Domain.Interfaces;
using EventTracker.Auth.Domain.Enums;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IdentityModel.Tokens.Jwt;

namespace EventTracker.Auth.Application.Services
{
    public class AzureAdService : IAzureAdService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AzureAdService> _logger;

        public AzureAdService(
            IUserRepository userRepository,
            IMapper mapper,
            IConfiguration configuration,
            ILogger<AzureAdService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto> AuthenticateWithAzureAdAsync(string accessToken)
        {
            try
            {
                _logger.LogInformation("Authenticating with Azure AD token");

                // Decode the JWT token from Azure AD
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(accessToken);

                // Extract claims from Azure AD token
                var azureAdId = token.Claims.FirstOrDefault(c => c.Type == "oid")?.Value 
                    ?? token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                
                var email = token.Claims.FirstOrDefault(c => c.Type == "preferred_username")?.Value 
                    ?? token.Claims.FirstOrDefault(c => c.Type == "email")?.Value;
                
                var firstName = token.Claims.FirstOrDefault(c => c.Type == "given_name")?.Value ?? "User";
                var lastName = token.Claims.FirstOrDefault(c => c.Type == "family_name")?.Value ?? "";

                if (string.IsNullOrEmpty(azureAdId) || string.IsNullOrEmpty(email))
                {
                    throw new DomainException("Invalid Azure AD token - missing required claims");
                }

                _logger.LogInformation($"Azure AD user: {email} (ID: {azureAdId})");

                // Check if user exists in our database
                var user = await _userRepository.GetByAzureAdIdAsync(azureAdId);

                if (user == null)
                {
                    // Create new user from Azure AD
                    _logger.LogInformation($"Creating new user from Azure AD: {email}");
                    
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        Email = email,
                        FirstName = firstName,
                        LastName = lastName,
                        AzureAdId = azureAdId,
                        Role = UserRole.Participant,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    await _userRepository.CreateAsync(user);
                }
                else
                {
                    // Update existing user's login time
                    user.LastLoginAt = DateTime.UtcNow;
                    await _userRepository.UpdateAsync(user);
                }

                // Generate our internal JWT token
                var internalAccessToken = GenerateInternalAccessToken(user);
                var refreshToken = GenerateRefreshToken();

                return new LoginResponseDto
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    AccessToken = internalAccessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(1)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Azure AD authentication failed: {ex.Message}");
                throw;
            }
        }

        public string GetAuthorizationUrl()
        {
            var tenantId = _configuration["AzureAd:TenantId"];
            var clientId = _configuration["AzureAd:ClientId"];
            var instance = _configuration["AzureAd:Instance"] ?? "https://login.microsoftonline.com/";

            var authUrl = $"{instance}{tenantId}/oauth2/v2.0/authorize?" +
                $"client_id={clientId}&" +
                $"redirect_uri=http://localhost:5000/api/auth/azure-ad-callback&" +
                $"response_type=code&" +
                $"scope=openid profile email&" +
                $"response_mode=form_post";

            return authUrl;
        }

        private string GenerateInternalAccessToken(User user)
        {
            // TODO: Implement JWT token generation (will do in next phase)
            return $"internal-token-{user.Id}";
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(
                System.Security.Cryptography.RandomNumberGenerator.GetBytes(64)
            );
        }
    }
}