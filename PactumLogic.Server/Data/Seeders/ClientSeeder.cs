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
                logger.LogInformation("Seeding clients and advisors...");

                var people = new[]
                {
                    // Pure clients
                    new Client
                    {
                        FirstName = "Pavel",
                        LastName = "Procházka",
                        Email = "pavel.prochazka@email.com",
                        Phone = "+420111222333",
                        PersonalIdNumber = "9001010001",
                        Age = 34,
                        Type = ClientType.Client
                    },
                    new Client
                    {
                        FirstName = "Anna",
                        LastName = "Kratochvílová",
                        Email = "anna.kratochvilova@email.com",
                        Phone = "+420444555666",
                        PersonalIdNumber = "8806061234",
                        Age = 36,
                        Type = ClientType.Client
                    },
                    // Pure advisors
                    new Client
                    {
                        FirstName = "Jan",
                        LastName = "Novák",
                        Email = "jan.novak@pactum.com",
                        Phone = "+420123456789",
                        PersonalIdNumber = "8001010123",
                        Age = 44,
                        Type = ClientType.Advisor
                    },
                    new Client
                    {
                        FirstName = "Marie",
                        LastName = "Svobodová",
                        Email = "marie.svobodova@pactum.com",
                        Phone = "+420987654321",
                        PersonalIdNumber = "8505051234",
                        Age = 39,
                        Type = ClientType.Advisor
                    },
                    // Someone who is both client and advisor
                    new Client
                    {
                        FirstName = "Tomáš",
                        LastName = "Černý",
                        Email = "tomas.cerny@email.com",
                        Phone = "+420777888999",
                        PersonalIdNumber = "9205055678",
                        Age = 32,
                        Type = ClientType.Both
                    }
                };

                context.Clients.AddRange(people);
                await context.SaveChangesAsync();
                logger.LogInformation($"Seeded {people.Length} people (clients and advisors).");
            }
            else
            {
                logger.LogInformation("People already exist, skipping seeding.");
            }
        }
    }
}