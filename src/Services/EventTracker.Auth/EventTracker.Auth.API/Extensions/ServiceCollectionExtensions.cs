using EventTracker.Auth.Application.Mappings;
using EventTracker.Auth.Application.Services;
using EventTracker.Auth.Application.Validators;
using EventTracker.Auth.Infrastructure.Persistence;
using EventTracker.Auth.Infrastructure.Repositories;
using EventTracker.Auth.Domain.Interfaces;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace EventTracker.Auth.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Database
            services.AddDbContext<AuthDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();

            // Services
            // services.AddScoped<IAuthService, AuthService>();
            // Services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAzureAdService, AzureAdService>();

            // AutoMapper
            services.AddAutoMapper(typeof(MappingProfile));

            // Validation
            services.AddValidatorsFromAssemblyContaining<LoginRequestValidator>();

            // CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });

            return services;
        }
    }
}