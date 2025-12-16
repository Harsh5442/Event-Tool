using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using EventTracker.Auth.Application.DTOs;
using EventTracker.Auth.Domain.Entities;
using EventTracker.Auth.Domain.Exceptions;
using EventTracker.Auth.Domain.Interfaces;
using AutoMapper;

namespace EventTracker.Auth.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepository,
            IMapper mapper,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email))
                    throw new InvalidEmailException(request.Email ?? "empty");

                var user = await _userRepository.GetByEmailAsync(request.Email);
                if (user == null)
                    throw new UserNotFoundException(Guid.Empty);

                if (!user.IsActive)
                    throw new DomainException("User account is inactive");

                user.LastLoginAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);

                var accessToken = GenerateAccessToken(user);
                var refreshToken = GenerateRefreshToken();

                return new LoginResponseDto
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresAt = DateTime.UtcNow.AddHours(1)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login failed: {ex.Message}");
                throw;
            }
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
                throw new DomainException("User with this email already exists");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Role = Domain.Enums.UserRole.Participant,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);
            return await LoginAsync(new LoginRequestDto { Email = request.Email, Password = request.Password });
        }

        public async Task<LoginResponseDto> RefreshTokenAsync(string refreshToken)
        {
            throw new NotImplementedException();
        }

        public async Task LogoutAsync(Guid userId)
        {
            _logger.LogInformation($"User {userId} logged out");
        }

        public async Task<UserDto> GetUserProfileAsync(Guid userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException(userId);

            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserDto request)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new UserNotFoundException(userId);

            user.FirstName = request.FirstName ?? user.FirstName;
            user.LastName = request.LastName ?? user.LastName;
            user.ProfilePictureUrl = request.ProfilePictureUrl ?? user.ProfilePictureUrl;
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return _mapper.Map<UserDto>(user);
        }

        private string GenerateAccessToken(User user)
        {
            // Placeholder - will implement in API layer
            return "temp-token";
        }

        private string GenerateRefreshToken()
        {
            return Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
        }
    }
}