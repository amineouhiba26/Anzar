import dayjs from 'dayjs/esm';

import { ICustomUser, NewCustomUser } from './custom-user.model';

export const sampleWithRequiredData: ICustomUser = {
  id: 26223,
};

export const sampleWithPartialData: ICustomUser = {
  id: 25297,
  username: 'known likewise determined',
  email: 'Ryley.Lowe51@gmail.com',
  status: 'below management aha',
  createdBy: 'boohoo',
  createdDate: dayjs('2025-01-21T22:39'),
  lastModifiedBy: 'athwart',
  lastModifiedDate: dayjs('2025-01-21T19:58'),
};

export const sampleWithFullData: ICustomUser = {
  id: 14745,
  username: 'dandelion skeletal',
  firstName: 'Marlene',
  lastName: 'Anderson',
  email: 'Bailey.Morissette@yahoo.com',
  phoneNumber: 'although edge',
  status: 'yesterday',
  createdBy: 'rationalize wherever hmph',
  createdDate: dayjs('2025-01-21T16:21'),
  lastModifiedBy: 'brr',
  lastModifiedDate: dayjs('2025-01-22T09:05'),
};

export const sampleWithNewData: NewCustomUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
