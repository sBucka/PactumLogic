namespace PactumLogic.Server.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty; // Číslo zmluvy (napr. 1234567890) ig idk 
        public string Institution { get; set; } = string.Empty; // ČSOB, AEGON, Axa, etc.
        public int ClientId { get; set; }
        public int AdministratorId { get; set; } // Správa zmluvy (Advisor)
        public DateOnly ContractDate { get; set; } // Dátum uzavretia
        public DateOnly ValidityDate { get; set; } // Dátum platnosti
        public DateOnly? TerminationDate { get; set; } // Dátum ukončenia (null if not terminated)

        // Navigation properties
        public Client Client { get; set; } = null!;
        public Advisor Administrator { get; set; } = null!;
        public ICollection<ContractAdvisor> ContractAdvisors { get; set; } = new List<ContractAdvisor>();
    }
}