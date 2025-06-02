
namespace PactumLogic.Server.Models
{
    public class Client 
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string PersonalIdNumber { get; set; } = string.Empty; // Rodné číslo
        public int Age { get; set; }

        // Navigation properties
        public ICollection<Contract> Contracts { get; set; } = new List<Contract>();
    }
}