using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data.Seeders
{
    public static class ClientSeeder
    {
        public static async Task SeedAsync(PactumLogicDbContext context, ILogger logger)
        {
            if (!await context.Clients.AnyAsync())
            {
                logger.LogInformation("Seeding clients...");

                var clients = new[]
                {
                    new Client
                    {
                        FirstName = "Pavel",
                        LastName = "Procházka",
                        Email = "pavel.prochazka@email.com",
                        Phone = "+420111222333",
                        PersonalIdNumber = "9001010001",
                        Age = 34
                    },
                    new Client
                    {
                        FirstName = "Anna",
                        LastName = "Kratochvílová",
                        Email = "anna.kratochvilova@email.com",
                        Phone = "+420444555666",
                        PersonalIdNumber = "8806061234",
                        Age = 36
                    },
                    new Client
                    {
                        FirstName = "Tomáš",
                        LastName = "Černý",
                        Email = "tomas.cerny@email.com",
                        Phone = "+420777888999",
                        PersonalIdNumber = "9205055678",
                        Age = 32
                    },
                    new Client
                    {
                        FirstName = "Klára",
                        LastName = "Veselá",
                        Email = "klara.vesela@email.com",
                        Phone = "+420123789456",
                        PersonalIdNumber = "9112121010",
                        Age = 33
                    }
                };

                context.Clients.AddRange(clients);
                await context.SaveChangesAsync();
                logger.LogInformation($"Seeded {clients.Length} clients.");
            }
            else
            {
                logger.LogInformation("Clients already exist, skipping seeding.");
            }
        }
    }
}