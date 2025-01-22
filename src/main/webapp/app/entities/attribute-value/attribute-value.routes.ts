import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AttributeValueResolve from './route/attribute-value-routing-resolve.service';

const attributeValueRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/attribute-value.component').then(m => m.AttributeValueComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/attribute-value-detail.component').then(m => m.AttributeValueDetailComponent),
    resolve: {
      attributeValue: AttributeValueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/attribute-value-update.component').then(m => m.AttributeValueUpdateComponent),
    resolve: {
      attributeValue: AttributeValueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/attribute-value-update.component').then(m => m.AttributeValueUpdateComponent),
    resolve: {
      attributeValue: AttributeValueResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default attributeValueRoute;
