using System.ComponentModel.DataAnnotations;

namespace EventManagementSystem.DTOs.Requests
{
    public class CreateSessionRequest
    {
        [Required]
        public int EventId { get; set; }

        [Required]
        [StringLength(300)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public int? SpeakerId { get; set; }

        [Required]
        public int CreatedBy { get; set; }
    }
}