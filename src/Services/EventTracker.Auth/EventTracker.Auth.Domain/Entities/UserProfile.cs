namespace EventTracker.Auth.Domain.Entities
{
    public class UserProfile
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Bio { get; set; }
        public string Company { get; set; }
        public string JobTitle { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation property
        public virtual User User { get; set; }
    }
}