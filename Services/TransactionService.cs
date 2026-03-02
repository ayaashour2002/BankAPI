using BankAPI.Data;
using BankAPI.DTOs;
using BankAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Services
{
    public class TransactionService
    {
        private readonly AppDbContext _db;

        public TransactionService(AppDbContext db)
        {
            _db = db;
        }

        public async Task TransferAsync(TransferDto dto, int userId)
        {
            // Validate amount
            if (dto.Amount <= 0)
                throw new Exception("Amount must be greater than zero.");

            // Get sender account (must belong to current user)
            var fromAccount = await _db.Accounts
                .FirstOrDefaultAsync(a => a.Id == dto.FromAccountId && a.UserId == userId)
                ?? throw new Exception("Sender account not found.");

            // Check balance
            if (fromAccount.Balance < dto.Amount)
                throw new Exception("Insufficient balance.");

            // Get receiver account by account number
            var toAccount = await _db.Accounts
                .FirstOrDefaultAsync(a => a.AccountNumber == dto.ToAccountNumber)
                ?? throw new Exception("Recipient account not found.");

            if (fromAccount.Id == toAccount.Id)
                throw new Exception("Cannot transfer to the same account.");

            // Execute transfer
            fromAccount.Balance -= dto.Amount;
            toAccount.Balance   += dto.Amount;

            var transaction = new Transaction
            {
                Amount        = dto.Amount,
                Type          = "Transfer",
                Description   = dto.Description,
                Date          = DateTime.UtcNow,
                FromAccountId = fromAccount.Id,
                ToAccountId   = toAccount.Id
            };

            _db.Transactions.Add(transaction);
            await _db.SaveChangesAsync();
        }

        public async Task<List<TransactionDto>> GetHistoryAsync(int accountId, int userId)
        {
            // Make sure account belongs to user
            var account = await _db.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId)
                ?? throw new Exception("Account not found.");

            var transactions = await _db.Transactions
                .Include(t => t.FromAccount)
                .Include(t => t.ToAccount)
                .Where(t => t.FromAccountId == accountId || t.ToAccountId == accountId)
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return transactions.Select(t => new TransactionDto
            {
                Id          = t.Id,
                Amount      = t.Amount,
                Type        = t.Type,
                Description = t.Description,
                Date        = t.Date,
                FromAccount = t.FromAccount?.AccountNumber,
                ToAccount   = t.ToAccount.AccountNumber,
                Direction   = t.ToAccountId == accountId ? "in" : "out"
            }).ToList();
        }
    }
}
