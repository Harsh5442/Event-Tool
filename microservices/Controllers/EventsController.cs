using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Services.Interfaces;
using EventManagementSystem.DTOs.Requests;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(int id)
        {
            var eventEntity = await _eventService.GetEventByIdAsync(id);
            if (eventEntity == null)
                return NotFound();

            return Ok(eventEntity);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventRequest request)
        {
            var eventEntity = await _eventService.CreateEventAsync(request);
            return CreatedAtAction(nameof(GetEventById), new { id = eventEntity.event_id }, eventEntity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] CreateEventRequest request)
        {
            var eventEntity = await _eventService.UpdateEventAsync(id, request);
            if (eventEntity == null)
                return NotFound();

            return Ok(eventEntity);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var result = await _eventService.DeleteEventAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}