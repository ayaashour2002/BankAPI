import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/home/home').then((m) => m.HomeComponent),
      },
      {
        path: 'transfer',
        loadComponent: () =>
          import('./dashboard/transfer/transfer').then((m) => m.TransferComponent),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./dashboard/transactions/transactions').then((m) => m.TransactionsComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
