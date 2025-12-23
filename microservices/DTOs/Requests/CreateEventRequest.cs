using System.ComponentModel.DataAnnotations;

namespace EventManagementSystem.DTOs.Requests
{
    public class CreateEventRequest
    {
        [Required]
        [StringLength(300)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        [StringLength(300)]
        public string? Venue { get; set; }

        public int? Capacity { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Changed to string

        [Required]
        public int CreatedBy { get; set; }
    }
}