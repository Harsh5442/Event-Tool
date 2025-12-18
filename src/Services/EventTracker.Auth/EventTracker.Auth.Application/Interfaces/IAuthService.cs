// using EventTracker.Auth.Domain.Entities;
// using EventTracker.Auth.Application.DTOs;

// namespace EventTracker.Auth.Application.Interfaces
// {
//     public interface IAuthService
//     {
//         // Azure AD Authentication
//         Task<AuthResult> AuthenticateWithAzureAdAsync(string azureAdId, string email, string firstName, string lastName);

//         // Traditional Authentication
//         Task<AuthResult> RegisterAsync(string email, string firstName, string lastName, string password);
//         Task<AuthResult> LoginAsync(string email, string password);
        
//         // Profile Management
//         Task<User> GetUserByIdAsync(Guid userId);
//         Task<AuthResult> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto);
        
//         // Logout
//         Task LogoutAsync(Guid userId);
//     }

//     public class AuthResult
//     {
//         public bool Success { get; set; }
//         public string Message { get; set; }
//         public User User { get; set; }
//         public string Token { get; set; }
//     }
// }

using EventTracker.Auth.Domain.Entities;
using EventTracker.Auth.Application.DTOs;

namespace EventTracker.Auth.Application.Interfaces
{
    public interface IAuthService
    {
        // Azure AD Authentication
        Task<AuthResult> AuthenticateWithAzureAdAsync(string azureAdId, string email, string firstName, string lastName);

        // Traditional Authentication
        Task<AuthResult> RegisterAsync(string email, string firstName, string lastName, string password);
        Task<AuthResult> LoginAsync(string email, string password);
        
        // Profile Management
        Task<User> GetUserByIdAsync(Guid userId);
        Task<AuthResult> UpdateProfileAsync(Guid userId, UpdateProfileDto updateProfileDto);
        
        // Logout
        Task LogoutAsync(Guid userId);
    }

    public class AuthResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public User User { get; set; }
        public string Token { get; set; }
    }
}