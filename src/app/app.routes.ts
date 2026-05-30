import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
 {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login')
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register')
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/pages/dashboard/dashboard'),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }

];
