import dayjs from 'dayjs/esm';

import { IRole, NewRole } from './role.model';

export const sampleWithRequiredData: IRole = {
  id: 2153,
};

export const sampleWithPartialData: IRole = {
  id: 14124,
  name: 'ah usefully inside',
  createdDate: dayjs('2025-01-22T06:06'),
};

export const sampleWithFullData: IRole = {
  id: 16604,
  name: 'before solidly swill',
  description: 'considering',
  createdBy: 'in forswear acknowledge',
  createdDate: dayjs('2025-01-22T09:51'),
  lastModifiedBy: 'supposing',
  lastModifiedDate: dayjs('2025-01-22T07:54'),
};

export const sampleWithNewData: NewRole = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
