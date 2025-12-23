using EventManagementSystem.Data;
using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;
using EventManagementSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Services
{
    public class AttendeeService : IAttendeeService
    {
        private readonly EventManagementDbContext _context;

        public AttendeeService(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Attendee>> GetAllAttendeesAsync()
        {
            return await _context.Attendees.ToListAsync();
        }

        public async Task<Attendee?> GetAttendeeByIdAsync(int id)
        {
            return await _context.Attendees.FindAsync(id);
        }

        public async Task<IEnumerable<Attendee>> GetAttendeesByEventIdAsync(int eventId)
        {
            return await _context.Attendees
                .Where(a => a.event_id == eventId)
                .ToListAsync();
        }

        public async Task<Attendee> CreateAttendeeAsync(CreateAttendeeRequest request)
        {
            if (await _context.Attendees.AnyAsync(a => a.event_id == request.EventId && a.user_id == request.UserId))
            {
                throw new InvalidOperationException("User is already registered for this event.");
            }

            var eventEntity = await _context.Events.FindAsync(request.EventId);
            if (eventEntity == null)
                throw new InvalidOperationException("Event not found.");

            if (eventEntity.capacity.HasValue)
            {
                var currentAttendeeCount = await _context.Attendees.CountAsync(a => a.event_id == request.EventId);
                if (currentAttendeeCount >= eventEntity.capacity.Value)
                    throw new InvalidOperationException("Event is at maximum capacity.");
            }

            var attendee = new Attendee
            {
                event_id = request.EventId,
                user_id = request.UserId,
                ticket_type = request.TicketType, // Direct string assignment
                check_in_status = false
            };

            _context.Attendees.Add(attendee);
            await _context.SaveChangesAsync();
            return attendee;
        }

        public async Task<bool> DeleteAttendeeAsync(int id)
        {
            var attendee = await _context.Attendees.FindAsync(id);
            if (attendee == null) return false;

            _context.Attendees.Remove(attendee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckInAttendeeAsync(int id)
        {
            var attendee = await _context.Attendees.FindAsync(id);
            if (attendee == null) return false;

            attendee.check_in_status = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}