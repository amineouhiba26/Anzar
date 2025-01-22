import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AttributeResolve from './route/attribute-routing-resolve.service';

const attributeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/attribute.component').then(m => m.AttributeComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/attribute-detail.component').then(m => m.AttributeDetailComponent),
    resolve: {
      attribute: AttributeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/attribute-update.component').then(m => m.AttributeUpdateComponent),
    resolve: {
      attribute: AttributeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/attribute-update.component').then(m => m.AttributeUpdateComponent),
    resolve: {
      attribute: AttributeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default attributeRoute;
