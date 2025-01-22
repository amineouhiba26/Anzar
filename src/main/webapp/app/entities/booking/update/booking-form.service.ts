import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBooking, NewBooking } from '../booking.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBooking for edit and NewBookingFormGroupInput for create.
 */
type BookingFormGroupInput = IBooking | PartialWithRequiredKeyOf<NewBooking>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBooking | NewBooking> = Omit<T, 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'> & {
  startDate?: string | null;
  endDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type BookingFormRawValue = FormValueOf<IBooking>;

type NewBookingFormRawValue = FormValueOf<NewBooking>;

type BookingFormDefaults = Pick<NewBooking, 'id' | 'startDate' | 'endDate' | 'createdDate' | 'lastModifiedDate'>;

type BookingFormGroupContent = {
  id: FormControl<BookingFormRawValue['id'] | NewBooking['id']>;
  startDate: FormControl<BookingFormRawValue['startDate']>;
  endDate: FormControl<BookingFormRawValue['endDate']>;
  total: FormControl<BookingFormRawValue['total']>;
  status: FormControl<BookingFormRawValue['status']>;
  createdBy: FormControl<BookingFormRawValue['createdBy']>;
  createdDate: FormControl<BookingFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<BookingFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<BookingFormRawValue['lastModifiedDate']>;
  property: FormControl<BookingFormRawValue['property']>;
  user: FormControl<BookingFormRawValue['user']>;
};

export type BookingFormGroup = FormGroup<BookingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookingFormService {
  createBookingFormGroup(booking: BookingFormGroupInput = { id: null }): BookingFormGroup {
    const bookingRawValue = this.convertBookingToBookingRawValue({
      ...this.getFormDefaults(),
      ...booking,
    });
    return new FormGroup<BookingFormGroupContent>({
      id: new FormControl(
        { value: bookingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(bookingRawValue.startDate),
      endDate: new FormControl(bookingRawValue.endDate),
      total: new FormControl(bookingRawValue.total),
      status: new FormControl(bookingRawValue.status),
      createdBy: new FormControl(bookingRawValue.createdBy),
      createdDate: new FormControl(bookingRawValue.createdDate),
      lastModifiedBy: new FormControl(bookingRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(bookingRawValue.lastModifiedDate),
      property: new FormControl(bookingRawValue.property),
      user: new FormControl(bookingRawValue.user),
    });
  }

  getBooking(form: BookingFormGroup): IBooking | NewBooking {
    return this.convertBookingRawValueToBooking(form.getRawValue() as BookingFormRawValue | NewBookingFormRawValue);
  }

  resetForm(form: BookingFormGroup, booking: BookingFormGroupInput): void {
    const bookingRawValue = this.convertBookingToBookingRawValue({ ...this.getFormDefaults(), ...booking });
    form.reset(
      {
        ...bookingRawValue,
        id: { value: bookingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BookingFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertBookingRawValueToBooking(rawBooking: BookingFormRawValue | NewBookingFormRawValue): IBooking | NewBooking {
    return {
      ...rawBooking,
      startDate: dayjs(rawBooking.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawBooking.endDate, DATE_TIME_FORMAT),
      createdDate: dayjs(rawBooking.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawBooking.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertBookingToBookingRawValue(
    booking: IBooking | (Partial<NewBooking> & BookingFormDefaults),
  ): BookingFormRawValue | PartialWithRequiredKeyOf<NewBookingFormRawValue> {
    return {
      ...booking,
      startDate: booking.startDate ? booking.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: booking.endDate ? booking.endDate.format(DATE_TIME_FORMAT) : undefined,
      createdDate: booking.createdDate ? booking.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: booking.lastModifiedDate ? booking.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
