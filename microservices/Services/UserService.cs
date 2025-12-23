using EventManagementSystem.Data;
using EventManagementSystem.Models;
using EventManagementSystem.DTOs.Requests;
using EventManagementSystem.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventManagementSystem.Services
{
    public class UserService : IUserService
    {
        private readonly EventManagementDbContext _context;

        public UserService(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> CreateUserAsync(CreateUserRequest request)
        {
            Console.WriteLine($"🔍 Creating user: {request.Email}");

            if (await _context.Users.AnyAsync(u => u.email == request.Email))
            {
                Console.WriteLine("❌ User already exists");
                throw new InvalidOperationException("A user with this email already exists.");
            }

            // Generate unique Azure ID to avoid constraint violation
            var azureId = string.IsNullOrEmpty(request.AzureAdId)
                ? $"auto-{DateTime.Now.Ticks}"
                : request.AzureAdId;

            var user = new User
            {
                email = request.Email,
                name = request.Name,
                role = request.Role,
                azure_ad_id = azureId, // Always use a unique value
                created_at = DateTime.UtcNow
            };

            Console.WriteLine($"🔍 Adding user to context: {user.email} with Azure ID: {azureId}");
            _context.Users.Add(user);

            Console.WriteLine("🔍 About to save changes...");
            var result = await _context.SaveChangesAsync();
            Console.WriteLine($"✅ SaveChanges returned: {result} rows affected");

            return user;
        }

        public async Task<User?> UpdateUserAsync(int id, CreateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            if (request.Email != user.email &&
                await _context.Users.AnyAsync(u => u.email == request.Email && u.user_id != id))
            {
                throw new InvalidOperationException("A user with this email already exists.");
            }

            user.email = request.Email;
            user.name = request.Name;
            user.role = request.Role;

            // Update Azure ID only if provided, otherwise keep existing
            if (!string.IsNullOrEmpty(request.AzureAdId))
            {
                user.azure_ad_id = request.AzureAdId;
            }

            var result = await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Update SaveChanges returned: {result} rows affected");

            return user;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            var result = await _context.SaveChangesAsync();
            Console.WriteLine($"✅ Delete SaveChanges returned: {result} rows affected");
            return true;
        }
    }
}