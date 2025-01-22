import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CustomConfigurationResolve from './route/custom-configuration-routing-resolve.service';

const customConfigurationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/custom-configuration.component').then(m => m.CustomConfigurationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/custom-configuration-detail.component').then(m => m.CustomConfigurationDetailComponent),
    resolve: {
      customConfiguration: CustomConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/custom-configuration-update.component').then(m => m.CustomConfigurationUpdateComponent),
    resolve: {
      customConfiguration: CustomConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/custom-configuration-update.component').then(m => m.CustomConfigurationUpdateComponent),
    resolve: {
      customConfiguration: CustomConfigurationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default customConfigurationRoute;
