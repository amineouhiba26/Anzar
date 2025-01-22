import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAttributeValue, NewAttributeValue } from '../attribute-value.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAttributeValue for edit and NewAttributeValueFormGroupInput for create.
 */
type AttributeValueFormGroupInput = IAttributeValue | PartialWithRequiredKeyOf<NewAttributeValue>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAttributeValue | NewAttributeValue> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AttributeValueFormRawValue = FormValueOf<IAttributeValue>;

type NewAttributeValueFormRawValue = FormValueOf<NewAttributeValue>;

type AttributeValueFormDefaults = Pick<NewAttributeValue, 'id' | 'valueBoolean' | 'createdDate' | 'lastModifiedDate'>;

type AttributeValueFormGroupContent = {
  id: FormControl<AttributeValueFormRawValue['id'] | NewAttributeValue['id']>;
  valueString: FormControl<AttributeValueFormRawValue['valueString']>;
  valueBigDecimal: FormControl<AttributeValueFormRawValue['valueBigDecimal']>;
  valueBoolean: FormControl<AttributeValueFormRawValue['valueBoolean']>;
  createdBy: FormControl<AttributeValueFormRawValue['createdBy']>;
  createdDate: FormControl<AttributeValueFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AttributeValueFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AttributeValueFormRawValue['lastModifiedDate']>;
  property: FormControl<AttributeValueFormRawValue['property']>;
};

export type AttributeValueFormGroup = FormGroup<AttributeValueFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AttributeValueFormService {
  createAttributeValueFormGroup(attributeValue: AttributeValueFormGroupInput = { id: null }): AttributeValueFormGroup {
    const attributeValueRawValue = this.convertAttributeValueToAttributeValueRawValue({
      ...this.getFormDefaults(),
      ...attributeValue,
    });
    return new FormGroup<AttributeValueFormGroupContent>({
      id: new FormControl(
        { value: attributeValueRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      valueString: new FormControl(attributeValueRawValue.valueString),
      valueBigDecimal: new FormControl(attributeValueRawValue.valueBigDecimal),
      valueBoolean: new FormControl(attributeValueRawValue.valueBoolean),
      createdBy: new FormControl(attributeValueRawValue.createdBy),
      createdDate: new FormControl(attributeValueRawValue.createdDate),
      lastModifiedBy: new FormControl(attributeValueRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(attributeValueRawValue.lastModifiedDate),
      property: new FormControl(attributeValueRawValue.property),
    });
  }

  getAttributeValue(form: AttributeValueFormGroup): IAttributeValue | NewAttributeValue {
    return this.convertAttributeValueRawValueToAttributeValue(
      form.getRawValue() as AttributeValueFormRawValue | NewAttributeValueFormRawValue,
    );
  }

  resetForm(form: AttributeValueFormGroup, attributeValue: AttributeValueFormGroupInput): void {
    const attributeValueRawValue = this.convertAttributeValueToAttributeValueRawValue({ ...this.getFormDefaults(), ...attributeValue });
    form.reset(
      {
        ...attributeValueRawValue,
        id: { value: attributeValueRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AttributeValueFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      valueBoolean: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAttributeValueRawValueToAttributeValue(
    rawAttributeValue: AttributeValueFormRawValue | NewAttributeValueFormRawValue,
  ): IAttributeValue | NewAttributeValue {
    return {
      ...rawAttributeValue,
      createdDate: dayjs(rawAttributeValue.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAttributeValue.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAttributeValueToAttributeValueRawValue(
    attributeValue: IAttributeValue | (Partial<NewAttributeValue> & AttributeValueFormDefaults),
  ): AttributeValueFormRawValue | PartialWithRequiredKeyOf<NewAttributeValueFormRawValue> {
    return {
      ...attributeValue,
      createdDate: attributeValue.createdDate ? attributeValue.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: attributeValue.lastModifiedDate ? attributeValue.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
