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
    public class ContractsController : ControllerBase
    {
        private readonly PactumLogicDbContext _context;

        public ContractsController(PactumLogicDbContext context)
        {
            _context = context;
        }

        // GET: api/contracts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContractResponseDto>>> GetContracts()
        {
            var contracts = await _context.Contracts
                .AsNoTracking()
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .Select(c => new ContractResponseDto
                {
                    Id = c.Id,
                    ReferenceNumber = c.ReferenceNumber,
                    Institution = c.Institution,
                    ClientId = c.ClientId,
                    AdministratorId = c.AdministratorId,
                    ContractDate = c.ContractDate,
                    ValidityDate = c.ValidityDate,
                    TerminationDate = c.TerminationDate,
                    Client = new ClientDto
                    {
                        Id = c.Client.Id,
                        FirstName = c.Client.FirstName,
                        LastName = c.Client.LastName,
                        Email = c.Client.Email,
                        Phone = c.Client.Phone,
                        PersonalIdNumber = c.Client.PersonalIdNumber,
                        Age = c.Client.Age,
                        Type = c.Client.Type
                    },
                    Administrator = new AdvisorDto
                    {
                        Id = c.Administrator.Id,
                        FirstName = c.Administrator.FirstName,
                        LastName = c.Administrator.LastName,
                        Email = c.Administrator.Email,
                        Phone = c.Administrator.Phone,
                        PersonalIdNumber = c.Administrator.PersonalIdNumber,
                        Age = c.Administrator.Age,
                        Type = c.Administrator.Type
                    },
                    Advisors = c.ContractAdvisors.Select(ca => new AdvisorDto
                    {
                        Id = ca.Advisor.Id,
                        FirstName = ca.Advisor.FirstName,
                        LastName = ca.Advisor.LastName,
                        Email = ca.Advisor.Email,
                        Phone = ca.Advisor.Phone,
                        PersonalIdNumber = ca.Advisor.PersonalIdNumber,
                        Age = ca.Advisor.Age,
                        Type = ca.Advisor.Type
                    }).ToList()
                })
                .ToListAsync();

            return Ok(contracts);
        }

        // GET: /api/contracts/recent?limit=10
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<ContractResponseDto>>> GetRecentContracts(int limit = 10)
        {
            var recentContracts = await _context.Contracts
                .AsNoTracking()
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .OrderByDescending(c => c.ContractDate)
                .Take(limit)
                .Select(c => new ContractResponseDto
                {
                    Id = c.Id,
                    ReferenceNumber = c.ReferenceNumber,
                    Institution = c.Institution,
                    ClientId = c.ClientId,
                    AdministratorId = c.AdministratorId,
                    ContractDate = c.ContractDate,
                    ValidityDate = c.ValidityDate,
                    TerminationDate = c.TerminationDate,
                    Client = new ClientDto
                    {
                        Id = c.Client.Id,
                        FirstName = c.Client.FirstName,
                        LastName = c.Client.LastName,
                        Email = c.Client.Email,
                        Phone = c.Client.Phone,
                        PersonalIdNumber = c.Client.PersonalIdNumber,
                        Age = c.Client.Age,
                        Type = c.Client.Type
                    },
                    Administrator = new AdvisorDto
                    {
                        Id = c.Administrator.Id,
                        FirstName = c.Administrator.FirstName,
                        LastName = c.Administrator.LastName,
                        Email = c.Administrator.Email,
                        Phone = c.Administrator.Phone,
                        PersonalIdNumber = c.Administrator.PersonalIdNumber,
                        Age = c.Administrator.Age,
                        Type = c.Administrator.Type
                    },
                    Advisors = c.ContractAdvisors.Select(ca => new AdvisorDto
                    {
                        Id = ca.Advisor.Id,
                        FirstName = ca.Advisor.FirstName,
                        LastName = ca.Advisor.LastName,
                        Email = ca.Advisor.Email,
                        Phone = ca.Advisor.Phone,
                        PersonalIdNumber = ca.Advisor.PersonalIdNumber,
                        Age = ca.Advisor.Age,
                        Type = ca.Advisor.Type
                    }).ToList()
                })
                .ToListAsync();
            return Ok(recentContracts);
        }

        // GET: api/contracts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContractResponseDto>> GetContract(int id)
        {
            var contract = await _context.Contracts
                .AsNoTracking()
                .Include(c => c.Client)
                .Include(c => c.Administrator)
                .Include(c => c.ContractAdvisors)
                    .ThenInclude(ca => ca.Advisor)
                .Where(c => c.Id == id)
                .Select(c => new ContractResponseDto
                {
                    Id = c.Id,
                    ReferenceNumber = c.ReferenceNumber,
                    Institution = c.Institution,
                    ClientId = c.ClientId,
                    AdministratorId = c.AdministratorId,
                    ContractDate = c.ContractDate,
                    ValidityDate = c.ValidityDate,
                    TerminationDate = c.TerminationDate,
                    Client = new ClientDto
                    {
                        Id = c.Client.Id,
                        FirstName = c.Client.FirstName,
                        LastName = c.Client.LastName,
                        Email = c.Client.Email,
                        Phone = c.Client.Phone,
                        PersonalIdNumber = c.Client.PersonalIdNumber,
                        Age = c.Client.Age,
                        Type = c.Client.Type
                    },
                    Administrator = new AdvisorDto
                    {
                        Id = c.Administrator.Id,
                        FirstName = c.Administrator.FirstName,
                        LastName = c.Administrator.LastName,
                        Email = c.Administrator.Email,
                        Phone = c.Administrator.Phone,
                        PersonalIdNumber = c.Administrator.PersonalIdNumber,
                        Age = c.Administrator.Age,
                        Type = c.Administrator.Type
                    },
                    Advisors = c.ContractAdvisors.Select(ca => new AdvisorDto
                    {
                        Id = ca.Advisor.Id,
                        FirstName = ca.Advisor.FirstName,
                        LastName = ca.Advisor.LastName,
                        Email = ca.Advisor.Email,
                        Phone = ca.Advisor.Phone,
                        PersonalIdNumber = ca.Advisor.PersonalIdNumber,
                        Age = ca.Advisor.Age,
                        Type = ca.Advisor.Type
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }

        // CREATE: api/contracts
        [HttpPost]
        public async Task<ActionResult<ContractResponseDto>> CreateContract([FromBody] ContractDto contractDto)
        {
            if (contractDto == null)
            {
                return BadRequest("Contract data is required.");
            }

            // Find client by email (must be Client or Both type)
            var client = await _context.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Email == contractDto.ClientEmail && 
                    (c.Type == ClientType.Client || c.Type == ClientType.Both));
            if (client == null)
            {
                return BadRequest($"Client with email '{contractDto.ClientEmail}' not found or is not a client.");
            }

            // Find administrator by email (must be Advisor or Both type)
            var administrator = await _context.Clients
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.Email == contractDto.AdministratorEmail && 
                    (c.Type == ClientType.Advisor || c.Type == ClientType.Both));
            if (administrator == null)
            {
                return BadRequest($"Administrator with email '{contractDto.AdministratorEmail}' not found or is not an advisor.");
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

            // Add advisor relationships if provided
            var advisorDtos = new List<AdvisorDto>();
            if (contractDto.AdvisorEmails != null && contractDto.AdvisorEmails.Any())
            {
                var advisors = await _context.Clients
                    .AsNoTracking()
                    .Where(c => contractDto.AdvisorEmails.Contains(c.Email) && 
                        (c.Type == ClientType.Advisor || c.Type == ClientType.Both))
                    .ToListAsync();

                foreach (var advisor in advisors)
                {
                    var contractAdvisor = new Models.ContractAdvisor
                    {
                        ContractId = contract.Id,
                        AdvisorId = advisor.Id
                    };
                    _context.ContractAdvisors.Add(contractAdvisor);

                    advisorDtos.Add(new AdvisorDto
                    {
                        Id = advisor.Id,
                        FirstName = advisor.FirstName,
                        LastName = advisor.LastName,
                        Email = advisor.Email,
                        Phone = advisor.Phone,
                        PersonalIdNumber = advisor.PersonalIdNumber,
                        Age = advisor.Age,
                        Type = advisor.Type
                    });
                }

                await _context.SaveChangesAsync();
            }

            // Return the created contract as DTO
            var createdContractDto = new ContractResponseDto
            {
                Id = contract.Id,
                ReferenceNumber = contract.ReferenceNumber,
                Institution = contract.Institution,
                ClientId = contract.ClientId,
                AdministratorId = contract.AdministratorId,
                ContractDate = contract.ContractDate,
                ValidityDate = contract.ValidityDate,
                TerminationDate = contract.TerminationDate,
                Client = new ClientDto
                {
                    Id = client.Id,
                    FirstName = client.FirstName,
                    LastName = client.LastName,
                    Email = client.Email,
                    Phone = client.Phone,
                    PersonalIdNumber = client.PersonalIdNumber,
                    Age = client.Age,
                    Type = client.Type
                },
                Administrator = new AdvisorDto
                {
                    Id = administrator.Id,
                    FirstName = administrator.FirstName,
                    LastName = administrator.LastName,
                    Email = administrator.Email,
                    Phone = administrator.Phone,
                    PersonalIdNumber = administrator.PersonalIdNumber,
                    Age = administrator.Age,
                    Type = administrator.Type
                },
                Advisors = advisorDtos
            };

            return CreatedAtAction(nameof(GetContract), new { id = contract.Id }, createdContractDto);
        }

        [HttpPut("{id}")]
public async Task<ActionResult<ContractResponseDto>> UpdateContract(int id, [FromBody] ContractDto contractDto)
{
    if (contractDto == null)
    {
        return BadRequest("Contract data is required.");
    }

    // Find existing contract
    var existingContract = await _context.Contracts
        .Include(c => c.ContractAdvisors)
        .FirstOrDefaultAsync(c => c.Id == id);
    
    if (existingContract == null)
    {
        return NotFound();
    }

    // Find client by email (must be Client or Both type)
    var client = await _context.Clients
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.Email == contractDto.ClientEmail && 
            (c.Type == ClientType.Client || c.Type == ClientType.Both));
    if (client == null)
    {
        return BadRequest($"Client with email '{contractDto.ClientEmail}' not found or is not a client.");
    }

    // Find administrator by email (must be Advisor or Both type)
    var administrator = await _context.Clients
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.Email == contractDto.AdministratorEmail && 
            (c.Type == ClientType.Advisor || c.Type == ClientType.Both));
    if (administrator == null)
    {
        return BadRequest($"Administrator with email '{contractDto.AdministratorEmail}' not found or is not an advisor.");
    }

    // Check for duplicate reference number (excluding current contract)
    var exists = await _context.Contracts.AnyAsync(c => c.ReferenceNumber == contractDto.ReferenceNumber && c.Id != id);
    if (exists)
    {
        return Conflict("A contract with the same reference number already exists.");
    }

    // Update the contract
    existingContract.ReferenceNumber = contractDto.ReferenceNumber;
    existingContract.Institution = contractDto.Institution;
    existingContract.ClientId = client.Id;
    existingContract.AdministratorId = administrator.Id;
    existingContract.ContractDate = DateOnly.Parse(contractDto.ContractDate);
    existingContract.ValidityDate = DateOnly.Parse(contractDto.ValidityDate);
    existingContract.TerminationDate = !string.IsNullOrEmpty(contractDto.TerminationDate)
        ? DateOnly.Parse(contractDto.TerminationDate)
        : null;

    // Remove existing advisor relationships
    _context.ContractAdvisors.RemoveRange(existingContract.ContractAdvisors);

    // Add new advisor relationships if provided
    var advisorDtos = new List<AdvisorDto>();
    if (contractDto.AdvisorEmails != null && contractDto.AdvisorEmails.Any())
    {
        var advisors = await _context.Clients
            .AsNoTracking()
            .Where(c => contractDto.AdvisorEmails.Contains(c.Email) && 
                (c.Type == ClientType.Advisor || c.Type == ClientType.Both))
            .ToListAsync();

        foreach (var advisor in advisors)
        {
            var contractAdvisor = new Models.ContractAdvisor
            {
                ContractId = existingContract.Id,
                AdvisorId = advisor.Id
            };
            _context.ContractAdvisors.Add(contractAdvisor);

            advisorDtos.Add(new AdvisorDto
            {
                Id = advisor.Id,
                FirstName = advisor.FirstName,
                LastName = advisor.LastName,
                Email = advisor.Email,
                Phone = advisor.Phone,
                PersonalIdNumber = advisor.PersonalIdNumber,
                Age = advisor.Age,
                Type = advisor.Type
            });
        }
    }

    await _context.SaveChangesAsync();

    // Return the updated contract as DTO
    var updatedContractDto = new ContractResponseDto
    {
        Id = existingContract.Id,
        ReferenceNumber = existingContract.ReferenceNumber,
        Institution = existingContract.Institution,
        ClientId = existingContract.ClientId,
        AdministratorId = existingContract.AdministratorId,
        ContractDate = existingContract.ContractDate,
        ValidityDate = existingContract.ValidityDate,
        TerminationDate = existingContract.TerminationDate,
        Client = new ClientDto
        {
            Id = client.Id,
            FirstName = client.FirstName,
            LastName = client.LastName,
            Email = client.Email,
            Phone = client.Phone,
            PersonalIdNumber = client.PersonalIdNumber,
            Age = client.Age,
            Type = client.Type
        },
        Administrator = new AdvisorDto
        {
            Id = administrator.Id,
            FirstName = administrator.FirstName,
            LastName = administrator.LastName,
            Email = administrator.Email,
            Phone = administrator.Phone,
            PersonalIdNumber = administrator.PersonalIdNumber,
            Age = administrator.Age,
            Type = administrator.Type
        },
        Advisors = advisorDtos
    };

    return Ok(updatedContractDto);
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

        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetStats()
        {
            var contractCount = await _context.Contracts.CountAsync();
            var clientCount = await _context.Clients.CountAsync(c => c.Type == ClientType.Client || c.Type == ClientType.Both);
            var advisorCount = await _context.Clients.CountAsync(c => c.Type == ClientType.Advisor || c.Type == ClientType.Both);

            return Ok(new
            {
                ContractCount = contractCount,
                ClientCount = clientCount,
                AdvisorCount = advisorCount
            });
        }
    }
}