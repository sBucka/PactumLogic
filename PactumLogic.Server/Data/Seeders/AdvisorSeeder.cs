using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data.Seeders
{
    public static class AdvisorSeeder
    {
        public static async Task SeedAsync(PactumLogicDbContext context, ILogger logger)
        {
            if (!await context.Advisors.AnyAsync())
            {
                logger.LogInformation("Seeding advisors...");

                var advisors = new[]
                {
                    new Advisor
                    {
                        FirstName = "Jan",
                        LastName = "Novák",
                        Email = "jan.novak@pactum.com",
                        Phone = "+420123456789",
                        PersonalIdNumber = "8001010123",
                        Age = 44
                    },
                    new Advisor
                    {
                        FirstName = "Marie",
                        LastName = "Svobodová",
                        Email = "marie.svobodova@pactum.com",
                        Phone = "+420987654321",
                        PersonalIdNumber = "8505051234",
                        Age = 39
                    },
                    new Advisor
                    {
                        FirstName = "Petr",
                        LastName = "Dvořák",
                        Email = "petr.dvorak@pactum.com",
                        Phone = "+420555123456",
                        PersonalIdNumber = "7803031111",
                        Age = 46
                    }
                };

                context.Advisors.AddRange(advisors);
                await context.SaveChangesAsync();
                logger.LogInformation($"Seeded {advisors.Length} advisors.");
            }
            else
            {
                logger.LogInformation("Advisors already exist, skipping seeding.");
            }
        }
    }
}