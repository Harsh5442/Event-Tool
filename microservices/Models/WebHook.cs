using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("WebHooks", Schema = "EventManagement")]
    public class WebHook
    {
        [Key]
        public int webhook_id { get; set; }

        public int? event_id { get; set; }

        [Required]
        [StringLength(2083)]
        public string target_url { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string event_type { get; set; } = "EventCreated"; 
    }
}