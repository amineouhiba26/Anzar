import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICustomConfiguration, NewCustomConfiguration } from '../custom-configuration.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomConfiguration for edit and NewCustomConfigurationFormGroupInput for create.
 */
type CustomConfigurationFormGroupInput = ICustomConfiguration | PartialWithRequiredKeyOf<NewCustomConfiguration>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICustomConfiguration | NewCustomConfiguration> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CustomConfigurationFormRawValue = FormValueOf<ICustomConfiguration>;

type NewCustomConfigurationFormRawValue = FormValueOf<NewCustomConfiguration>;

type CustomConfigurationFormDefaults = Pick<NewCustomConfiguration, 'id' | 'createdDate' | 'lastModifiedDate'>;

type CustomConfigurationFormGroupContent = {
  id: FormControl<CustomConfigurationFormRawValue['id'] | NewCustomConfiguration['id']>;
  name: FormControl<CustomConfigurationFormRawValue['name']>;
  description: FormControl<CustomConfigurationFormRawValue['description']>;
  createdBy: FormControl<CustomConfigurationFormRawValue['createdBy']>;
  createdDate: FormControl<CustomConfigurationFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CustomConfigurationFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CustomConfigurationFormRawValue['lastModifiedDate']>;
};

export type CustomConfigurationFormGroup = FormGroup<CustomConfigurationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomConfigurationFormService {
  createCustomConfigurationFormGroup(customConfiguration: CustomConfigurationFormGroupInput = { id: null }): CustomConfigurationFormGroup {
    const customConfigurationRawValue = this.convertCustomConfigurationToCustomConfigurationRawValue({
      ...this.getFormDefaults(),
      ...customConfiguration,
    });
    return new FormGroup<CustomConfigurationFormGroupContent>({
      id: new FormControl(
        { value: customConfigurationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(customConfigurationRawValue.name),
      description: new FormControl(customConfigurationRawValue.description),
      createdBy: new FormControl(customConfigurationRawValue.createdBy),
      createdDate: new FormControl(customConfigurationRawValue.createdDate),
      lastModifiedBy: new FormControl(customConfigurationRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(customConfigurationRawValue.lastModifiedDate),
    });
  }

  getCustomConfiguration(form: CustomConfigurationFormGroup): ICustomConfiguration | NewCustomConfiguration {
    return this.convertCustomConfigurationRawValueToCustomConfiguration(
      form.getRawValue() as CustomConfigurationFormRawValue | NewCustomConfigurationFormRawValue,
    );
  }

  resetForm(form: CustomConfigurationFormGroup, customConfiguration: CustomConfigurationFormGroupInput): void {
    const customConfigurationRawValue = this.convertCustomConfigurationToCustomConfigurationRawValue({
      ...this.getFormDefaults(),
      ...customConfiguration,
    });
    form.reset(
      {
        ...customConfigurationRawValue,
        id: { value: customConfigurationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CustomConfigurationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCustomConfigurationRawValueToCustomConfiguration(
    rawCustomConfiguration: CustomConfigurationFormRawValue | NewCustomConfigurationFormRawValue,
  ): ICustomConfiguration | NewCustomConfiguration {
    return {
      ...rawCustomConfiguration,
      createdDate: dayjs(rawCustomConfiguration.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCustomConfiguration.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCustomConfigurationToCustomConfigurationRawValue(
    customConfiguration: ICustomConfiguration | (Partial<NewCustomConfiguration> & CustomConfigurationFormDefaults),
  ): CustomConfigurationFormRawValue | PartialWithRequiredKeyOf<NewCustomConfigurationFormRawValue> {
    return {
      ...customConfiguration,
      createdDate: customConfiguration.createdDate ? customConfiguration.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: customConfiguration.lastModifiedDate ? customConfiguration.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
