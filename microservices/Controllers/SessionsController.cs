using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Services.Interfaces;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SessionsController : ControllerBase
    {
        private readonly ISessionService _sessionService;

        public SessionsController(ISessionService sessionService)
        {
            _sessionService = sessionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _sessionService.GetAllSessionsAsync();
            return Ok(sessions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSessionById(int id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null)
                return NotFound();

            return Ok(session);
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetSessionsByEventId(int eventId)
        {
            var sessions = await _sessionService.GetSessionsByEventIdAsync(eventId);
            return Ok(sessions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest request)
        {
            try
            {
                var session = await _sessionService.CreateSessionAsync(request);
                return CreatedAtAction(nameof(GetSessionById), new { id = session.session_id }, session);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSession(int id, [FromBody] CreateSessionRequest request)
        {
            var session = await _sessionService.UpdateSessionAsync(id, request);
            if (session == null)
                return NotFound();

            return Ok(session);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var result = await _sessionService.DeleteSessionAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}