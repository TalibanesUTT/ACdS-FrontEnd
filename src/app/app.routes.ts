import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./sections/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./sections/auth/register/register.component').then(
        (m) => m.registerComponent
      ),
  },
  {
    path: 'verifyEmail',
    loadComponent: () =>
      import('./sections/auth/verifyEmail/verifyEmail.component').then(
        (m) => m.verifyEmailComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./sections/panel/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
