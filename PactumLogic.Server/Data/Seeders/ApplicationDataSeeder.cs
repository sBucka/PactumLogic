namespace PactumLogic.Server.Data.Seeders
{
    public static class ApplicationDataSeeder
    {
        public static async Task SeedAsync(PactumLogicDbContext context, ILogger logger)
        {
            logger.LogInformation("Starting application data seeding...");

            // Seed advisors first (required for contracts)
            await AdvisorSeeder.SeedAsync(context, logger);

            // Seed clients (required for contracts)
            await ClientSeeder.SeedAsync(context, logger);

            // Seed contracts last (depends on advisors and clients)
            await ContractSeeder.SeedAsync(context, logger);

            logger.LogInformation("Application data seeding completed.");
        }
    }
}