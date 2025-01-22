import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CustomUserResolve from './route/custom-user-routing-resolve.service';

const customUserRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/custom-user.component').then(m => m.CustomUserComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/custom-user-detail.component').then(m => m.CustomUserDetailComponent),
    resolve: {
      customUser: CustomUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/custom-user-update.component').then(m => m.CustomUserUpdateComponent),
    resolve: {
      customUser: CustomUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/custom-user-update.component').then(m => m.CustomUserUpdateComponent),
    resolve: {
      customUser: CustomUserResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default customUserRoute;
