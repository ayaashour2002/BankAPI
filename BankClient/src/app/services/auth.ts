import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5142/api/auth';

  private _currentUser = signal<User | null>(this.getUserFromStorage());
  currentUser = this._currentUser.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(data: { fullName: string; email: string; password: string }) {
    return this.http
      .post<User>(`${this.apiUrl}/register`, data)
      .pipe(tap((user) => this.setUser(user)));
  }

  login(data: { email: string; password: string }) {
    return this.http
      .post<User>(`${this.apiUrl}/login`, data)
      .pipe(tap((user) => this.setUser(user)));
  }

  logout(): void {
    localStorage.removeItem('bankUser');
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._currentUser()?.token ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setUser(user: User): void {
    localStorage.setItem('bankUser', JSON.stringify(user));
    this._currentUser.set(user);
  }

  private getUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('bankUser');
    return data ? JSON.parse(data) : null;
  }
}
