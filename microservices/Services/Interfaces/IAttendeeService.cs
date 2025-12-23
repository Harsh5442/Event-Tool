using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Services.Interfaces
{
    public interface IAttendeeService
    {
        Task<IEnumerable<Attendee>> GetAllAttendeesAsync();
        Task<Attendee?> GetAttendeeByIdAsync(int id);
        Task<IEnumerable<Attendee>> GetAttendeesByEventIdAsync(int eventId);
        Task<Attendee> CreateAttendeeAsync(CreateAttendeeRequest request);
        Task<bool> DeleteAttendeeAsync(int id);
        Task<bool> CheckInAttendeeAsync(int id);
    }
}