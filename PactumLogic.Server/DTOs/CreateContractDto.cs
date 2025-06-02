namespace PactumLogic.Server.DTOs
{
    public class CreateContractDto
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
}