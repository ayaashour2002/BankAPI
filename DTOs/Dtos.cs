namespace BankAPI.DTOs
{
    // ── Auth ──────────────────────────────────────────
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email    { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token    { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email    { get; set; } = string.Empty;
        public string Role     { get; set; } = string.Empty;
    }

    // ── Account ───────────────────────────────────────
    public class AccountDto
    {
        public int     Id            { get; set; }
        public string  AccountNumber { get; set; } = string.Empty;
        public string  Type          { get; set; } = string.Empty;
        public decimal Balance       { get; set; }
        public DateTime CreatedAt    { get; set; }
    }

    // ── Transfer ──────────────────────────────────────
    public class TransferDto
    {
        public int     FromAccountId { get; set; }
        public string  ToAccountNumber { get; set; } = string.Empty;
        public decimal Amount        { get; set; }
        public string  Description   { get; set; } = string.Empty;
    }

    // ── Transaction ───────────────────────────────────
    public class TransactionDto
    {
        public int      Id            { get; set; }
        public decimal  Amount        { get; set; }
        public string   Type          { get; set; } = string.Empty;
        public string   Description   { get; set; } = string.Empty;
        public DateTime Date          { get; set; }
        public string?  FromAccount   { get; set; }
        public string   ToAccount     { get; set; } = string.Empty;
        public string   Direction     { get; set; } = string.Empty; // "in" or "out"
    }
}
