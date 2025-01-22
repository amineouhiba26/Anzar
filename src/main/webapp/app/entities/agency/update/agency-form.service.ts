import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAgency, NewAgency } from '../agency.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAgency for edit and NewAgencyFormGroupInput for create.
 */
type AgencyFormGroupInput = IAgency | PartialWithRequiredKeyOf<NewAgency>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAgency | NewAgency> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AgencyFormRawValue = FormValueOf<IAgency>;

type NewAgencyFormRawValue = FormValueOf<NewAgency>;

type AgencyFormDefaults = Pick<NewAgency, 'id' | 'createdDate' | 'lastModifiedDate'>;

type AgencyFormGroupContent = {
  id: FormControl<AgencyFormRawValue['id'] | NewAgency['id']>;
  name: FormControl<AgencyFormRawValue['name']>;
  email: FormControl<AgencyFormRawValue['email']>;
  phoneNumber: FormControl<AgencyFormRawValue['phoneNumber']>;
  position: FormControl<AgencyFormRawValue['position']>;
  createdBy: FormControl<AgencyFormRawValue['createdBy']>;
  createdDate: FormControl<AgencyFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AgencyFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AgencyFormRawValue['lastModifiedDate']>;
};

export type AgencyFormGroup = FormGroup<AgencyFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AgencyFormService {
  createAgencyFormGroup(agency: AgencyFormGroupInput = { id: null }): AgencyFormGroup {
    const agencyRawValue = this.convertAgencyToAgencyRawValue({
      ...this.getFormDefaults(),
      ...agency,
    });
    return new FormGroup<AgencyFormGroupContent>({
      id: new FormControl(
        { value: agencyRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(agencyRawValue.name),
      email: new FormControl(agencyRawValue.email),
      phoneNumber: new FormControl(agencyRawValue.phoneNumber),
      position: new FormControl(agencyRawValue.position),
      createdBy: new FormControl(agencyRawValue.createdBy),
      createdDate: new FormControl(agencyRawValue.createdDate),
      lastModifiedBy: new FormControl(agencyRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(agencyRawValue.lastModifiedDate),
    });
  }

  getAgency(form: AgencyFormGroup): IAgency | NewAgency {
    return this.convertAgencyRawValueToAgency(form.getRawValue() as AgencyFormRawValue | NewAgencyFormRawValue);
  }

  resetForm(form: AgencyFormGroup, agency: AgencyFormGroupInput): void {
    const agencyRawValue = this.convertAgencyToAgencyRawValue({ ...this.getFormDefaults(), ...agency });
    form.reset(
      {
        ...agencyRawValue,
        id: { value: agencyRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AgencyFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAgencyRawValueToAgency(rawAgency: AgencyFormRawValue | NewAgencyFormRawValue): IAgency | NewAgency {
    return {
      ...rawAgency,
      createdDate: dayjs(rawAgency.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAgency.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAgencyToAgencyRawValue(
    agency: IAgency | (Partial<NewAgency> & AgencyFormDefaults),
  ): AgencyFormRawValue | PartialWithRequiredKeyOf<NewAgencyFormRawValue> {
    return {
      ...agency,
      createdDate: agency.createdDate ? agency.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: agency.lastModifiedDate ? agency.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
