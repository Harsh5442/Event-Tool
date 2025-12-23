using Microsoft.AspNetCore.Mvc;
using EventManagementSystem.Data;
using EventManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebHooksController : ControllerBase
    {
        private readonly EventManagementDbContext _context;

        public WebHooksController(EventManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWebHooks()
        {
            var webhooks = await _context.WebHooks.ToListAsync();
            return Ok(webhooks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWebHookById(int id)
        {
            var webhook = await _context.WebHooks.FindAsync(id);
            if (webhook == null)
                return NotFound();

            return Ok(webhook);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWebHook([FromBody] CreateWebHookRequest request)
        {
            var webhook = new WebHook
            {
                event_id = request.EventId,
                target_url = request.TargetUrl,
                event_type = request.EventType
            };

            _context.WebHooks.Add(webhook);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWebHookById), new { id = webhook.webhook_id }, webhook);
        }

        [HttpPost("{id}/trigger")]
        public async Task<IActionResult> TriggerWebHook(int id, [FromBody] object? testData = null)
        {
            var webhook = await _context.WebHooks.FindAsync(id);
            if (webhook == null)
                return NotFound();

            try
            {
                using var httpClient = new HttpClient();

                var payload = testData ?? new
                {
                    eventType = webhook.event_type,
                    eventId = webhook.event_id,
                    timestamp = DateTime.UtcNow,
                    webhookId = webhook.webhook_id,
                    message = "Test webhook triggered manually"
                };

                var json = System.Text.Json.JsonSerializer.Serialize(payload);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                Console.WriteLine($"🚀 Triggering webhook: {webhook.target_url}");
                Console.WriteLine($"📦 Payload: {json}");

                var response = await httpClient.PostAsync(webhook.target_url, content);
                var responseContent = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"✅ Webhook response: {response.StatusCode}");
                Console.WriteLine($"📥 Response content: {responseContent}");

                return Ok(new
                {
                    message = "Webhook triggered successfully",
                    statusCode = (int)response.StatusCode,
                    response = responseContent,
                    payload = payload
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook trigger failed: {ex.Message}");
                return BadRequest(new
                {
                    error = "Failed to trigger webhook",
                    message = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebHook(int id)
        {
            var webhook = await _context.WebHooks.FindAsync(id);
            if (webhook == null)
                return NotFound();

            _context.WebHooks.Remove(webhook);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateWebHookRequest
    {
        public int? EventId { get; set; }
        public string TargetUrl { get; set; } = string.Empty;
        public string EventType { get; set; } = string.Empty;
    }
}