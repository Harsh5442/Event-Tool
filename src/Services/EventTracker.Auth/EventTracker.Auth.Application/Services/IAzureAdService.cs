using EventTracker.Auth.Application.DTOs;

namespace EventTracker.Auth.Application.Services
{
    public interface IAzureAdService
    {
        Task<LoginResponseDto> AuthenticateWithAzureAdAsync(string accessToken);
        string GetAuthorizationUrl();
    }
}