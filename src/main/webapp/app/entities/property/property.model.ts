import dayjs from 'dayjs/esm';
import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';

export interface IProperty {
  id: number;
  name?: string | null;
  price?: number | null;
  location?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  configuration?: ICustomConfiguration | null;
}

export type NewProperty = Omit<IProperty, 'id'> & { id: null };
