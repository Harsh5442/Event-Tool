using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Speakers", Schema = "EventManagement")]
    public class Speaker
    {
        [Key]
        public int speaker_id { get; set; }

        public int user_id { get; set; }

        public string? bio { get; set; }

        [StringLength(200)]
        public string? company { get; set; }

        public string? topics { get; set; }
    }
}