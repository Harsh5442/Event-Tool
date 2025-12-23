using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EventManagementSystem.Data;

namespace EventManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatabaseInfoController : ControllerBase
    {
        private readonly EventManagementDbContext _context;

        public DatabaseInfoController(EventManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet("constraints")]
        public async Task<IActionResult> GetConstraints()
        {
            try
            {
                var query = @"
                    use EventManagementDB;
                    
                    SELECT 
                        OBJECT_NAME(parent_object_id) AS TableName,
                        COL_NAME(parent_object_id, parent_column_id) AS ColumnName,
                        name AS ConstraintName,
                        definition
                    FROM sys.check_constraints 
                    WHERE OBJECT_NAME(parent_object_id) IN ('Users', 'Events', 'Attendees', 'Messages', 'Notifications', 'Documents', 'WebHooks')
                    ORDER BY TableName, ColumnName";

                var constraints = await _context.Database
                    .SqlQueryRaw<dynamic>(query)
                    .ToListAsync();

                return Ok(constraints);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("sample-data")]
        public async Task<IActionResult> GetSampleData()
        {
            try
            {
                var userRoles = await _context.Users
                    .Select(u => u.role)
                    .Distinct()
                    .ToListAsync();

                var eventStatuses = await _context.Events
                    .Select(e => e.status)
                    .Distinct()
                    .ToListAsync();

                return Ok(new
                {
                    validUserRoles = userRoles,
                    validEventStatuses = eventStatuses
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}