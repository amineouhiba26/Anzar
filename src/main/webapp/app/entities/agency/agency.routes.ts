import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AgencyResolve from './route/agency-routing-resolve.service';

const agencyRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/agency.component').then(m => m.AgencyComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/agency-detail.component').then(m => m.AgencyDetailComponent),
    resolve: {
      agency: AgencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/agency-update.component').then(m => m.AgencyUpdateComponent),
    resolve: {
      agency: AgencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/agency-update.component').then(m => m.AgencyUpdateComponent),
    resolve: {
      agency: AgencyResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default agencyRoute;
