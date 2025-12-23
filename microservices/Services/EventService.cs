using EventManagementSystem.Data;
using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;
using EventManagementSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Services
{
    public class EventService : IEventService
    {
        private readonly EventManagementDbContext _context;

        public EventService(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events.ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(int id)
        {
            return await _context.Events.FindAsync(id);
        }

        public async Task<Event> CreateEventAsync(CreateEventRequest request)
        {
            var eventEntity = new Event
            {
                name = request.Name,
                description = request.Description,
                start_date = request.StartDate,
                end_date = request.EndDate,
                venue = request.Venue,
                capacity = request.Capacity,
                status = request.Status, // Direct string assignment
                created_by = request.CreatedBy
            };

            _context.Events.Add(eventEntity);
            await _context.SaveChangesAsync();
            return eventEntity;
        }

        public async Task<Event?> UpdateEventAsync(int id, CreateEventRequest request)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity == null) return null;

            eventEntity.name = request.Name;
            eventEntity.description = request.Description;
            eventEntity.start_date = request.StartDate;
            eventEntity.end_date = request.EndDate;
            eventEntity.venue = request.Venue;
            eventEntity.capacity = request.Capacity;
            eventEntity.status = request.Status; // Direct string assignment

            await _context.SaveChangesAsync();
            return eventEntity;
        }

        public async Task<bool> DeleteEventAsync(int id)
        {
            var eventEntity = await _context.Events.FindAsync(id);
            if (eventEntity == null) return false;

            _context.Events.Remove(eventEntity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}