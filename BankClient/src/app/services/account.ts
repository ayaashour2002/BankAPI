import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../models/account';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private apiUrl = 'http://localhost:5142/api/accounts';

  constructor(private http: HttpClient) {}

  getMyAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getAccount(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }
}
