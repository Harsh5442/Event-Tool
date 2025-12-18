// using System;
// using System.Threading.Tasks;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.Logging;
// using EventTracker.Auth.Application.DTOs;
// using EventTracker.Auth.Domain.Entities;
// using EventTracker.Auth.Domain.Exceptions;
// using EventTracker.Auth.Domain.Interfaces;
// using AutoMapper;

// namespace EventTracker.Auth.Application.Services
// {
//     public class AuthService : IAuthService
//     {
//         private readonly IUserRepository _userRepository;
//         private readonly IMapper _mapper;
//         private readonly IConfiguration _configuration;
//         private readonly ILogger<AuthService> _logger;

//         public AuthService(
//             IUserRepository userRepository,
//             IMapper mapper,
//             IConfiguration configuration,
//             ILogger<AuthService> logger)
//         {
//             _userRepository = userRepository;
//             _mapper = mapper;
//             _configuration = configuration;
//             _logger = logger;
//         }

//         public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
//         {
//             try
//             {
//                 if (string.IsNullOrEmpty(request.Email))
//                     throw new InvalidEmailException(request.Email ?? "empty");

//                 var user = await _userRepository.GetByEmailAsync(request.Email);
//                 if (user == null)
//                     throw new UserNotFoundException(Guid.Empty);

//                 if (!user.IsActive)
//                     throw new DomainException("User account is inactive");

//                 user.LastLoginAt = DateTime.UtcNow;
//                 await _userRepository.UpdateAsync(user);

//                 var accessToken = GenerateAccessToken(user);
//                 var refreshToken = GenerateRefreshToken();

//                 return new LoginResponseDto
//                 {
//                     UserId = user.Id,
//                     Email = user.Email,
//                     FirstName = user.FirstName,
//                     LastName = user.LastName,
//                     AccessToken = accessToken,
//                     RefreshToken = refreshToken,
//                     ExpiresAt = DateTime.UtcNow.AddHours(1)
//                 };
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError($"Login failed: {ex.Message}");
//                 throw;
//             }
//         }

//         public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
//         {
//             var existingUser = await _userRepository.GetByEmailAsync(request.Email);
//             if (existingUser != null)
//                 throw new DomainException("User with this email already exists");

//             var user = new User
//             {
//                 Id = Guid.NewGuid(),
//                 Email = request.Email,
//                 FirstName = request.FirstName,
//                 LastName = request.LastName,
//                 Role = Domain.Enums.UserRole.Participant,
//                 CreatedAt = DateTime.UtcNow
//             };

//             await _userRepository.CreateAsync(user);
//             return await LoginAsync(new LoginRequestDto { Email = request.Email, Password = request.Password });
//         }

//         public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
//         {
//             throw new NotImplementedException();
//         }

//         public async Task LogoutAsync(Guid userId)
//         {
//             _logger.LogInformation($"User {userId} logged out");
//         }

//         public async Task<UserDto> GetUserProfileAsync(Guid userId)
//         {
//             var user = await _userRepository.GetByIdAsync(userId);
//             if (user == null)
//                 throw new UserNotFoundException(userId);

//             return _mapper.Map<UserDto>(user);
//         }

//         public async Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserDto request)
//         {
//             var user = await _userRepository.GetByIdAsync(userId);
//             if (user == null)
//                 throw new UserNotFoundException(userId);

//             user.FirstName = request.FirstName ?? user.FirstName;
//             user.LastName = request.LastName ?? user.LastName;
//             user.ProfilePictureUrl = request.ProfilePictureUrl ?? user.ProfilePictureUrl;
//             user.UpdatedAt = DateTime.UtcNow;

//             await _userRepository.UpdateAsync(user);
//             return _mapper.Map<UserDto>(user);
//         }

//         private string GenerateAccessToken(User user)
//         {
//             // Placeholder - will implement in API layer
//             return "temp-token";
//         }

//         private string GenerateRefreshToken()
//         {
//             return Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
//         }
//     }
// }

using EventTracker.Auth.Domain.Entities;
using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Application.Interfaces;
using EventTracker.Auth.Infrastructure.Persistence;
// using EventTracker.Auth.Infrastructure.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EventTracker.Auth.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using EventTracker.Auth.Infrastructure.Settings;
using Microsoft.Extensions.Logging;

