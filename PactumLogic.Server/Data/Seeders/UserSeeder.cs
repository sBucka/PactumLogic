using Microsoft.AspNetCore.Identity;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data.Seeders
{
    public static class UserSeeder
    {
        public static async Task SeedAsync(UserManager<PactumLogicUser> userManager, ILogger logger)
        {
            logger.LogInformation("Starting user seeding...");

            await SeedAdminUser(userManager, logger);
            await SeedTestUser(userManager, logger);

            logger.LogInformation("User seeding completed.");
        }

        private static async Task SeedAdminUser(UserManager<PactumLogicUser> userManager, ILogger logger)
        {
            const string adminEmail = "admin@pactum.com";
            const string adminPassword = "Admin123!";

            var existingUser = await userManager.FindByEmailAsync(adminEmail);
            if (existingUser == null)
            {
                var adminUser = new PactumLogicUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "Admin",
                    LastName = "User",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    logger.LogInformation($"Admin user '{adminEmail}' created successfully with password '{adminPassword}'.");
                }
                else
                {
                    logger.LogError($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                logger.LogInformation($"Admin user '{adminEmail}' already exists.");
            }
        }

        private static async Task SeedTestUser(UserManager<PactumLogicUser> userManager, ILogger logger)
        {
            const string userEmail = "user@pactum.com";
            const string userPassword = "User123!";

            var existingUser = await userManager.FindByEmailAsync(userEmail);
            if (existingUser == null)
            {
                var testUser = new PactumLogicUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    FirstName = "Test",
                    LastName = "User",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await userManager.CreateAsync(testUser, userPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, "User");
                    logger.LogInformation($"Test user '{userEmail}' created successfully with password '{userPassword}'.");
                }
                else
                {
                    logger.LogError($"Failed to create test user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                logger.LogInformation($"Test user '{userEmail}' already exists.");
            }
        }
    }
}