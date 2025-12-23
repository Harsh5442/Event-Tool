using Microsoft.EntityFrameworkCore;
using EventManagementSystem.Models;

namespace EventManagementSystem.Data
{
    public class EventManagementDbContext : DbContext
    {
        public EventManagementDbContext(DbContextOptions<EventManagementDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Attendee> Attendees { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Speaker> Speakers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<WebHook> WebHooks { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // This shouldn't happen but helps with debugging
                optionsBuilder.UseSqlServer("Data Source=WL-GZ5M7C3;Initial Catalog=EventManagementDB;Integrated Security=True;Pooling=False;Connect Timeout=30;Encrypt=False;Application Name=vscode-mssql;Application Intent=ReadWrite;Command Timeout=30");
            }

            // Enable detailed logging
            optionsBuilder.LogTo(Console.WriteLine, LogLevel.Information);
            optionsBuilder.EnableSensitiveDataLogging();
            optionsBuilder.EnableDetailedErrors();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly configure table schemas
            modelBuilder.Entity<User>().ToTable("Users", "EventManagement");
            modelBuilder.Entity<Event>().ToTable("Events", "EventManagement");
            modelBuilder.Entity<Attendee>().ToTable("Attendees", "EventManagement");
            modelBuilder.Entity<Session>().ToTable("Sessions", "EventManagement");
            modelBuilder.Entity<Speaker>().ToTable("Speakers", "EventManagement");
            modelBuilder.Entity<Message>().ToTable("Messages", "EventManagement");
            modelBuilder.Entity<Notification>().ToTable("Notifications", "EventManagement");
            modelBuilder.Entity<Document>().ToTable("Documents", "EventManagement");
            modelBuilder.Entity<WebHook>().ToTable("Webhooks", "EventManagement");

            // Configure primary keys explicitly
            modelBuilder.Entity<User>().HasKey(u => u.user_id);
            modelBuilder.Entity<Event>().HasKey(e => e.event_id);
            modelBuilder.Entity<Attendee>().HasKey(a => a.attendee_id);
            modelBuilder.Entity<Session>().HasKey(s => s.session_id);
            modelBuilder.Entity<Speaker>().HasKey(sp => sp.speaker_id);
            modelBuilder.Entity<Message>().HasKey(m => m.message_id);
            modelBuilder.Entity<Notification>().HasKey(n => n.notification_id);
            modelBuilder.Entity<Document>().HasKey(d => d.document_id);
            modelBuilder.Entity<WebHook>().HasKey(w => w.webhook_id);

            // Configure foreign key relationships (if needed)
            // Remove these if they cause issues
            /*
            modelBuilder.Entity<Attendee>()
                .HasOne<Event>()
                .WithMany()
                .HasForeignKey(a => a.event_id);

            modelBuilder.Entity<Attendee>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(a => a.user_id);
            */
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            Console.WriteLine(" SaveChangesAsync called");

            try
            {
                var result = await base.SaveChangesAsync(cancellationToken);
                Console.WriteLine($" SaveChangesAsync completed: {result} rows affected");
                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($" SaveChangesAsync failed: {ex.Message}");
                throw;
            }
        }
    }
}