namespace EventTracker.Auth.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly AuthDbContext _dbContext;
        private readonly JwtSettings _jwtSettings;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            AuthDbContext dbContext,
            IOptions<JwtSettings> jwtSettings,
            ILogger<AuthService> logger)
        {
            _dbContext = dbContext;
            _jwtSettings = jwtSettings.Value;
            _logger = logger;
        }

        // Azure AD Authentication
        public async Task<AuthResult> AuthenticateWithAzureAdAsync(string azureAdId, string email, string firstName, string lastName)
        {
            try
            {
                _logger.LogInformation($"Authenticating user with Azure AD ID: {azureAdId}");

                // Check if user exists
                var user = await _dbContext.Users
                    .Include(u => u.Profiles)
                    .FirstOrDefaultAsync(u => u.AzureAdId == azureAdId);

                if (user == null)
                {
                    _logger.LogInformation($"Creating new user from Azure AD: {email}");
                    
                    // Create new user
                    user = new User
                    {
                        Id = Guid.NewGuid(),
                        AzureAdId = azureAdId,
                        Email = email,
                        FirstName = firstName,
                        LastName = lastName,
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                        Role = UserRole.Participant
                    };

                    _dbContext.Users.Add(user);
                    await _dbContext.SaveChangesAsync();

                    _logger.LogInformation($"User created successfully: {email}");
                }
                else
                {
                    _logger.LogInformation($"User already exists: {email}");
                    // Update last login time
                    user.LastLoginAt = DateTime.UtcNow;
                    await _dbContext.SaveChangesAsync();
                }

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResult
                {
                    Success = true,
                    Message = "Authentication successful",
                    User = user,
                    Token = token
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Azure AD authentication error: {ex.Message}");
                return new AuthResult
                {
                    Success = false,
                    Message = "Authentication failed: " + ex.Message
                };
            }
        }

        // Traditional Registration
        public async Task<AuthResult> RegisterAsync(string email, string firstName, string lastName, string password)
        {
            try
            {
                _logger.LogInformation($"Registering new user: {email}");

                // Check if user exists
                var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (existingUser != null)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Email already registered"
                    };
                }

                // Create new user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Role = UserRole.Participant
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"User registered successfully: {email}");

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResult
                {
                    Success = true,
                    Message = "Registration successful",
                    User = user,
                    Token = token
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Registration error: {ex.Message}");
                return new AuthResult
                {
                    Success = false,
                    Message = "Registration failed: " + ex.Message
                };
            }
        }

        // Traditional Login
        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            try
            {
                _logger.LogInformation($"User login attempt: {email}");

                // Find user by email
                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                // Update last login time
                user.LastLoginAt = DateTime.UtcNow;
                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"User logged in successfully: {email}");

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResult
                {
                    Success = true,
                    Message = "Login successful",
                    User = user,
                    Token = token
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return new AuthResult
                {
                    Success = false,
                    Message = "Login failed: " + ex.Message
                };
            }
        }

        // Get User By ID
        public async Task<User> GetUserByIdAsync(Guid userId)
        {
            try
            {
                return await _dbContext.Users
                    .Include(u => u.Profiles)
                    .FirstOrDefaultAsync(u => u.Id == userId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user: {ex.Message}");
                return null;
            }
        }

        // Update Profile
        public async Task<AuthResult> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto)
        {
            try
            {
                _logger.LogInformation($"Updating profile for user: {userId}");

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Update fields
                if (!string.IsNullOrEmpty(updateProfileDto.FirstName))
                    user.FirstName = updateProfileDto.FirstName;

                if (!string.IsNullOrEmpty(updateProfileDto.LastName))
                    user.LastName = updateProfileDto.LastName;

                if (!string.IsNullOrEmpty(updateProfileDto.ProfilePictureUrl))
                    user.ProfilePictureUrl = updateProfileDto.ProfilePictureUrl;

                user.UpdatedAt = DateTime.UtcNow;

                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"Profile updated successfully for user: {userId}");

                return new AuthResult
                {
                    Success = true,
                    Message = "Profile updated successfully",
                    User = user
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating profile: {ex.Message}");
                return new AuthResult
                {
                    Success = false,
                    Message = "Failed to update profile: " + ex.Message
                };
            }
        }

        // Logout
        public async Task LogoutAsync(Guid userId)
        {
            try
            {
                _logger.LogInformation($"User logout: {userId}");

                var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                {
                    user.UpdatedAt = DateTime.UtcNow;
                    await _dbContext.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Logout error: {ex.Message}");
            }
        }

        // Generate JWT Token
        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSettings.SecretKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim("role", user.Role.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            throw new NotImplementedException();
        }

        public Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            throw new NotImplementedException();
        }

        public Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException();
        }

        public Task<UserDto> GetUserProfileAsync(Guid userId)
        {
            throw new NotImplementedException();
        }

        public Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserDto request)
        {
            throw new NotImplementedException();
        }
    }
}