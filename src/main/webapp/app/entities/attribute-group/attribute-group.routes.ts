import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AttributeGroupResolve from './route/attribute-group-routing-resolve.service';

const attributeGroupRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/attribute-group.component').then(m => m.AttributeGroupComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/attribute-group-detail.component').then(m => m.AttributeGroupDetailComponent),
    resolve: {
      attributeGroup: AttributeGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/attribute-group-update.component').then(m => m.AttributeGroupUpdateComponent),
    resolve: {
      attributeGroup: AttributeGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/attribute-group-update.component').then(m => m.AttributeGroupUpdateComponent),
    resolve: {
      attributeGroup: AttributeGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default attributeGroupRoute;
