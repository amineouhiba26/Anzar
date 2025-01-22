import dayjs from 'dayjs/esm';

import { IAttributeValue, NewAttributeValue } from './attribute-value.model';

export const sampleWithRequiredData: IAttributeValue = {
  id: 9386,
};

export const sampleWithPartialData: IAttributeValue = {
  id: 24201,
  valueBoolean: false,
  createdDate: dayjs('2025-01-22T01:14'),
};

export const sampleWithFullData: IAttributeValue = {
  id: 30188,
  valueString: 'cod madly phew',
  valueBigDecimal: 30817.71,
  valueBoolean: false,
  createdBy: 'ew yuck hospitalization',
  createdDate: dayjs('2025-01-22T06:24'),
  lastModifiedBy: 'er',
  lastModifiedDate: dayjs('2025-01-22T10:45'),
};

export const sampleWithNewData: NewAttributeValue = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
