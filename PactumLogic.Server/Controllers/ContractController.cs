using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Data;
using PactumLogic.Server.DTOs;

namespace PactumLogic.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContractsController : ControllerBase
    {
        private readonly PactumLogicDbContext _context;

        public ContractsController(PactumLogicDbContext context)
        {
            _context = context;
        }

        // GET: api/contracts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetContracts()
        {
            var contracts = await _context.Contracts
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .OrderByDescending(c => c.ContractDate)
                .Select(c => new
                {
                    c.Id,
                    c.ReferenceNumber,
                    c.Institution,
                    c.ClientId,
                    c.AdministratorId,
                    c.ContractDate,
                    c.ValidityDate,
                    c.TerminationDate,
                    Client = c.Client,
                    Administrator = c.Administrator,
                    Advisors = c.ContractAdvisors.Select(ca => ca.Advisor).ToList()
                })
                .ToListAsync();

            return Ok(contracts);
        }

        // GET: api/contracts/recent
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentContracts([FromQuery] int limit = 10)
        {
            var contracts = await _context.Contracts
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .OrderByDescending(c => c.ContractDate)
                .Take(limit)
                .Select(c => new
                {
                    c.Id,
                    c.ReferenceNumber,
                    c.Institution,
                    c.ClientId,
                    c.AdministratorId,
                    c.ContractDate,
                    c.ValidityDate,
                    c.TerminationDate,
                    Client = c.Client,
                    Administrator = c.Administrator,
                    Advisors = c.ContractAdvisors.Select(ca => ca.Advisor).ToList()
                })
                .ToListAsync();

            return Ok(contracts);
        }

        // GET: api/contracts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetContract(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.ReferenceNumber,
                    c.Institution,
                    c.ClientId,
                    c.AdministratorId,
                    c.ContractDate,
                    c.ValidityDate,
                    c.TerminationDate,
                    Client = c.Client,
                    Administrator = c.Administrator,
                    Advisors = c.ContractAdvisors.Select(ca => ca.Advisor).ToList()
                })
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        // GET: api/contracts/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var contractCount = await _context.Contracts.CountAsync();
            var clientCount = await _context.Clients.CountAsync();
            var advisorCount = await _context.Advisors.CountAsync();

            return Ok(new
            {
                ContractCount = contractCount,
                ClientCount = clientCount,
                AdvisorCount = advisorCount
            });
        }

        // DELETE: api/contracts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContract(int id)
        {
            var contract = await _context.Contracts.FindAsync(id);
            if (contract == null)
            {
                return NotFound();
            }

            _context.Contracts.Remove(contract);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // CREATE: api/contracts
        [HttpPost]
        public async Task<ActionResult<object>> CreateContract([FromBody] CreateContractDto contractDto)
        {
            if (contractDto == null)
            {
                return BadRequest("Contract data is required.");
            }

            // Find client by email
            var client = await _context.Clients.FirstOrDefaultAsync(c => c.Email == contractDto.ClientEmail);
            if (client == null)
            {
                return BadRequest($"Client with email '{contractDto.ClientEmail}' not found.");
            }

            // Find administrator by email
            var administrator = await _context.Advisors.FirstOrDefaultAsync(a => a.Email == contractDto.AdministratorEmail);
            if (administrator == null)
            {
                return BadRequest($"Administrator with email '{contractDto.AdministratorEmail}' not found.");
            }

            // Check for duplicate reference number
            var exists = await _context.Contracts.AnyAsync(c => c.ReferenceNumber == contractDto.ReferenceNumber);
            if (exists)
            {
                return Conflict("A contract with the same reference number already exists.");
            }

            // Create the contract
            var contract = new Models.Contract
            {
                ReferenceNumber = contractDto.ReferenceNumber,
                Institution = contractDto.Institution,
                ClientId = client.Id,
                AdministratorId = administrator.Id,
                ContractDate = DateOnly.Parse(contractDto.ContractDate),
                ValidityDate = DateOnly.Parse(contractDto.ValidityDate),
                TerminationDate = !string.IsNullOrEmpty(contractDto.TerminationDate) 
                    ? DateOnly.Parse(contractDto.TerminationDate) 
                    : null
            };

            _context.Contracts.Add(contract);
            await _context.SaveChangesAsync();

            // Add advisor relationships
            if (contractDto.AdvisorEmails != null && contractDto.AdvisorEmails.Any())
            {
                var advisors = await _context.Advisors
                    .Where(a => contractDto.AdvisorEmails.Contains(a.Email))
                    .ToListAsync();

                foreach (var advisor in advisors)
                {
                    var contractAdvisor = new Models.ContractAdvisor
                    {
                        ContractId = contract.Id,
                        AdvisorId = advisor.Id
                    };
                    _context.ContractAdvisors.Add(contractAdvisor);
                }

                await _context.SaveChangesAsync();
            }

            // Return the created contract with details
            var createdContract = await _context.Contracts
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .Where(c => c.Id == contract.Id)
                .Select(c => new
                {
                    c.Id,
                    c.ReferenceNumber,
                    c.Institution,
                    c.ClientId,
                    c.AdministratorId,
                    c.ContractDate,
                    c.ValidityDate,
                    c.TerminationDate,
                    Client = c.Client,
                    Administrator = c.Administrator,
                    Advisors = c.ContractAdvisors.Select(ca => ca.Advisor).ToList()
                })
                .FirstAsync();

            return CreatedAtAction(nameof(GetContract), new { id = contract.Id }, createdContract);
        }


    }
}