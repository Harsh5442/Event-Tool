using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Services.Interfaces
{
    public interface ISessionService
    {
        Task<IEnumerable<Session>> GetAllSessionsAsync();
        Task<Session?> GetSessionByIdAsync(int id);
        Task<IEnumerable<Session>> GetSessionsByEventIdAsync(int eventId);
        Task<Session> CreateSessionAsync(CreateSessionRequest request);
        Task<Session?> UpdateSessionAsync(int id, CreateSessionRequest request);
        Task<bool> DeleteSessionAsync(int id);
    }
}