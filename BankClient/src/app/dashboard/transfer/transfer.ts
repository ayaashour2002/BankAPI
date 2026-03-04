import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AccountService } from '../../services/account';
import { TransactionService } from '../../services/transaction';
import { Account } from '../../models/account';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class TransferComponent implements OnInit {
  form: FormGroup;
  accounts: Account[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      fromAccountId: ['', Validators.required],
      toAccountNumber: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.accountService.getMyAccounts().subscribe((a) => (this.accounts = a));
  }

  getSelectedBalance(): number {
    const id = this.form.get('fromAccountId')?.value;
    return this.accounts.find((a) => a.id === id)?.balance ?? 0;
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    this.transactionService.transfer(this.form.value).subscribe({
      next: (res) => {
        this.snackBar.open('✅ ' + res.message, 'Close', { duration: 3000 });
        this.form.reset();
        this.loading = false;
        this.accountService.getMyAccounts().subscribe((a) => (this.accounts = a));
      },
      error: (err) => {
        this.snackBar.open('❌ ' + (err.error?.message || 'Transfer failed'), 'Close', {
          duration: 4000,
        });
        this.loading = false;
      },
    });
  }
}
