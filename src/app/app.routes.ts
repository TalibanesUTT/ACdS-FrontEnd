import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    //Auth
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
    //LandingPage
    path: 'ACdS',
    loadComponent: () =>
      import('./sections/landingPage/landingPage.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    //Application
    path: 'home',
    loadComponent: () =>
      import('./sections/panel/home/home.component').then(
        (m) => m.HomeComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./sections/panel/dashboard/dashboard.component').then(
            (m) => m.dashboardComponent
          ),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./sections/panel/users/users.component').then(
            (m) => m.usersComponent
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./sections/panel/profile/profile.component').then(
            (m) => m.profileComponent
          ),
      },
    ],
  },
  {
    //RouteDefault
    path: '',
    redirectTo: 'ACdS',
    pathMatch: 'full',
  },
];
