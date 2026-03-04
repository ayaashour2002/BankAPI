import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth';
import { AccountService } from '../../services/account';
import { TransactionService } from '../../services/transaction';
import { User } from '../../models/user';
import { Account } from '../../models/account';
import { Transaction } from '../../models/transaction';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private transactionService: TransactionService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    this.loadData();
  }

  loadData(): void {
    this.accountService.getMyAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        if (accounts.length > 0) {
          this.transactionService.getHistory(accounts[0].id).subscribe({
            next: (txs) => {
              this.recentTransactions = txs.slice(0, 5);
              this.loading = false;
            },
            error: () => (this.loading = false),
          });
        } else {
          this.loading = false;
        }
      },
      error: () => (this.loading = false),
    });
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, a) => sum + a.balance, 0);
  }
}
