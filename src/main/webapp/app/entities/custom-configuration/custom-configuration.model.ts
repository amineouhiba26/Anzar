import dayjs from 'dayjs/esm';

export interface ICustomConfiguration {
  id: number;
  name?: string | null;
  description?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewCustomConfiguration = Omit<ICustomConfiguration, 'id'> & { id: null };
