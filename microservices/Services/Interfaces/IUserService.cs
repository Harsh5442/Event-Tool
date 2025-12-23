using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(CreateUserRequest request);
        Task<User?> UpdateUserAsync(int id, CreateUserRequest request);
        Task<bool> DeleteUserAsync(int id);
    }
}