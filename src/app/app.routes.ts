import { Routes } from '@angular/router';
import { MainLayout } from './core/layout/main-layout/main-layout';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Main Layout Routes (Bottom Nav)
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home').then(m => m.Home),
        data: { title: 'Word Wonder' }
      },
      {
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites').then(m => m.Favorites),
        data: { title: 'My Words' }
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings').then(m => m.Settings),
        data: { title: 'Settings' }
      },
      {
        path: 'learn',
        loadComponent: () => import('./features/learn/learn').then(m => m.Learn),
        data: { title: 'Listen & Learn' }
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];
