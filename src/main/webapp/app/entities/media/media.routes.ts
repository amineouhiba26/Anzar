import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MediaResolve from './route/media-routing-resolve.service';

const mediaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/media.component').then(m => m.MediaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/media-detail.component').then(m => m.MediaDetailComponent),
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/media-update.component').then(m => m.MediaUpdateComponent),
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/media-update.component').then(m => m.MediaUpdateComponent),
    resolve: {
      media: MediaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default mediaRoute;
