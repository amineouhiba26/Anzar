import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRole, NewRole } from '../role.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRole for edit and NewRoleFormGroupInput for create.
 */
type RoleFormGroupInput = IRole | PartialWithRequiredKeyOf<NewRole>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRole | NewRole> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type RoleFormRawValue = FormValueOf<IRole>;

type NewRoleFormRawValue = FormValueOf<NewRole>;

type RoleFormDefaults = Pick<NewRole, 'id' | 'createdDate' | 'lastModifiedDate'>;

type RoleFormGroupContent = {
  id: FormControl<RoleFormRawValue['id'] | NewRole['id']>;
  name: FormControl<RoleFormRawValue['name']>;
  description: FormControl<RoleFormRawValue['description']>;
  createdBy: FormControl<RoleFormRawValue['createdBy']>;
  createdDate: FormControl<RoleFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<RoleFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<RoleFormRawValue['lastModifiedDate']>;
};

export type RoleFormGroup = FormGroup<RoleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RoleFormService {
  createRoleFormGroup(role: RoleFormGroupInput = { id: null }): RoleFormGroup {
    const roleRawValue = this.convertRoleToRoleRawValue({
      ...this.getFormDefaults(),
      ...role,
    });
    return new FormGroup<RoleFormGroupContent>({
      id: new FormControl(
        { value: roleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(roleRawValue.name),
      description: new FormControl(roleRawValue.description),
      createdBy: new FormControl(roleRawValue.createdBy),
      createdDate: new FormControl(roleRawValue.createdDate),
      lastModifiedBy: new FormControl(roleRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(roleRawValue.lastModifiedDate),
    });
  }

  getRole(form: RoleFormGroup): IRole | NewRole {
    return this.convertRoleRawValueToRole(form.getRawValue() as RoleFormRawValue | NewRoleFormRawValue);
  }

  resetForm(form: RoleFormGroup, role: RoleFormGroupInput): void {
    const roleRawValue = this.convertRoleToRoleRawValue({ ...this.getFormDefaults(), ...role });
    form.reset(
      {
        ...roleRawValue,
        id: { value: roleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RoleFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertRoleRawValueToRole(rawRole: RoleFormRawValue | NewRoleFormRawValue): IRole | NewRole {
    return {
      ...rawRole,
      createdDate: dayjs(rawRole.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawRole.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertRoleToRoleRawValue(
    role: IRole | (Partial<NewRole> & RoleFormDefaults),
  ): RoleFormRawValue | PartialWithRequiredKeyOf<NewRoleFormRawValue> {
    return {
      ...role,
      createdDate: role.createdDate ? role.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: role.lastModifiedDate ? role.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
