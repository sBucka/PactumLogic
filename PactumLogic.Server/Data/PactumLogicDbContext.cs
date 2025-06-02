using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Data
{
    public class PactumLogicDbContext : IdentityDbContext<Models.PactumLogicUser>
    {
        public PactumLogicDbContext(DbContextOptions<PactumLogicDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; } = null!;
        public DbSet<Advisor> Advisors { get; set; } = null!;
        public DbSet<Contract> Contracts { get; set; } = null!;
        public DbSet<ContractAdvisor> ContractAdvisors { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // Important: Call base first for Identity

            // Configure many-to-many relationship
            modelBuilder.Entity<ContractAdvisor>()
                .HasKey(ca => new { ca.ContractId, ca.AdvisorId });

            modelBuilder.Entity<ContractAdvisor>()
                .HasOne(ca => ca.Contract)
                .WithMany(c => c.ContractAdvisors)
                .HasForeignKey(ca => ca.ContractId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ContractAdvisor>()
                .HasOne(ca => ca.Advisor)
                .WithMany(a => a.ContractAdvisors)
                .HasForeignKey(ca => ca.AdvisorId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Contract relationships
            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Administrator)
                .WithMany()
                .HasForeignKey(c => c.AdministratorId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Contract>()
                .HasOne(c => c.Client)
                .WithMany(cl => cl.Contracts)
                .HasForeignKey(c => c.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}