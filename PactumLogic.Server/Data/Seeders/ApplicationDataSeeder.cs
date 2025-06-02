namespace PactumLogic.Server.Data.Seeders
{
    public static class ApplicationDataSeeder
    {
        public static async Task SeedAsync(PactumLogicDbContext context, ILogger logger)
        {
            logger.LogInformation("Starting application data seeding...");

            // Seed clients first (includes advisors now since they use the same table)
            await ClientSeeder.SeedAsync(context, logger);

            // Seed contracts last (depends on clients/advisors)
            await ContractSeeder.SeedAsync(context, logger);

            logger.LogInformation("Application data seeding completed.");
        }
    }
}