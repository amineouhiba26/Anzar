import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAttribute, NewAttribute } from '../attribute.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttribute for edit and NewAttributeFormGroupInput for create.
 */
type AttributeFormGroupInput = IAttribute | PartialWithRequiredKeyOf<NewAttribute>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAttribute | NewAttribute> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AttributeFormRawValue = FormValueOf<IAttribute>;

type NewAttributeFormRawValue = FormValueOf<NewAttribute>;

type AttributeFormDefaults = Pick<NewAttribute, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AttributeFormGroupContent = {
  id: FormControl<AttributeFormRawValue['id'] | NewAttribute['id']>;
  name: FormControl<AttributeFormRawValue['name']>;
  type: FormControl<AttributeFormRawValue['type']>;
  createdBy: FormControl<AttributeFormRawValue['createdBy']>;
  createdDate: FormControl<AttributeFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AttributeFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AttributeFormRawValue['lastModifiedDate']>;
  attributeGroup: FormControl<AttributeFormRawValue['attributeGroup']>;
};

export type AttributeFormGroup = FormGroup<AttributeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttributeFormService {
  createAttributeFormGroup(attribute: AttributeFormGroupInput = { id: null }): AttributeFormGroup {
    const attributeRawValue = this.convertAttributeToAttributeRawValue({
      ...this.getFormDefaults(),
      ...attribute,
    });
    return new FormGroup<AttributeFormGroupContent>({
      id: new FormControl(
        { value: attributeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(attributeRawValue.name),
      type: new FormControl(attributeRawValue.type),
      createdBy: new FormControl(attributeRawValue.createdBy),
      createdDate: new FormControl(attributeRawValue.createdDate),
      lastModifiedBy: new FormControl(attributeRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(attributeRawValue.lastModifiedDate),
      attributeGroup: new FormControl(attributeRawValue.attributeGroup),
    });
  }

  getAttribute(form: AttributeFormGroup): IAttribute | NewAttribute {
    return this.convertAttributeRawValueToAttribute(form.getRawValue() as AttributeFormRawValue | NewAttributeFormRawValue);
  }

  resetForm(form: AttributeFormGroup, attribute: AttributeFormGroupInput): void {
    const attributeRawValue = this.convertAttributeToAttributeRawValue({ ...this.getFormDefaults(), ...attribute });
    form.reset(
      {
        ...attributeRawValue,
        id: { value: attributeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AttributeFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAttributeRawValueToAttribute(rawAttribute: AttributeFormRawValue | NewAttributeFormRawValue): IAttribute | NewAttribute {
    return {
      ...rawAttribute,
      createdDate: dayjs(rawAttribute.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAttribute.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAttributeToAttributeRawValue(
    attribute: IAttribute | (Partial<NewAttribute> & AttributeFormDefaults),
  ): AttributeFormRawValue | PartialWithRequiredKeyOf<NewAttributeFormRawValue> {
    return {
      ...attribute,
      createdDate: attribute.createdDate ? attribute.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: attribute.lastModifiedDate ? attribute.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
