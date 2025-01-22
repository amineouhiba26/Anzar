import dayjs from 'dayjs/esm';
import { IAgency } from 'app/entities/agency/agency.model';

export interface IAdmin {
  id: number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  status?: string | null;
  accessLevel?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  agency?: IAgency | null;
}

export type NewAdmin = Omit<IAdmin, 'id'> & { id: null };
