namespace BankAPI.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty; // Transfer / Deposit / Withdrawal
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public int? FromAccountId { get; set; }
        public Account? FromAccount { get; set; }

        public int ToAccountId { get; set; }
        public Account ToAccount { get; set; } = null!;
    }
}
