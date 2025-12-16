using EventTracker.Auth.Application.DTOs;

namespace EventTracker.Auth.Application.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
        Task<LoginResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<LoginResponseDto> RefreshTokenAsync(string refreshToken);
        Task LogoutAsync(Guid userId);
        Task<UserDto> GetUserProfileAsync(Guid userId);
        Task<UserDto> UpdateUserProfileAsync(Guid userId, UpdateUserDto request);
    }
}