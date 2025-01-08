import { Routes } from '@angular/router';
import { NavbarLayoutComponent } from './layout/navbar-layout/navbar-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
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
];
