import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { NavbarLayoutComponent } from './layout/navbar-layout/navbar-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'file-management',
        pathMatch: 'full',
      },
      {
        path: 'file-management',
        loadChildren: () => import('./pages/file-management/file-management.routes'),
      },
    ],
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./pages/account/containers/login-container/login-container.component').then(
        (m) => m.LoginContainerComponent,
      ),
  },
];
