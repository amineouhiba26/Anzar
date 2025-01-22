import dayjs from 'dayjs/esm';

import { ICustomConfiguration, NewCustomConfiguration } from './custom-configuration.model';

export const sampleWithRequiredData: ICustomConfiguration = {
  id: 32361,
};

export const sampleWithPartialData: ICustomConfiguration = {
  id: 4154,
  name: 'loyalty intend hence',
  description: 'breastplate within midst',
  createdDate: dayjs('2025-01-22T07:34'),
};

export const sampleWithFullData: ICustomConfiguration = {
  id: 1573,
  name: 'if incidentally bus',
  description: 'next lotion ugh',
  createdBy: 'consequently geez',
  createdDate: dayjs('2025-01-21T12:34'),
  lastModifiedBy: 'phooey',
  lastModifiedDate: dayjs('2025-01-21T23:58'),
};

export const sampleWithNewData: NewCustomConfiguration = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
