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

                // Get clients (must be Client or Both type)
                var clients = await context.Clients
                    .Where(c => c.Type == ClientType.Client || c.Type == ClientType.Both)
                    .OrderBy(c => c.Id)
                    .ToListAsync();

                // Get advisors (must be Advisor or Both type)
                var advisors = await context.Clients
                    .Where(c => c.Type == ClientType.Advisor || c.Type == ClientType.Both)
                    .OrderBy(c => c.Id)
                    .ToListAsync();

                if (clients.Count < 3)
                {
                    logger.LogWarning($"Not enough clients found for seeding contracts. Found: {clients.Count}, Required: 3");
                    return;
                }

                if (advisors.Count < 2)
                {
                    logger.LogWarning($"Not enough advisors found for seeding contracts. Found: {advisors.Count}, Required: 2");
                    return;
                }

                // Create realistic date ranges
                var baseDate = DateTime.Now;
                
                var contracts = new List<Contract>
                {
                    new Contract
                    {
                        ReferenceNumber = "CSOB-2024-001",
                        Institution = "ČSOB",
                        ClientId = clients[0].Id,
                        AdministratorId = advisors[0].Id,
                        ContractDate = DateOnly.FromDateTime(baseDate.AddMonths(-6)),
                        ValidityDate = DateOnly.FromDateTime(baseDate.AddMonths(-5)),
                        TerminationDate = null // Active contract
                    },
                    new Contract
                    {
                        ReferenceNumber = "AEGON-2024-002",
                        Institution = "AEGON",
                        ClientId = clients[1].Id,
                        AdministratorId = advisors.Count > 1 ? advisors[1].Id : advisors[0].Id,
                        ContractDate = DateOnly.FromDateTime(baseDate.AddMonths(-8)),
                        ValidityDate = DateOnly.FromDateTime(baseDate.AddMonths(-7)),
                        TerminationDate = null // Active contract
                    },
                    new Contract
                    {
                        ReferenceNumber = "AXA-2024-003",
                        Institution = "AXA",
                        ClientId = clients[2].Id,
                        AdministratorId = advisors[0].Id,
                        ContractDate = DateOnly.FromDateTime(baseDate.AddMonths(-4)),
                        ValidityDate = DateOnly.FromDateTime(baseDate.AddMonths(-3)),
                        TerminationDate = DateOnly.FromDateTime(baseDate.AddMonths(-1)) // Terminated contract
                    },
                    new Contract
                    {
                        ReferenceNumber = "ALLIANZ-2024-004",
                        Institution = "Allianz",
                        ClientId = clients[0].Id, // Same client can have multiple contracts
                        AdministratorId = advisors.Count > 1 ? advisors[1].Id : advisors[0].Id,
                        ContractDate = DateOnly.FromDateTime(baseDate.AddMonths(-2)),
                        ValidityDate = DateOnly.FromDateTime(baseDate.AddMonths(-1)),
                        TerminationDate = null // Active contract
                    },
                    new Contract
                    {
                        ReferenceNumber = "GENERALI-2024-005",
                        Institution = "Generali",
                        ClientId = clients.Count > 3 ? clients[3].Id : clients[1].Id,
                        AdministratorId = advisors[0].Id,
                        ContractDate = DateOnly.FromDateTime(baseDate.AddMonths(-10)),
                        ValidityDate = DateOnly.FromDateTime(baseDate.AddMonths(-9)),
                        TerminationDate = null // Active contract
                    }
                };

                try
                {
                    context.Contracts.AddRange(contracts);
                    await context.SaveChangesAsync();

                    logger.LogInformation($"Successfully added {contracts.Count} contracts to database.");

                    // Create contract-advisor relationships (many-to-many)
                    var contractAdvisors = new List<ContractAdvisor>();

                    // Contract 1: Multiple advisors
                    contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[0].Id, AdvisorId = advisors[0].Id });
                    if (advisors.Count > 1)
                    {
                        contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[0].Id, AdvisorId = advisors[1].Id });
                    }

                    // Contract 2: Single advisor (administrator)
                    var contract2AdvisorId = advisors.Count > 1 ? advisors[1].Id : advisors[0].Id;
                    contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[1].Id, AdvisorId = contract2AdvisorId });

                    // Contract 3: Single advisor (administrator)
                    contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[2].Id, AdvisorId = advisors[0].Id });

                    // Contract 4: Multiple advisors if available
                    var contract4AdvisorId = advisors.Count > 1 ? advisors[1].Id : advisors[0].Id;
                    contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[3].Id, AdvisorId = contract4AdvisorId });
                    if (advisors.Count > 2)
                    {
                        contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[3].Id, AdvisorId = advisors[2].Id });
                    }

                    // Contract 5: Administrator as advisor
                    contractAdvisors.Add(new ContractAdvisor { ContractId = contracts[4].Id, AdvisorId = advisors[0].Id });

                    // Remove duplicates (in case administrator is already included as advisor)
                    var uniqueContractAdvisors = contractAdvisors
                        .GroupBy(ca => new { ca.ContractId, ca.AdvisorId })
                        .Select(g => g.First())
                        .ToList();

                    context.ContractAdvisors.AddRange(uniqueContractAdvisors);
                    await context.SaveChangesAsync();

                    logger.LogInformation($"Successfully created {uniqueContractAdvisors.Count} contract-advisor relationships.");
                    logger.LogInformation($"Contract seeding completed. Seeded {contracts.Count} contracts with advisor relationships.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error occurred while seeding contracts.");
                    throw;
                }
            }
            else
            {
                logger.LogInformation("Contracts already exist, skipping seeding.");
            }
        }
    }
}