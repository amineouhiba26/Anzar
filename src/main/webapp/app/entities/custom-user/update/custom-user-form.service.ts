import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICustomUser, NewCustomUser } from '../custom-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomUser for edit and NewCustomUserFormGroupInput for create.
 */
type CustomUserFormGroupInput = ICustomUser | PartialWithRequiredKeyOf<NewCustomUser>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICustomUser | NewCustomUser> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type CustomUserFormRawValue = FormValueOf<ICustomUser>;

type NewCustomUserFormRawValue = FormValueOf<NewCustomUser>;

type CustomUserFormDefaults = Pick<NewCustomUser, 'id' | 'createdDate' | 'lastModifiedDate'>;

type CustomUserFormGroupContent = {
  id: FormControl<CustomUserFormRawValue['id'] | NewCustomUser['id']>;
  username: FormControl<CustomUserFormRawValue['username']>;
  firstName: FormControl<CustomUserFormRawValue['firstName']>;
  lastName: FormControl<CustomUserFormRawValue['lastName']>;
  email: FormControl<CustomUserFormRawValue['email']>;
  phoneNumber: FormControl<CustomUserFormRawValue['phoneNumber']>;
  status: FormControl<CustomUserFormRawValue['status']>;
  createdBy: FormControl<CustomUserFormRawValue['createdBy']>;
  createdDate: FormControl<CustomUserFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<CustomUserFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<CustomUserFormRawValue['lastModifiedDate']>;
  role: FormControl<CustomUserFormRawValue['role']>;
  agency: FormControl<CustomUserFormRawValue['agency']>;
};

export type CustomUserFormGroup = FormGroup<CustomUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomUserFormService {
  createCustomUserFormGroup(customUser: CustomUserFormGroupInput = { id: null }): CustomUserFormGroup {
    const customUserRawValue = this.convertCustomUserToCustomUserRawValue({
      ...this.getFormDefaults(),
      ...customUser,
    });
    return new FormGroup<CustomUserFormGroupContent>({
      id: new FormControl(
        { value: customUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      username: new FormControl(customUserRawValue.username),
      firstName: new FormControl(customUserRawValue.firstName),
      lastName: new FormControl(customUserRawValue.lastName),
      email: new FormControl(customUserRawValue.email),
      phoneNumber: new FormControl(customUserRawValue.phoneNumber),
      status: new FormControl(customUserRawValue.status),
      createdBy: new FormControl(customUserRawValue.createdBy),
      createdDate: new FormControl(customUserRawValue.createdDate),
      lastModifiedBy: new FormControl(customUserRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(customUserRawValue.lastModifiedDate),
      role: new FormControl(customUserRawValue.role),
      agency: new FormControl(customUserRawValue.agency),
    });
  }

  getCustomUser(form: CustomUserFormGroup): ICustomUser | NewCustomUser {
    return this.convertCustomUserRawValueToCustomUser(form.getRawValue() as CustomUserFormRawValue | NewCustomUserFormRawValue);
  }

  resetForm(form: CustomUserFormGroup, customUser: CustomUserFormGroupInput): void {
    const customUserRawValue = this.convertCustomUserToCustomUserRawValue({ ...this.getFormDefaults(), ...customUser });
    form.reset(
      {
        ...customUserRawValue,
        id: { value: customUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CustomUserFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertCustomUserRawValueToCustomUser(
    rawCustomUser: CustomUserFormRawValue | NewCustomUserFormRawValue,
  ): ICustomUser | NewCustomUser {
    return {
      ...rawCustomUser,
      createdDate: dayjs(rawCustomUser.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawCustomUser.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertCustomUserToCustomUserRawValue(
    customUser: ICustomUser | (Partial<NewCustomUser> & CustomUserFormDefaults),
  ): CustomUserFormRawValue | PartialWithRequiredKeyOf<NewCustomUserFormRawValue> {
    return {
      ...customUser,
      createdDate: customUser.createdDate ? customUser.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: customUser.lastModifiedDate ? customUser.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
