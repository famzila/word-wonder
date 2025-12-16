import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home').then(m => m.Home) 
  },
  { 
    path: 'edit-text', 
    loadComponent: () => import('./features/edit-text/edit-text').then(m => m.EditText) 
  },
  { 
    path: 'learn', 
    loadComponent: () => import('./features/learn/learn').then(m => m.Learn) 
  },
  { 
    path: 'favorites', 
    loadComponent: () => import('./features/favorites/favorites').then(m => m.Favorites) 
  },
  { 
    path: 'settings', 
    loadComponent: () => import('./features/settings/settings').then(m => m.Settings) 
  },
  { path: '**', redirectTo: '' }
];
