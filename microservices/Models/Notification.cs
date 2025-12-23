using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Notifications", Schema = "EventManagement")]
    public class Notification
    {
        [Key]
        public int notification_id { get; set; }

        public int user_id { get; set; }
        public int? event_id { get; set; }

        [Required]
        [StringLength(20)]
        public string type { get; set; } = "General"; // Changed to string

        [Required]
        public string message { get; set; } = string.Empty;
    }
}