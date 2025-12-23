using System.ComponentModel.DataAnnotations;

namespace EventManagementSystem.DTOs.Requests
{
    public class CreateAttendeeRequest
    {
        [Required]
        public int EventId { get; set; }

        [Required]
        public int UserId { get; set; }

        [StringLength(100)]
        public string? TicketType { get; set; } = "Standard"; // Changed to string
    }
}