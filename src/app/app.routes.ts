import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.registerComponent
      ),
  },
  {
    path: 'verifyEmail',
    loadComponent: () =>
      import('./auth/verifyEmail/verifyEmail.component').then(
        (m) => m.verifyEmailComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
