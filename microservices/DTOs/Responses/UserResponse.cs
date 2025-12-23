namespace EventManagementSystem.DTOs.Responses
{
    public class UserResponse
    {
        public int user_id { get; set; }
        public string email { get; set; } = string.Empty;
        public string name { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
        public string? azure_ad_id { get; set; }
        public DateTime created_at { get; set; }
    }
}