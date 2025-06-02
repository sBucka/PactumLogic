namespace PactumLogic.Server.DTOs
{
    public class ContractDto
    {
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string ClientEmail { get; set; } = string.Empty;
        public string AdministratorEmail { get; set; } = string.Empty;
        public List<string> AdvisorEmails { get; set; } = new();
        public string ContractDate { get; set; } = string.Empty;
        public string ValidityDate { get; set; } = string.Empty;
        public string? TerminationDate { get; set; }
    }

    public class ContractResponseDto
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public int ClientId { get; set; }
        public int AdministratorId { get; set; }
        public DateOnly ContractDate { get; set; }
        public DateOnly ValidityDate { get; set; }
        public DateOnly? TerminationDate { get; set; }
        public ClientDto Client { get; set; } = null!;
        public AdvisorDto Administrator { get; set; } = null!;
        public List<AdvisorDto> Advisors { get; set; } = new();
    }

    // Simple contract info for client contracts list
    public class ContractSummaryDto
    {
        public int Id { get; set; }
        public string ReferenceNumber { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public DateOnly ContractDate { get; set; }
        public DateOnly ValidityDate { get; set; }
        public DateOnly? TerminationDate { get; set; }
    }
}