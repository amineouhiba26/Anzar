import dayjs from 'dayjs/esm';

import { IAgency, NewAgency } from './agency.model';

export const sampleWithRequiredData: IAgency = {
  id: 32427,
};

export const sampleWithPartialData: IAgency = {
  id: 19895,
  name: 'prickly loyally',
  email: 'Dorthy51@gmail.com',
  phoneNumber: 'gee meh',
};

export const sampleWithFullData: IAgency = {
  id: 32484,
  name: 'pro',
  email: 'Manuel.Green@yahoo.com',
  phoneNumber: 'amid',
  position: 'yahoo',
  createdBy: 'overcoat excepting fax',
  createdDate: dayjs('2025-01-21T16:48'),
  lastModifiedBy: 'sailor well',
  lastModifiedDate: dayjs('2025-01-22T08:15'),
};

export const sampleWithNewData: NewAgency = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
