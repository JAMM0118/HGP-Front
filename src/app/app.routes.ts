import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./dashboard/home/home')
  },
  {
    path: 'summary',
    loadComponent: () => import('./dashboard/components/executive-summary/executive-summary')
  },
  {
    path: 'data-table',
    loadComponent: () => import('./dashboard/components/data-table/data-table')
  },
  {
    path: 'geospatial',
    loadComponent: () => import('./dashboard/components/geospatial-intelligence/geospatial-intelligence')
  },
  {
    path: 'prediction',
    loadComponent: () => import('./dashboard/components/predictive-modelling/predictive-modelling')
  },
  {
     path: 'ml-performance',
     loadComponent: () => import('./dashboard/components/ml-performance/ml-performance')
  },
  {
    path: 'insights',
    loadComponent: () => import('./dashboard/components/ai-insights/ai-insights')
  },
  {
    path: 'predictive-modelling',
    loadComponent: () => import('./dashboard/components/predictive-modelling/predictive-modelling')
  }

];
