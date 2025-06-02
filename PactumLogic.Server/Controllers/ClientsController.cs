using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Data;
using PactumLogic.Server.DTOs;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClientsController : ControllerBase
    {
        private readonly PactumLogicDbContext _context;

        public ClientsController(PactumLogicDbContext context)
        {
            _context = context;
        }

        // GET: api/Clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientWithContractsDto>>> GetClients()
        {
            var clients = await _context.Clients
                .AsNoTracking()
                .Where(c => c.Type == ClientType.Client || c.Type == ClientType.Both)
                .Include(c => c.ClientContracts)
                .Select(c => new ClientWithContractsDto
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    PersonalIdNumber = c.PersonalIdNumber,
                    Age = c.Age,
                    Type = c.Type,
                    Contracts = c.ClientContracts.Select(contract => new ContractSummaryDto
                    {
                        Id = contract.Id,
                        ReferenceNumber = contract.ReferenceNumber,
                        Institution = contract.Institution,
                        ContractDate = contract.ContractDate,
                        ValidityDate = contract.ValidityDate,
                        TerminationDate = contract.TerminationDate
                    }).ToList()
                })
                .ToListAsync();

            return Ok(clients);
        }

        // GET: api/Clients/advisors
        [HttpGet("advisors")]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetAdvisors()
        {
            var advisors = await _context.Clients
                .AsNoTracking()
                .Where(c => c.Type == ClientType.Advisor || c.Type == ClientType.Both)
                .Select(c => new ClientDto
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    PersonalIdNumber = c.PersonalIdNumber,
                    Age = c.Age,
                    Type = c.Type
                })
                .ToListAsync();

            return Ok(advisors);
        }

        [HttpGet("advisors-with-contracts")]
        public async Task<ActionResult<IEnumerable<AdvisorWithContractsDto>>> GetAdvisorsWithContracts()
        {
            var advisors = await _context.Clients
                .AsNoTracking()
                .Where(c => c.Type == ClientType.Advisor || c.Type == ClientType.Both)
                .Select(c => new AdvisorWithContractsDto
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    PersonalIdNumber = c.PersonalIdNumber,
                    Age = c.Age,
                    Type = c.Type,
                    // Get contracts where this person is an advisor
                    Contracts = c.ContractAdvisors.Select(ca => new ContractSummaryDto
                    {
                        Id = ca.Contract.Id,
                        ReferenceNumber = ca.Contract.ReferenceNumber,
                        Institution = ca.Contract.Institution,
                        ContractDate = ca.Contract.ContractDate,
                        ValidityDate = ca.Contract.ValidityDate,
                        TerminationDate = ca.Contract.TerminationDate
                    }).ToList()
                })
                .ToListAsync();

            return Ok(advisors);
        }

        // GET: api/Clients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ClientWithAllContractsDto>> GetClient(int id)
        {
            var client = await _context.Clients
                .AsNoTracking()
                .Where(c => c.Id == id)
                .Select(c => new ClientWithAllContractsDto
                {
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    Phone = c.Phone,
                    PersonalIdNumber = c.PersonalIdNumber,
                    Age = c.Age,
                    Type = c.Type,
                    
                    // Contracts where they are the client
                    ClientContracts = c.ClientContracts.Select(contract => new ContractSummaryDto
                    {
                        Id = contract.Id,
                        ReferenceNumber = contract.ReferenceNumber,
                        Institution = contract.Institution,
                        ContractDate = contract.ContractDate,
                        ValidityDate = contract.ValidityDate,
                        TerminationDate = contract.TerminationDate
                    }).ToList(),
                    
                    // Contracts where they are the administrator
                    AdministratorContracts = c.AdministratorContracts.Select(contract => new ContractSummaryDto
                    {
                        Id = contract.Id,
                        ReferenceNumber = contract.ReferenceNumber,
                        Institution = contract.Institution,
                        ContractDate = contract.ContractDate,
                        ValidityDate = contract.ValidityDate,
                        TerminationDate = contract.TerminationDate
                    }).ToList(),
                    
                    // Contracts where they are an advisor
                    AdvisorContracts = c.ContractAdvisors.Select(ca => new ContractSummaryDto
                    {
                        Id = ca.Contract.Id,
                        ReferenceNumber = ca.Contract.ReferenceNumber,
                        Institution = ca.Contract.Institution,
                        ContractDate = ca.Contract.ContractDate,
                        ValidityDate = ca.Contract.ValidityDate,
                        TerminationDate = ca.Contract.TerminationDate
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (client == null)
            {
                return NotFound();
            }

            return Ok(client);
        }

        // POST: api/Clients
        [HttpPost]
        public async Task<ActionResult<ClientDto>> PostClient(CreateClientRequest request)
        {
            // Check if email already exists
            if (await _context.Clients.AnyAsync(c => c.Email == request.Email))
            {
                return Conflict("A person with this email already exists.");
            }

            var client = new Client
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Phone = request.Phone,
                PersonalIdNumber = request.PersonalIdNumber,
                Age = request.Age,
                Type = request.Type
            };

            _context.Clients.Add(client);
            await _context.SaveChangesAsync();

            var clientDto = new ClientDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                Email = client.Email,
                Phone = client.Phone,
                PersonalIdNumber = client.PersonalIdNumber,
                Age = client.Age,
                Type = client.Type
            };

            return CreatedAtAction(nameof(GetClient), new { id = client.Id }, clientDto);
        }

        // PUT: api/Clients/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutClient(int id, CreateClientRequest request)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            // Check if email already exists for another client
            if (await _context.Clients.AnyAsync(c => c.Email == request.Email && c.Id != id))
            {
                return Conflict("A person with this email already exists.");
            }

            client.FirstName = request.FirstName;
            client.LastName = request.LastName;
            client.Email = request.Email;
            client.Phone = request.Phone;
            client.PersonalIdNumber = request.PersonalIdNumber;
            client.Age = request.Age;
            client.Type = request.Type;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Clients/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(int id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client == null)
            {
                return NotFound();
            }

            // Check if client has contracts
            var hasClientContracts = await _context.Contracts.AnyAsync(c => c.ClientId == id);
            var hasAdminContracts = await _context.Contracts.AnyAsync(c => c.AdministratorId == id);
            var hasContractAdvisors = await _context.ContractAdvisors.AnyAsync(ca => ca.AdvisorId == id);

            if (hasClientContracts || hasAdminContracts || hasContractAdvisors)
            {
                return BadRequest("Cannot delete person because they are associated with existing contracts.");
            }

            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ClientExists(int id)
        {
            return _context.Clients.Any(e => e.Id == id);
        }
    }
}