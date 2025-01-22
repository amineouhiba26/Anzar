import dayjs from 'dayjs/esm';

import { IAdmin, NewAdmin } from './admin.model';

export const sampleWithRequiredData: IAdmin = {
  id: 12297,
};

export const sampleWithPartialData: IAdmin = {
  id: 2194,
  username: 'recklessly',
  lastName: 'Marquardt',
};

export const sampleWithFullData: IAdmin = {
  id: 23061,
  username: 'adventurously',
  firstName: 'Dandre',
  lastName: 'Hermann',
  email: 'Hortense12@yahoo.com',
  phoneNumber: 'outgoing lest aha',
  status: 'strictly',
  accessLevel: 'readies',
  createdBy: 'empty yum',
  createdDate: dayjs('2025-01-21T15:44'),
  lastModifiedBy: 'fooey selfishly',
  lastModifiedDate: dayjs('2025-01-22T01:05'),
};

export const sampleWithNewData: NewAdmin = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
