namespace PactumLogic.Server.Models
{
    public class ContractAdvisor
    {
        public int ContractId { get; set; }
        public int AdvisorId { get; set; }  // References Client table

        // Navigation properties
        public Contract Contract { get; set; } = null!;
        public Client Advisor { get; set; } = null!;  // References Client table
    }
}