import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAdmin, NewAdmin } from '../admin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAdmin for edit and NewAdminFormGroupInput for create.
 */
type AdminFormGroupInput = IAdmin | PartialWithRequiredKeyOf<NewAdmin>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAdmin | NewAdmin> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AdminFormRawValue = FormValueOf<IAdmin>;

type NewAdminFormRawValue = FormValueOf<NewAdmin>;

type AdminFormDefaults = Pick<NewAdmin, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AdminFormGroupContent = {
  id: FormControl<AdminFormRawValue['id'] | NewAdmin['id']>;
  username: FormControl<AdminFormRawValue['username']>;
  firstName: FormControl<AdminFormRawValue['firstName']>;
  lastName: FormControl<AdminFormRawValue['lastName']>;
  email: FormControl<AdminFormRawValue['email']>;
  phoneNumber: FormControl<AdminFormRawValue['phoneNumber']>;
  status: FormControl<AdminFormRawValue['status']>;
  accessLevel: FormControl<AdminFormRawValue['accessLevel']>;
  createdBy: FormControl<AdminFormRawValue['createdBy']>;
  createdDate: FormControl<AdminFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AdminFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AdminFormRawValue['lastModifiedDate']>;
  agency: FormControl<AdminFormRawValue['agency']>;
};

export type AdminFormGroup = FormGroup<AdminFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AdminFormService {
  createAdminFormGroup(admin: AdminFormGroupInput = { id: null }): AdminFormGroup {
    const adminRawValue = this.convertAdminToAdminRawValue({
      ...this.getFormDefaults(),
      ...admin,
    });
    return new FormGroup<AdminFormGroupContent>({
      id: new FormControl(
        { value: adminRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      username: new FormControl(adminRawValue.username),
      firstName: new FormControl(adminRawValue.firstName),
      lastName: new FormControl(adminRawValue.lastName),
      email: new FormControl(adminRawValue.email),
      phoneNumber: new FormControl(adminRawValue.phoneNumber),
      status: new FormControl(adminRawValue.status),
      accessLevel: new FormControl(adminRawValue.accessLevel),
      createdBy: new FormControl(adminRawValue.createdBy),
      createdDate: new FormControl(adminRawValue.createdDate),
      lastModifiedBy: new FormControl(adminRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(adminRawValue.lastModifiedDate),
      agency: new FormControl(adminRawValue.agency),
    });
  }

  getAdmin(form: AdminFormGroup): IAdmin | NewAdmin {
    return this.convertAdminRawValueToAdmin(form.getRawValue() as AdminFormRawValue | NewAdminFormRawValue);
  }

  resetForm(form: AdminFormGroup, admin: AdminFormGroupInput): void {
    const adminRawValue = this.convertAdminToAdminRawValue({ ...this.getFormDefaults(), ...admin });
    form.reset(
      {
        ...adminRawValue,
        id: { value: adminRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AdminFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAdminRawValueToAdmin(rawAdmin: AdminFormRawValue | NewAdminFormRawValue): IAdmin | NewAdmin {
    return {
      ...rawAdmin,
      createdDate: dayjs(rawAdmin.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAdmin.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAdminToAdminRawValue(
    admin: IAdmin | (Partial<NewAdmin> & AdminFormDefaults),
  ): AdminFormRawValue | PartialWithRequiredKeyOf<NewAdminFormRawValue> {
    return {
      ...admin,
      createdDate: admin.createdDate ? admin.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: admin.lastModifiedDate ? admin.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
