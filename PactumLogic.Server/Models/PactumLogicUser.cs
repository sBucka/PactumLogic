using Microsoft.AspNetCore.Identity;

namespace PactumLogic.Server.Models
{
    public class PactumLogicUser : IdentityUser
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}