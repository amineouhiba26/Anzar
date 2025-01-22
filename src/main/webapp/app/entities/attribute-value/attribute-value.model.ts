import dayjs from 'dayjs/esm';
import { IProperty } from 'app/entities/property/property.model';

export interface IAttributeValue {
  id: number;
  valueString?: string | null;
  valueBigDecimal?: number | null;
  valueBoolean?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  property?: IProperty | null;
}

export type NewAttributeValue = Omit<IAttributeValue, 'id'> & { id: null };
