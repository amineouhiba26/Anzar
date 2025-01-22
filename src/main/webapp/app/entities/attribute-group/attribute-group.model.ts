import dayjs from 'dayjs/esm';
import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';

export interface IAttributeGroup {
  id: number;
  name?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  customConfiguration?: ICustomConfiguration | null;
}

export type NewAttributeGroup = Omit<IAttributeGroup, 'id'> & { id: null };
