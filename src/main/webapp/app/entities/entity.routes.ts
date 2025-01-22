import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'admin',
    data: { pageTitle: 'Admins' },
    loadChildren: () => import('./admin/admin.routes'),
  },
  {
    path: 'custom-user',
    data: { pageTitle: 'CustomUsers' },
    loadChildren: () => import('./custom-user/custom-user.routes'),
  },
  {
    path: 'agency',
    data: { pageTitle: 'Agencies' },
    loadChildren: () => import('./agency/agency.routes'),
  },
  {
    path: 'role',
    data: { pageTitle: 'Roles' },
    loadChildren: () => import('./role/role.routes'),
  },
  {
    path: 'property',
    data: { pageTitle: 'Properties' },
    loadChildren: () => import('./property/property.routes'),
  },
  {
    path: 'media',
    data: { pageTitle: 'Media' },
    loadChildren: () => import('./media/media.routes'),
  },
  {
    path: 'custom-configuration',
    data: { pageTitle: 'CustomConfigurations' },
    loadChildren: () => import('./custom-configuration/custom-configuration.routes'),
  },
  {
    path: 'attribute-group',
    data: { pageTitle: 'AttributeGroups' },
    loadChildren: () => import('./attribute-group/attribute-group.routes'),
  },
  {
    path: 'attribute',
    data: { pageTitle: 'Attributes' },
    loadChildren: () => import('./attribute/attribute.routes'),
  },
  {
    path: 'attribute-value',
    data: { pageTitle: 'AttributeValues' },
    loadChildren: () => import('./attribute-value/attribute-value.routes'),
  },
  {
    path: 'booking',
    data: { pageTitle: 'Bookings' },
    loadChildren: () => import('./booking/booking.routes'),
  },
  {
    path: 'payment',
    data: { pageTitle: 'Payments' },
    loadChildren: () => import('./payment/payment.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
