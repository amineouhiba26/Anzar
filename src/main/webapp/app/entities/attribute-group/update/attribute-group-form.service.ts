import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAttributeGroup, NewAttributeGroup } from '../attribute-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttributeGroup for edit and NewAttributeGroupFormGroupInput for create.
 */
type AttributeGroupFormGroupInput = IAttributeGroup | PartialWithRequiredKeyOf<NewAttributeGroup>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAttributeGroup | NewAttributeGroup> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AttributeGroupFormRawValue = FormValueOf<IAttributeGroup>;

type NewAttributeGroupFormRawValue = FormValueOf<NewAttributeGroup>;

type AttributeGroupFormDefaults = Pick<NewAttributeGroup, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AttributeGroupFormGroupContent = {
  id: FormControl<AttributeGroupFormRawValue['id'] | NewAttributeGroup['id']>;
  name: FormControl<AttributeGroupFormRawValue['name']>;
  createdBy: FormControl<AttributeGroupFormRawValue['createdBy']>;
  createdDate: FormControl<AttributeGroupFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AttributeGroupFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AttributeGroupFormRawValue['lastModifiedDate']>;
  customConfiguration: FormControl<AttributeGroupFormRawValue['customConfiguration']>;
};

export type AttributeGroupFormGroup = FormGroup<AttributeGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttributeGroupFormService {
  createAttributeGroupFormGroup(attributeGroup: AttributeGroupFormGroupInput = { id: null }): AttributeGroupFormGroup {
    const attributeGroupRawValue = this.convertAttributeGroupToAttributeGroupRawValue({
      ...this.getFormDefaults(),
      ...attributeGroup,
    });
    return new FormGroup<AttributeGroupFormGroupContent>({
      id: new FormControl(
        { value: attributeGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(attributeGroupRawValue.name),
      createdBy: new FormControl(attributeGroupRawValue.createdBy),
      createdDate: new FormControl(attributeGroupRawValue.createdDate),
      lastModifiedBy: new FormControl(attributeGroupRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(attributeGroupRawValue.lastModifiedDate),
      customConfiguration: new FormControl(attributeGroupRawValue.customConfiguration),
    });
  }

  getAttributeGroup(form: AttributeGroupFormGroup): IAttributeGroup | NewAttributeGroup {
    return this.convertAttributeGroupRawValueToAttributeGroup(
      form.getRawValue() as AttributeGroupFormRawValue | NewAttributeGroupFormRawValue,
    );
  }

  resetForm(form: AttributeGroupFormGroup, attributeGroup: AttributeGroupFormGroupInput): void {
    const attributeGroupRawValue = this.convertAttributeGroupToAttributeGroupRawValue({ ...this.getFormDefaults(), ...attributeGroup });
    form.reset(
      {
        ...attributeGroupRawValue,
        id: { value: attributeGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AttributeGroupFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAttributeGroupRawValueToAttributeGroup(
    rawAttributeGroup: AttributeGroupFormRawValue | NewAttributeGroupFormRawValue,
  ): IAttributeGroup | NewAttributeGroup {
    return {
      ...rawAttributeGroup,
      createdDate: dayjs(rawAttributeGroup.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAttributeGroup.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAttributeGroupToAttributeGroupRawValue(
    attributeGroup: IAttributeGroup | (Partial<NewAttributeGroup> & AttributeGroupFormDefaults),
  ): AttributeGroupFormRawValue | PartialWithRequiredKeyOf<NewAttributeGroupFormRawValue> {
    return {
      ...attributeGroup,
      createdDate: attributeGroup.createdDate ? attributeGroup.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: attributeGroup.lastModifiedDate ? attributeGroup.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
