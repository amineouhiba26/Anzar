import dayjs from 'dayjs/esm';

export interface IAgency {
  id: number;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  position?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewAgency = Omit<IAgency, 'id'> & { id: null };
