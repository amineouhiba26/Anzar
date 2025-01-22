import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AdminResolve from './route/admin-routing-resolve.service';

const adminRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/admin.component').then(m => m.AdminComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/admin-detail.component').then(m => m.AdminDetailComponent),
    resolve: {
      admin: AdminResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/admin-update.component').then(m => m.AdminUpdateComponent),
    resolve: {
      admin: AdminResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/admin-update.component').then(m => m.AdminUpdateComponent),
    resolve: {
      admin: AdminResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default adminRoute;
