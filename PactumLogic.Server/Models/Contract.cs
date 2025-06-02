namespace PactumLogic.Server.Models
{
    public class Contract
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public int AdministratorId { get; set; }  // References Client table
        public DateOnly ContractDate { get; set; }
        public DateOnly ValidityDate { get; set; }
        public DateOnly? TerminationDate { get; set; }

        // Navigation properties - both reference Client table
        public Client Client { get; set; } = null!;
        public Client Administrator { get; set; } = null!;
        public ICollection<ContractAdvisor> ContractAdvisors { get; set; } = new List<ContractAdvisor>();
    }
}