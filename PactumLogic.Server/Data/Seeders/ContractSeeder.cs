using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data.Seeders
{
    public static class ContractSeeder
    {
        public static async Task SeedAsync(PactumLogicDbContext context, ILogger logger)
        {
            if (!await context.Contracts.AnyAsync())
            {
                logger.LogInformation("Seeding contracts...");

                var firstAdvisor = await context.Advisors.FirstAsync();
                var secondAdvisor = await context.Advisors.Skip(1).FirstAsync();
                var firstClient = await context.Clients.FirstAsync();
                var secondClient = await context.Clients.Skip(1).FirstAsync();
                var thirdClient = await context.Clients.Skip(2).FirstAsync();

                var contracts = new[]
                {
                    new Contract
                    {
                        ReferenceNumber = "CSOB-2024-001",
                        Institution = "ČSOB",
                        ClientId = firstClient.Id,
                        AdministratorId = firstAdvisor.Id,
                        ContractDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-6)),
                        ValidityDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-5)),
                        TerminationDate = null
                    },
                    new Contract
                    {
                        ReferenceNumber = "AEGON-2024-001",
                        Institution = "AEGON",
                        ClientId = secondClient.Id,
                        AdministratorId = secondAdvisor.Id,
                        ContractDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-4)),
                        ValidityDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-3)),
                        TerminationDate = null
                    },
                    new Contract
                    {
                        ReferenceNumber = "AXA-2024-001",
                        Institution = "AXA",
                        ClientId = thirdClient.Id,
                        AdministratorId = firstAdvisor.Id,
                        ContractDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-2)),
                        ValidityDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(-1)),
                        TerminationDate = DateOnly.FromDateTime(DateTime.Now.AddMonths(12))
                    }
                };

                context.Contracts.AddRange(contracts);
                await context.SaveChangesAsync();

                // Add contract advisors (many-to-many relationships)
                var contractAdvisors = new[]
                {
                    new ContractAdvisor { ContractId = contracts[0].Id, AdvisorId = firstAdvisor.Id },
                    new ContractAdvisor { ContractId = contracts[0].Id, AdvisorId = secondAdvisor.Id },
                    new ContractAdvisor { ContractId = contracts[1].Id, AdvisorId = secondAdvisor.Id },
                    new ContractAdvisor { ContractId = contracts[2].Id, AdvisorId = firstAdvisor.Id }
                };

                context.ContractAdvisors.AddRange(contractAdvisors);
                await context.SaveChangesAsync();

                logger.LogInformation($"Seeded {contracts.Length} contracts with advisor relationships.");
            }
            else
            {
                logger.LogInformation("Contracts already exist, skipping seeding.");
            }
        }
    }
}