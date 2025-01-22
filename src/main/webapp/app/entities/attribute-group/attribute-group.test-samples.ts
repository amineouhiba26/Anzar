import dayjs from 'dayjs/esm';

import { IAttributeGroup, NewAttributeGroup } from './attribute-group.model';

export const sampleWithRequiredData: IAttributeGroup = {
  id: 24102,
};

export const sampleWithPartialData: IAttributeGroup = {
  id: 19982,
  createdBy: 'boo reboot',
  lastModifiedDate: dayjs('2025-01-21T12:13'),
};

export const sampleWithFullData: IAttributeGroup = {
  id: 17026,
  name: 'ew since furiously',
  createdBy: 'yippee',
  createdDate: dayjs('2025-01-21T13:13'),
  lastModifiedBy: 'as couch meanwhile',
  lastModifiedDate: dayjs('2025-01-21T19:55'),
};

export const sampleWithNewData: NewAttributeGroup = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
