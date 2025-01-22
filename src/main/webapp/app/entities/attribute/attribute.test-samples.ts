import dayjs from 'dayjs/esm';

import { IAttribute, NewAttribute } from './attribute.model';

export const sampleWithRequiredData: IAttribute = {
  id: 22026,
};

export const sampleWithPartialData: IAttribute = {
  id: 28634,
  createdBy: 'reassuringly',
  lastModifiedBy: 'supposing meatloaf',
  lastModifiedDate: dayjs('2025-01-22T09:17'),
};

export const sampleWithFullData: IAttribute = {
  id: 14714,
  name: 'annually unconscious',
  type: 'until neighboring',
  createdBy: 'phooey',
  createdDate: dayjs('2025-01-22T03:06'),
  lastModifiedBy: 'faithfully venture gestate',
  lastModifiedDate: dayjs('2025-01-22T07:09'),
};

export const sampleWithNewData: NewAttribute = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
