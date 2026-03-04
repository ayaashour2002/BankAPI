import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private apiUrl = 'http://localhost:5142/api/transactions';

  constructor(private http: HttpClient) {}

  transfer(data: {
    fromAccountId: number;
    toAccountNumber: string;
    amount: number;
    description: string;
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/transfer`, data);
  }

  getHistory(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/history/${accountId}`);
  }
}
