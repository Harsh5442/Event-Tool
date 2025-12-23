using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EventManagementSystem.Models
{
    [Table("Documents", Schema = "EventManagement")]
    public class Document
    {
        [Key]
        public int document_id { get; set; }

        [Required]
        [StringLength(300)]
        public string name { get; set; } = string.Empty;

        [Required]
        [StringLength(2083)]
        public string path { get; set; } = string.Empty;

        [StringLength(50)]
        public string? type { get; set; } = "Document"; // Changed to string

        public long? size { get; set; }

        public int uploaded_by { get; set; }
        public int? event_id { get; set; }
    }
}