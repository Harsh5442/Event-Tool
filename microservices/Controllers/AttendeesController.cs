using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Services.Interfaces;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttendeesController : ControllerBase
    {
        private readonly IAttendeeService _attendeeService;

        public AttendeesController(IAttendeeService attendeeService)
        {
            _attendeeService = attendeeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAttendees()
        {
            var attendees = await _attendeeService.GetAllAttendeesAsync();
            return Ok(attendees);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAttendeeById(int id)
        {
            var attendee = await _attendeeService.GetAttendeeByIdAsync(id);
            if (attendee == null)
                return NotFound();

            return Ok(attendee);
        }

        [HttpGet("event/{eventId}")]
        public async Task<IActionResult> GetAttendeesByEventId(int eventId)
        {
            var attendees = await _attendeeService.GetAttendeesByEventIdAsync(eventId);
            return Ok(attendees);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAttendee([FromBody] CreateAttendeeRequest request)
        {
            try
            {
                var attendee = await _attendeeService.CreateAttendeeAsync(request);
                return CreatedAtAction(nameof(GetAttendeeById), new { id = attendee.attendee_id }, attendee);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("{id}/check-in")]
        public async Task<IActionResult> CheckInAttendee(int id)
        {
            var result = await _attendeeService.CheckInAttendeeAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendee(int id)
        {
            var result = await _attendeeService.DeleteAttendeeAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}