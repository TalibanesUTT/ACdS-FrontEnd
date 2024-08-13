import {Routes} from '@angular/router';
import roleGuard from "./guards/role.guard";
import {RoleEnum} from "./sections/panel/appointments/user-role.service";
import jwtGuard from "./guards/jwt.guard";

export const routes: Routes = [
  {
    //Auth
    path: 'login',
    loadComponent: () => import('./sections/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./sections/auth/register/register.component').then((m) => m.registerComponent),
  },
  {
    path: 'verifyEmail',
    loadComponent: () => import('./sections/auth/verifyEmail/verifyEmail.component').then((m) => m.verifyEmailComponent),
  },
  {
    path: 'reactiveCount',
    loadComponent: () => import('./sections/auth/reactiveCount/reactiveCount.component').then((m) => m.reactiveCountComponent),
  },
  {
    path: 'secondFactor',
    loadComponent: () => import('./sections/auth/secondFactor/secondFactor.component').then((m) => m.secondFactorComponent),
  },
  {
    path: 'recoverPassword',
    loadComponent: () => import('./sections/auth/recoverPassword/recoverPassword.component').then((m) => m.recoverPasswordComponent),
  },
  {
    //LandingPage
    path: 'ACdS',
    loadComponent: () => import('./sections/landingPage/landingPage.component').then((m) => m.LandingPageComponent),
  },
  {
    //Application
    path: 'home',
    loadComponent: () => import('./sections/panel/home/home.component').then((m) => m.HomeComponent),
    canActivate: [jwtGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./sections/panel/dashboard/dashboard.component').then((m) => m.dashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./sections/panel/users/users.component').then((m) => m.usersComponent),
        canActivate: [roleGuard],
        data: {roles: [RoleEnum.ADMIN]},
      },
      {
        path: 'carBrand',
        loadComponent: () => import('./sections/panel/carBrand/carBrand.component').then((m) => m.carBrandComponent),
        canActivate: [roleGuard],
        data: {roles: [RoleEnum.ADMIN, RoleEnum.MECHANIC]},
      },
      {
        path: 'customers',
        loadComponent: () => import('./sections/panel/customers/customers.component').then((m) => m.customersComponent),
        canActivate: [roleGuard],
        data: {roles: [RoleEnum.ADMIN, RoleEnum.MECHANIC]},

      },
      {
        path: 'perfil',
        loadComponent: () => import('./sections/panel/profile/profile.component').then((m) => m.profileComponent),
      },
      {
        path: 'vehicles',
        loadComponent: () => import('./sections/panel/vehicles/vehicles.component').then((m) => m.vehiclesComponent),
        canActivate: [roleGuard],
        data: {roles: [RoleEnum.ADMIN, RoleEnum.MECHANIC]},
      },
      {
        path: 'appointments',
        loadComponent: () => import('./sections/panel/appointments/appointment.component').then((m) => m.AppointmentComponent),
      },
      {
        path: 'orderService',
        loadComponent: () => import('./sections/panel/orderService/orderService.component').then((m) => m.orderServiceComponent),
      },
      {
        path: 'expenses',
        loadComponent: () => import('./sections/panel/expenses/expenses.component').then((m) => m.expensesComponent),
      },
    ],
  },
  {
    //RouteDefault
    path: '',
    redirectTo: 'ACdS',
    pathMatch: 'full',
  },
  {
    //RouteNotFound
    path: '**',
    redirectTo: 'ACdS',
    pathMatch: 'full',
  },
];
