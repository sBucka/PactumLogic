namespace PactumLogic.Server.Models
{
    public class Client
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PersonalIdNumber { get; set; } = string.Empty;
        public int Age { get; set; }
        public ClientType Type { get; set; } = ClientType.Client;

        // Navigation properties for client contracts
        public ICollection<Contract> ClientContracts { get; set; } = new List<Contract>();

        // Navigation properties for when acting as administrator
        public ICollection<Contract> AdministratorContracts { get; set; } = new List<Contract>();

        // Navigation properties for when acting as advisor
        public ICollection<ContractAdvisor> ContractAdvisors { get; set; } = new List<ContractAdvisor>();
    }
}