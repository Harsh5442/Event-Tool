using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Attendees", Schema = "EventManagement")]
    public class Attendee
    {
        [Key]
        public int attendee_id { get; set; }

        public int event_id { get; set; }
        public int user_id { get; set; }

        [StringLength(100)]
        public string? ticket_type { get; set; } = "Standard"; // Changed to string

        public bool check_in_status { get; set; } = false;
    }
}