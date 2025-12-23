using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Users", Schema = "EventManagement")]
    public class User
    {
        [Key]
        public int user_id { get; set; }

        [Required]
        [StringLength(320)]
        public string email { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string role { get; set; } = string.Empty; // Changed back to string

        [StringLength(100)]
        public string? azure_ad_id { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;
    }
}