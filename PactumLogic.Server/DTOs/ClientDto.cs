using PactumLogic.Server.Models;

namespace PactumLogic.Server.DTOs
{
    public class ClientDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PersonalIdNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public ClientType Type { get; set; }
    }

    public class ClientWithContractsDto : ClientDto
    {
        public List<ContractSummaryDto> Contracts { get; set; } = new List<ContractSummaryDto>();
    }

    public class CreateClientRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PersonalIdNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public ClientType Type { get; set; } = ClientType.Client;
    }

    // For backward compatibility, we can create type aliases
    public class AdvisorDto : ClientDto
    {
        public AdvisorDto()
        {
            Type = ClientType.Advisor;
        }
    }
}