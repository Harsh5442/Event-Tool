using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventManagementSystem.Data;
using EventManagementSystem.Models;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DebugController : ControllerBase
    {
        private readonly EventManagementDbContext _context;

        public DebugController(EventManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet("connection-info")]
        public async Task<IActionResult> GetConnectionInfo()
        {
            try
            {
                var connectionString = _context.Database.GetConnectionString();
                var canConnect = await _context.Database.CanConnectAsync();

                // Get actual database name using a simple approach
                string dbName = "";
                try
                {
                    using var command = _context.Database.GetDbConnection().CreateCommand();
                    command.CommandText = "SELECT DB_NAME()";
                    await _context.Database.OpenConnectionAsync();
                    dbName = (await command.ExecuteScalarAsync())?.ToString() ?? "Unknown";
                }
                catch (Exception ex)
                {
                    dbName = $"Error: {ex.Message}";
                }
                finally
                {
                    await _context.Database.CloseConnectionAsync();
                }

                // Get user count safely
                int userCount = 0;
                try
                {
                    userCount = await _context.Users.CountAsync();
                }
                catch (Exception ex)
                {
                    return BadRequest(new
                    {
                        error = "Failed to count users",
                        details = ex.Message,
                        connectionString = connectionString?.Substring(0, Math.Min(connectionString.Length, 50)) + "...",
                        canConnect = canConnect,
                        databaseName = dbName
                    });
                }

                return Ok(new
                {
                    connectionString = connectionString?.Substring(0, Math.Min(connectionString.Length, 50)) + "...",
                    canConnect = canConnect,
                    databaseName = dbName,
                    userCount = userCount,
                    status = "Success"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = "Connection test failed",
                    message = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("users-simple")]
        public async Task<IActionResult> GetUsersSimple()
        {
            try
            {
                var users = await _context.Users
                    .Select(u => new
                    {
                        u.user_id,
                        u.email,
                        u.name,
                        u.role,
                        u.created_at
                    })
                    .Take(10)
                    .ToListAsync();

                return Ok(new
                {
                    count = users.Count,
                    users = users
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = "Failed to get users",
                    message = ex.Message
                });
            }
        }

        [HttpPost("test-ef-insert")]
        public async Task<IActionResult> TestEfInsert()
        {
            try
            {
                var testEmail = $"test-ef-{DateTime.Now.Ticks}@example.com";
                var testAzureId = $"azure-{DateTime.Now.Ticks}"; // Generate unique Azure ID

                var user = new User
                {
                    email = testEmail,
                    name = "Test EF User",
                    role = "Admin",
                    azure_ad_id = testAzureId, // Use unique value instead of null
                    created_at = DateTime.UtcNow
                };

                Console.WriteLine($"🔍 Adding user: {testEmail} with Azure ID: {testAzureId}");
                _context.Users.Add(user);

                Console.WriteLine("🔍 Calling SaveChangesAsync...");
                var result = await _context.SaveChangesAsync();
                Console.WriteLine($"✅ SaveChanges result: {result}");

                return Ok(new
                {
                    message = "EF insert test completed",
                    rowsAffected = result,
                    testEmail = testEmail,
                    testAzureId = testAzureId,
                    userId = user.user_id,
                    success = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ EF Insert failed: {ex.Message}");
                return BadRequest(new
                {
                    error = "EF insert failed",
                    message = ex.Message,
                    innerException = ex.InnerException?.Message
                });
            }
        }
        [HttpGet("table-info")]
        public async Task<IActionResult> GetTableInfo()
        {
            try
            {
                // Check if tables exist
                var tableExists = false;
                object sampleUsers = new List<object>(); // Fixed: Initialize as empty list

                try
                {
                    var users = await _context.Users
                        .Take(3)
                        .Select(u => new
                        {
                            u.user_id,
                            u.email,
                            u.name,
                            u.role
                        })
                        .ToListAsync();

                    tableExists = true;
                    sampleUsers = users; // Fixed: Assign directly
                }
                catch (Exception ex)
                {
                    tableExists = false;
                    sampleUsers = new { error = ex.Message };
                }

                return Ok(new
                {
                    usersTableExists = tableExists,
                    sampleUsers = sampleUsers,
                    sampleCount = tableExists ? ((dynamic)sampleUsers).Count : 0
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = "Table info check failed",
                    message = ex.Message
                });
            }
        }

        [HttpGet("recent-users")]
        public async Task<IActionResult> GetRecentUsers()
        {
            try
            {
                var recentUsers = await _context.Users
                    .OrderByDescending(u => u.created_at)
                    .Take(5)
                    .Select(u => new
                    {
                        u.user_id,
                        u.email,
                        u.name,
                        u.role,
                        u.created_at
                    })
                    .ToListAsync();

                return Ok(new
                {
                    message = "Recent users retrieved",
                    count = recentUsers.Count,
                    users = recentUsers
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = "Failed to get recent users",
                    message = ex.Message
                });
            }
        }

        [HttpGet("raw-user-count")]
        public async Task<IActionResult> GetRawUserCount()
        {
            try
            {
                // Direct database query to count users
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "SELECT COUNT(*) FROM EventManagement.Users";

                await _context.Database.OpenConnectionAsync();
                var count = await command.ExecuteScalarAsync();
                await _context.Database.CloseConnectionAsync();

                return Ok(new
                {
                    directCount = count,
                    message = "Direct SQL count successful"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    error = "Direct count failed",
                    message = ex.Message
                });
            }
        }
    }
}