using BankAPI.Data;
using BankAPI.DTOs;
using BankAPI.Helpers;
using BankAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BankAPI.Services
{
    public class AuthService
    {
        private readonly AppDbContext _db;
        private readonly JwtHelper    _jwt;

        public AuthService(AppDbContext db, JwtHelper jwt)
        {
            _db  = db;
            _jwt = jwt;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Check duplicate email
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("Email already exists.");

            var user = new AppUser
            {
                FullName     = dto.FullName,
                Email        = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role         = "Customer",
                CreatedAt    = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // Auto-create a Savings account for the new user
            var account = new Account
            {
                AccountNumber = GenerateAccountNumber(),
                Type          = "Savings",
                Balance       = 0,
                UserId        = user.Id,
                CreatedAt     = DateTime.UtcNow
            };
            _db.Accounts.Add(account);
            await _db.SaveChangesAsync();

            return new AuthResponseDto
            {
                Token    = _jwt.GenerateToken(user),
                FullName = user.FullName,
                Email    = user.Email,
                Role     = user.Role
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email)
                       ?? throw new Exception("Invalid email or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid email or password.");

            return new AuthResponseDto
            {
                Token    = _jwt.GenerateToken(user),
                FullName = user.FullName,
                Email    = user.Email,
                Role     = user.Role
            };
        }

        private static string GenerateAccountNumber()
        {
            var rng = new Random();
            return "EG" + rng.Next(100000000, 999999999).ToString();
        }
    }
}
