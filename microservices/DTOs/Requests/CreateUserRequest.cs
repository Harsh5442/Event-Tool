using System.ComponentModel.DataAnnotations;

namespace EventManagementSystem.DTOs.Requests
{
    public class CreateUserRequest
    {
        [Required]
        [StringLength(320)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = string.Empty; 

        [StringLength(100)]
        public string? AzureAdId { get; set; }
    }
}