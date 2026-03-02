using System.Security.Claims;
using BankAPI.DTOs;
using BankAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionsController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        // POST api/transactions/transfer
        [HttpPost("transfer")]
        public async Task<IActionResult> Transfer(TransferDto dto)
        {
            try
            {
                var userId = GetUserId();
                await _transactionService.TransferAsync(dto, userId);
                return Ok(new { message = "Transfer completed successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // GET api/transactions/history/{accountId}
        [HttpGet("history/{accountId}")]
        public async Task<IActionResult> GetHistory(int accountId)
        {
            try
            {
                var userId  = GetUserId();
                var history = await _transactionService.GetHistoryAsync(accountId, userId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    }
}
