import dayjs from 'dayjs/esm';

import { IProperty, NewProperty } from './property.model';

export const sampleWithRequiredData: IProperty = {
  id: 18751,
};

export const sampleWithPartialData: IProperty = {
  id: 21802,
  name: 'anenst',
  price: 9192.28,
  createdBy: 'immediately than afterwards',
  lastModifiedDate: dayjs('2025-01-22T11:06'),
};

export const sampleWithFullData: IProperty = {
  id: 8934,
  name: 'rigidly brightly mmm',
  price: 9715.1,
  location: 'smug huzzah',
  createdBy: 'simple yuppify oh',
  createdDate: dayjs('2025-01-21T21:13'),
  lastModifiedBy: 'mmm',
  lastModifiedDate: dayjs('2025-01-22T08:00'),
};

export const sampleWithNewData: NewProperty = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
