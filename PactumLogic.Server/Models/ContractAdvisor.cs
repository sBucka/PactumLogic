
namespace PactumLogic.Server.Models
{
    public class ContractAdvisor
    {
        public int ContractId { get; set; }
        public int AdvisorId { get; set; }

        // Navigation properties
        public Contract Contract { get; set; } = null!;
        public Advisor Advisor { get; set; } = null!;
    }
}