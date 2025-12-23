using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Events", Schema = "EventManagement")]
    public class Event
    {
        [Key]
        public int event_id { get; set; }

        [Required]
        [StringLength(300)]
        public string name { get; set; } = string.Empty;

        public string? description { get; set; }

        public DateTime start_date { get; set; }
        public DateTime? end_date { get; set; }

        [StringLength(300)]
        public string? venue { get; set; }

        public int? capacity { get; set; }

        [Required]
        [StringLength(20)]
        public string status { get; set; } = "Active"; // Changed to string

        public int created_by { get; set; }
    }
}