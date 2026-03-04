import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AccountService } from '../../services/account';
import { TransactionService } from '../../services/transaction';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsComponent implements OnInit {
  accounts: Account[] = [];
  transactions: Transaction[] = [];
  selectedAccountId: number | null = null;
  loading = false;
  displayedColumns = ['date', 'type', 'description', 'from', 'to', 'amount'];

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.accountService.getMyAccounts().subscribe((accounts) => {
      this.accounts = accounts;
      if (accounts.length > 0) {
        this.selectedAccountId = accounts[0].id;
        this.loadHistory();
      }
    });
  }

  loadHistory(): void {
    if (!this.selectedAccountId) return;
    this.loading = true;
    this.transactionService.getHistory(this.selectedAccountId).subscribe({
      next: (txs) => {
        this.transactions = txs;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
