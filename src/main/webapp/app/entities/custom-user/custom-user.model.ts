import dayjs from 'dayjs/esm';
import { IRole } from 'app/entities/role/role.model';
import { IAgency } from 'app/entities/agency/agency.model';

export interface ICustomUser {
  id: number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  status?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  role?: IRole | null;
  agency?: IAgency | null;
}

export type NewCustomUser = Omit<ICustomUser, 'id'> & { id: null };
