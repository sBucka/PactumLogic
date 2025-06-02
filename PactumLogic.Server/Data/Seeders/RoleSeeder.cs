using Microsoft.AspNetCore.Identity;

namespace PactumLogic.Server.Data.Seeders
{
    public static class RoleSeeder
    {
        public static async Task SeedAsync(RoleManager<IdentityRole> roleManager, ILogger logger)
        {
            logger.LogInformation("Starting role seeding...");

            string[] roles = { "Admin", "User", "Manager" };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    var role = new IdentityRole(roleName);
                    var result = await roleManager.CreateAsync(role);

                    if (result.Succeeded)
                    {
                        logger.LogInformation($"Role '{roleName}' created successfully.");
                    }
                    else
                    {
                        logger.LogWarning($"Failed to create role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
                else
                {
                    logger.LogInformation($"Role '{roleName}' already exists.");
                }
            }

            logger.LogInformation("Role seeding completed.");
        }
    }
}