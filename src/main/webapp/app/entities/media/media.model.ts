import dayjs from 'dayjs/esm';
import { IProperty } from 'app/entities/property/property.model';

export interface IMedia {
  id: number;
  url?: string | null;
  caption?: string | null;
  category?: string | null;
  order?: number | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  property?: IProperty | null;
}

export type NewMedia = Omit<IMedia, 'id'> & { id: null };
