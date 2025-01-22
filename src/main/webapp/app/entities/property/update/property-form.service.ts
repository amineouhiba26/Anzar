import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IProperty, NewProperty } from '../property.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProperty for edit and NewPropertyFormGroupInput for create.
 */
type PropertyFormGroupInput = IProperty | PartialWithRequiredKeyOf<NewProperty>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IProperty | NewProperty> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type PropertyFormRawValue = FormValueOf<IProperty>;

type NewPropertyFormRawValue = FormValueOf<NewProperty>;

type PropertyFormDefaults = Pick<NewProperty, 'id' | 'createdDate' | 'lastModifiedDate'>;

type PropertyFormGroupContent = {
  id: FormControl<PropertyFormRawValue['id'] | NewProperty['id']>;
  name: FormControl<PropertyFormRawValue['name']>;
  price: FormControl<PropertyFormRawValue['price']>;
  location: FormControl<PropertyFormRawValue['location']>;
  createdBy: FormControl<PropertyFormRawValue['createdBy']>;
  createdDate: FormControl<PropertyFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<PropertyFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<PropertyFormRawValue['lastModifiedDate']>;
  configuration: FormControl<PropertyFormRawValue['configuration']>;
};

export type PropertyFormGroup = FormGroup<PropertyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PropertyFormService {
  createPropertyFormGroup(property: PropertyFormGroupInput = { id: null }): PropertyFormGroup {
    const propertyRawValue = this.convertPropertyToPropertyRawValue({
      ...this.getFormDefaults(),
      ...property,
    });
    return new FormGroup<PropertyFormGroupContent>({
      id: new FormControl(
        { value: propertyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(propertyRawValue.name),
      price: new FormControl(propertyRawValue.price),
      location: new FormControl(propertyRawValue.location),
      createdBy: new FormControl(propertyRawValue.createdBy),
      createdDate: new FormControl(propertyRawValue.createdDate),
      lastModifiedBy: new FormControl(propertyRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(propertyRawValue.lastModifiedDate),
      configuration: new FormControl(propertyRawValue.configuration),
    });
  }

  getProperty(form: PropertyFormGroup): IProperty | NewProperty {
    return this.convertPropertyRawValueToProperty(form.getRawValue() as PropertyFormRawValue | NewPropertyFormRawValue);
  }

  resetForm(form: PropertyFormGroup, property: PropertyFormGroupInput): void {
    const propertyRawValue = this.convertPropertyToPropertyRawValue({ ...this.getFormDefaults(), ...property });
    form.reset(
      {
        ...propertyRawValue,
        id: { value: propertyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PropertyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertPropertyRawValueToProperty(rawProperty: PropertyFormRawValue | NewPropertyFormRawValue): IProperty | NewProperty {
    return {
      ...rawProperty,
      createdDate: dayjs(rawProperty.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawProperty.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertPropertyToPropertyRawValue(
    property: IProperty | (Partial<NewProperty> & PropertyFormDefaults),
  ): PropertyFormRawValue | PartialWithRequiredKeyOf<NewPropertyFormRawValue> {
    return {
      ...property,
      createdDate: property.createdDate ? property.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: property.lastModifiedDate ? property.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
