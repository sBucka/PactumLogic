using PactumLogic.Server.Models;

namespace PactumLogic.Server.DTOs
{
    public class ClientWithAllContractsDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PersonalIdNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public ClientType Type { get; set; }
        public List<ContractSummaryDto> ClientContracts { get; set; } = new();
        public List<ContractSummaryDto> AdministratorContracts { get; set; } = new();
        public List<ContractSummaryDto> AdvisorContracts { get; set; } = new();
    }
}