using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Messages", Schema = "EventManagement")]
    public class Message
    {
        [Key]
        public int message_id { get; set; }

        public int sender_id { get; set; }
        public int recipient_id { get; set; }
        public int? event_id { get; set; }

        [Required]
        public string content { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string message_type { get; set; } = "Email"; // Changed to string
    }
}