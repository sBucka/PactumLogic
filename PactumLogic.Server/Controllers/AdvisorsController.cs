using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PactumLogic.Server.Data;
using PactumLogic.Server.Models;

namespace PactumLogic.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdvisorsController : ControllerBase
    {
        private readonly PactumLogicDbContext _context;

        public AdvisorsController(PactumLogicDbContext context)
        {
            _context = context;
        }

        // GET: api/Advisors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Advisor>>> GetAdvisors()
        {
            return await _context.Advisors.ToListAsync();
        }

        // GET: api/Advisors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Advisor>> GetAdvisor(int id)
        {
            var advisor = await _context.Advisors.FindAsync(id);

            if (advisor == null)
            {
                return NotFound();
            }

            return advisor;
        }

        // POST: api/Advisors
        [HttpPost]
        public async Task<ActionResult<Advisor>> PostAdvisor(Advisor advisor)
        {
            // Check if email already exists
            if (await _context.Advisors.AnyAsync(a => a.Email == advisor.Email))
            {
                return Conflict("An advisor with this email already exists.");
            }

            _context.Advisors.Add(advisor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdvisor), new { id = advisor.Id }, advisor);
        }

        // PUT: api/Advisors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdvisor(int id, Advisor advisor)
        {
            if (id != advisor.Id)
            {
                return BadRequest();
            }

            // Check if email already exists for another advisor
            if (await _context.Advisors.AnyAsync(a => a.Email == advisor.Email && a.Id != id))
            {
                return Conflict("An advisor with this email already exists.");
            }

            _context.Entry(advisor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdvisorExists(id))
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

        // DELETE: api/Advisors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdvisor(int id)
        {
            var advisor = await _context.Advisors.FindAsync(id);
            if (advisor == null)
            {
                return NotFound();
            }

            // Check if advisor is used in contracts
            var hasContracts = await _context.Contracts.AnyAsync(c => c.AdministratorId == id);
            var hasContractAdvisors = await _context.ContractAdvisors.AnyAsync(ca => ca.AdvisorId == id);

            if (hasContracts || hasContractAdvisors)
            {
                return BadRequest("Cannot delete advisor because they are associated with existing contracts.");
            }

            _context.Advisors.Remove(advisor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AdvisorExists(int id)
        {
            return _context.Advisors.Any(e => e.Id == id);
        }
    }
}