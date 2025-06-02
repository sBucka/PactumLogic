using PactumLogic.Server.Models;

namespace PactumLogic.Server.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(PactumLogicUser user, IList<string> roles);
    }
}