import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';
import { CustomUserService } from 'app/entities/custom-user/service/custom-user.service';
import { BookingService } from '../service/booking.service';
import { IBooking } from '../booking.model';
import { BookingFormGroup, BookingFormService } from './booking-form.service';

@Component({
  selector: 'jhi-booking-update',
  templateUrl: './booking-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookingUpdateComponent implements OnInit {
  isSaving = false;
  booking: IBooking | null = null;

  propertiesSharedCollection: IProperty[] = [];
  customUsersSharedCollection: ICustomUser[] = [];

  protected bookingService = inject(BookingService);
  protected bookingFormService = inject(BookingFormService);
  protected propertyService = inject(PropertyService);
  protected customUserService = inject(CustomUserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookingFormGroup = this.bookingFormService.createBookingFormGroup();

  compareProperty = (o1: IProperty | null, o2: IProperty | null): boolean => this.propertyService.compareProperty(o1, o2);

  compareCustomUser = (o1: ICustomUser | null, o2: ICustomUser | null): boolean => this.customUserService.compareCustomUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ booking }) => {
      this.booking = booking;
      if (booking) {
        this.updateForm(booking);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const booking = this.bookingFormService.getBooking(this.editForm);
    if (booking.id !== null) {
      this.subscribeToSaveResponse(this.bookingService.update(booking));
    } else {
      this.subscribeToSaveResponse(this.bookingService.create(booking));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBooking>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(booking: IBooking): void {
    this.booking = booking;
    this.bookingFormService.resetForm(this.editForm, booking);

    this.propertiesSharedCollection = this.propertyService.addPropertyToCollectionIfMissing<IProperty>(
      this.propertiesSharedCollection,
      booking.property,
    );
    this.customUsersSharedCollection = this.customUserService.addCustomUserToCollectionIfMissing<ICustomUser>(
      this.customUsersSharedCollection,
      booking.user,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.propertyService
      .query()
      .pipe(map((res: HttpResponse<IProperty[]>) => res.body ?? []))
      .pipe(
        map((properties: IProperty[]) =>
          this.propertyService.addPropertyToCollectionIfMissing<IProperty>(properties, this.booking?.property),
        ),
      )
      .subscribe((properties: IProperty[]) => (this.propertiesSharedCollection = properties));

    this.customUserService
      .query()
      .pipe(map((res: HttpResponse<ICustomUser[]>) => res.body ?? []))
      .pipe(
        map((customUsers: ICustomUser[]) =>
          this.customUserService.addCustomUserToCollectionIfMissing<ICustomUser>(customUsers, this.booking?.user),
        ),
      )
      .subscribe((customUsers: ICustomUser[]) => (this.customUsersSharedCollection = customUsers));
  }
}
