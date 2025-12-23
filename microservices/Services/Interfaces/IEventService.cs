using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<Event>> GetAllEventsAsync();
        Task<Event?> GetEventByIdAsync(int id);
        Task<Event> CreateEventAsync(CreateEventRequest request);
        Task<Event?> UpdateEventAsync(int id, CreateEventRequest request);
        Task<bool> DeleteEventAsync(int id);
    }
}