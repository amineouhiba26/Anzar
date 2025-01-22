import dayjs from 'dayjs/esm';

import { IBooking, NewBooking } from './booking.model';

export const sampleWithRequiredData: IBooking = {
  id: 4955,
};

export const sampleWithPartialData: IBooking = {
  id: 11967,
  startDate: dayjs('2025-01-21T16:28'),
  total: 13719.5,
  status: 'bah',
  createdBy: 'godfather blend revitalise',
  lastModifiedBy: 'really by repossess',
};

export const sampleWithFullData: IBooking = {
  id: 28482,
  startDate: dayjs('2025-01-22T00:26'),
  endDate: dayjs('2025-01-22T04:17'),
  total: 13590.51,
  status: 'widow joint',
  createdBy: 'however gadzooks slimy',
  createdDate: dayjs('2025-01-21T16:21'),
  lastModifiedBy: 'unconscious',
  lastModifiedDate: dayjs('2025-01-21T14:41'),
};

export const sampleWithNewData: NewBooking = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
