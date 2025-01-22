import dayjs from 'dayjs/esm';
import { IAttributeGroup } from 'app/entities/attribute-group/attribute-group.model';

export interface IAttribute {
  id: number;
  name?: string | null;
  type?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  attributeGroup?: IAttributeGroup | null;
}

export type NewAttribute = Omit<IAttribute, 'id'> & { id: null };
