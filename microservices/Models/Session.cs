using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Sessions", Schema = "EventManagement")]
    public class Session
    {
        [Key]
        public int session_id { get; set; }

        public int event_id { get; set; }

        [Required]
        [StringLength(300)]
        public string title { get; set; } = string.Empty;

        public string? description { get; set; }

        public DateTime start_time { get; set; }
        public DateTime? end_time { get; set; }

        public int? speaker_id { get; set; }
        public int created_by { get; set; }
    }
}