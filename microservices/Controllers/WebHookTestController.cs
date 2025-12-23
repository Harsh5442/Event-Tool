using Microsoft.AspNetCore.Mvc;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WebHookTestController : ControllerBase
    {
        [HttpPost("receive")]
        public async Task<IActionResult> ReceiveWebHook([FromBody] object payload)
        {
            try
            {
                var timestamp = DateTime.UtcNow;
                var headers = Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

                // Log the received webhook
                Console.WriteLine("🔔 WEBHOOK RECEIVED!");
                Console.WriteLine($"⏰ Timestamp: {timestamp}");
                Console.WriteLine($"📦 Payload: {System.Text.Json.JsonSerializer.Serialize(payload)}");
                Console.WriteLine($"📋 Headers: {System.Text.Json.JsonSerializer.Serialize(headers)}");

                // Return success response
                return Ok(new
                {
                    message = "Webhook received successfully",
                    timestamp = timestamp,
                    received = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Webhook processing failed: {ex.Message}");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("test-endpoint")]
        public IActionResult TestEndpoint()
        {
            return Ok(new
            {
                message = "WebHook test endpoint is working",
                timestamp = DateTime.UtcNow,
                url = $"{Request.Scheme}://{Request.Host}/api/WebHookTest/receive"
            });
        }
    }
}