using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Data.Seeders;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider, ILogger logger)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<PactumLogicDbContext>();
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<PactumLogicUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                logger.LogInformation("Starting database seeding...");

                // Ensure database is created and migrated
                await context.Database.MigrateAsync();

                // Seed roles first
                await RoleSeeder.SeedAsync(roleManager, logger);

                // Seed users
                await UserSeeder.SeedAsync(userManager, logger);

                // Seed application data
                await ApplicationDataSeeder.SeedAsync(context, logger);

                logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while seeding the database.");
                throw;
            }
        }
    }
}