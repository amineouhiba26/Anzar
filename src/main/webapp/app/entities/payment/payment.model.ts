import dayjs from 'dayjs/esm';
import { IBooking } from 'app/entities/booking/booking.model';

export interface IPayment {
  id: number;
  amount?: number | null;
  status?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  booking?: IBooking | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
