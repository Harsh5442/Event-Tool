using EventTracker.Auth.Domain.Enums;

namespace EventTracker.Auth.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AzureAdId { get; set; }
        public string? ProfilePictureUrl { get; set; }
        
        public UserRole Role { get; set; } = UserRole.Participant;
        
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? LastLoginAt { get; set; }
        
        // Navigation property
        public virtual ICollection<UserProfile> Profiles { get; set; } = new List<UserProfile>();
    }
}