using Xunit;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace EventTracker.Auth.Tests.Services
{
    public class AzureAdConfigTest
    {
        [Fact]
        public void InMemoryConfig_Should_Store_Values()
        {
            // Arrange
            var settings = new Dictionary<string, string>
            {
                { "AzureAd:TenantId", "5d1e490a-8455-4ecb-b5a4-67f86e2f1d7d" },
                { "AzureAd:ClientId", "aae2d84a-dd2e-4710-8b00-7bf7cce23bdf" },
                { "AzureAd:ClientSecret", "3e58Q~EXqA594-Vlq0vI-hWKW8~CG0N81p.YBaG6" }
            };

            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(settings)
                .Build();

            // Act
            var section = config.GetSection("AzureAd");

            // Assert - Just verify the section exists and has children
            Assert.NotNull(section);
            Assert.True(section.Exists());
            Assert.NotEmpty(section.GetChildren());
        }

        [Fact]
        public void ConfigurationBuilder_Should_Load_InMemory_Values()
        {
            // Arrange & Act
            var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "TestKey", "TestValue" }
                })
                .Build();

            var value = config["TestKey"];

            // Assert
            Assert.NotNull(value);
            Assert.Equal("TestValue", value);
        }
    }
}