using BankAPI.Data;
using BankAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Services
{
    public class AccountService
    {
        private readonly AppDbContext _db;

        public AccountService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<AccountDto>> GetUserAccountsAsync(int userId)
        {
            return await _db.Accounts
                .Where(a => a.UserId == userId)
                .Select(a => new AccountDto
                {
                    Id            = a.Id,
                    AccountNumber = a.AccountNumber,
                    Type          = a.Type,
                    Balance       = a.Balance,
                    CreatedAt     = a.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<AccountDto> GetAccountByIdAsync(int accountId, int userId)
        {
            var account = await _db.Accounts
                .FirstOrDefaultAsync(a => a.Id == accountId && a.UserId == userId)
                ?? throw new Exception("Account not found.");

            return new AccountDto
            {
                Id            = account.Id,
                AccountNumber = account.AccountNumber,
                Type          = account.Type,
                Balance       = account.Balance,
                CreatedAt     = account.CreatedAt
            };
        }
    }
}
