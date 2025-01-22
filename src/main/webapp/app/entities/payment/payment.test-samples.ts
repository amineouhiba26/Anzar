import dayjs from 'dayjs/esm';

import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: 4942,
};

export const sampleWithPartialData: IPayment = {
  id: 26157,
  status: 'gah less beneath',
  lastModifiedBy: 'transom round minor',
};

export const sampleWithFullData: IPayment = {
  id: 28239,
  amount: 11240.4,
  status: 'via close',
  createdBy: 'huzzah eke',
  createdDate: dayjs('2025-01-21T12:37'),
  lastModifiedBy: 'ordinary as',
  lastModifiedDate: dayjs('2025-01-21T13:02'),
};

export const sampleWithNewData: NewPayment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
