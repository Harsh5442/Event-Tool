using EventManagementSystem.Data;
using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;
using EventManagementSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Services
{
    public class SessionService : ISessionService
    {
        private readonly EventManagementDbContext _context;

        public SessionService(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Session>> GetAllSessionsAsync()
        {
            return await _context.Sessions.ToListAsync();
        }

        public async Task<Session?> GetSessionByIdAsync(int id)
        {
            return await _context.Sessions.FindAsync(id);
        }

        public async Task<IEnumerable<Session>> GetSessionsByEventIdAsync(int eventId)
        {
            return await _context.Sessions
                .Where(s => s.event_id == eventId)
                .ToListAsync();
        }

        public async Task<Session> CreateSessionAsync(CreateSessionRequest request)
        {
            if (!await _context.Events.AnyAsync(e => e.event_id == request.EventId))
                throw new InvalidOperationException("Event not found.");

            var session = new Session
            {
                event_id = request.EventId,
                title = request.Title,
                description = request.Description,
                start_time = request.StartTime,
                end_time = request.EndTime,
                speaker_id = request.SpeakerId,
                created_by = request.CreatedBy
            };

            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<Session?> UpdateSessionAsync(int id, CreateSessionRequest request)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return null;

            session.title = request.Title;
            session.description = request.Description;
            session.start_time = request.StartTime;
            session.end_time = request.EndTime;
            session.speaker_id = request.SpeakerId;

            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<bool> DeleteSessionAsync(int id)
        {
            var session = await _context.Sessions.FindAsync(id);
            if (session == null) return false;

            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}