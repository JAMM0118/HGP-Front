import { Routes } from '@angular/router';

export const routes: Routes = [
  {

    path: '**',
    loadComponent: () => import('./dashboard/executive-summary/executive-summary')
  }
];
