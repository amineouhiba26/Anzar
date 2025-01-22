import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PropertyResolve from './route/property-routing-resolve.service';

const propertyRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/property.component').then(m => m.PropertyComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/property-detail.component').then(m => m.PropertyDetailComponent),
    resolve: {
      property: PropertyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/property-update.component').then(m => m.PropertyUpdateComponent),
    resolve: {
      property: PropertyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/property-update.component').then(m => m.PropertyUpdateComponent),
    resolve: {
      property: PropertyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default propertyRoute;
