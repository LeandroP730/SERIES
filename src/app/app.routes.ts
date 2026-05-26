import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'episodes',
    pathMatch: 'full'
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./features/pages/episodes-page.component')
        .then(m => m.EpisodesPageComponent)
  },
  {
    path: '**',
    redirectTo: 'episodes'
  }
];