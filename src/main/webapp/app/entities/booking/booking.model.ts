import dayjs from 'dayjs/esm';
import { IProperty } from 'app/entities/property/property.model';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';

export interface IBooking {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  total?: number | null;
  status?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  property?: IProperty | null;
  user?: ICustomUser | null;
}

export type NewBooking = Omit<IBooking, 'id'> & { id: null };
