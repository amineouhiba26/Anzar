import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { ICustomUser } from 'app/entities/custom-user/custom-user.model';
import { CustomUserService } from 'app/entities/custom-user/service/custom-user.service';
import { IBooking } from '../booking.model';
import { BookingService } from '../service/booking.service';
import { BookingFormService } from './booking-form.service';

import { BookingUpdateComponent } from './booking-update.component';

describe('Booking Management Update Component', () => {
  let comp: BookingUpdateComponent;
  let fixture: ComponentFixture<BookingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookingFormService: BookingFormService;
  let bookingService: BookingService;
  let propertyService: PropertyService;
  let customUserService: CustomUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookingUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BookingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookingFormService = TestBed.inject(BookingFormService);
    bookingService = TestBed.inject(BookingService);
    propertyService = TestBed.inject(PropertyService);
    customUserService = TestBed.inject(CustomUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Property query and add missing value', () => {
      const booking: IBooking = { id: 4697 };
      const property: IProperty = { id: 30394 };
      booking.property = property;

      const propertyCollection: IProperty[] = [{ id: 30394 }];
      jest.spyOn(propertyService, 'query').mockReturnValue(of(new HttpResponse({ body: propertyCollection })));
      const additionalProperties = [property];
      const expectedCollection: IProperty[] = [...additionalProperties, ...propertyCollection];
      jest.spyOn(propertyService, 'addPropertyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ booking });
      comp.ngOnInit();

      expect(propertyService.query).toHaveBeenCalled();
      expect(propertyService.addPropertyToCollectionIfMissing).toHaveBeenCalledWith(
        propertyCollection,
        ...additionalProperties.map(expect.objectContaining),
      );
      expect(comp.propertiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CustomUser query and add missing value', () => {
      const booking: IBooking = { id: 4697 };
      const user: ICustomUser = { id: 11466 };
      booking.user = user;

      const customUserCollection: ICustomUser[] = [{ id: 11466 }];
      jest.spyOn(customUserService, 'query').mockReturnValue(of(new HttpResponse({ body: customUserCollection })));
      const additionalCustomUsers = [user];
      const expectedCollection: ICustomUser[] = [...additionalCustomUsers, ...customUserCollection];
      jest.spyOn(customUserService, 'addCustomUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ booking });
      comp.ngOnInit();

      expect(customUserService.query).toHaveBeenCalled();
      expect(customUserService.addCustomUserToCollectionIfMissing).toHaveBeenCalledWith(
        customUserCollection,
        ...additionalCustomUsers.map(expect.objectContaining),
      );
      expect(comp.customUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const booking: IBooking = { id: 4697 };
      const property: IProperty = { id: 30394 };
      booking.property = property;
      const user: ICustomUser = { id: 11466 };
      booking.user = user;

      activatedRoute.data = of({ booking });
      comp.ngOnInit();

      expect(comp.propertiesSharedCollection).toContainEqual(property);
      expect(comp.customUsersSharedCollection).toContainEqual(user);
      expect(comp.booking).toEqual(booking);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBooking>>();
      const booking = { id: 1408 };
      jest.spyOn(bookingFormService, 'getBooking').mockReturnValue(booking);
      jest.spyOn(bookingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ booking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: booking }));
      saveSubject.complete();

      // THEN
      expect(bookingFormService.getBooking).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookingService.update).toHaveBeenCalledWith(expect.objectContaining(booking));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBooking>>();
      const booking = { id: 1408 };
      jest.spyOn(bookingFormService, 'getBooking').mockReturnValue({ id: null });
      jest.spyOn(bookingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ booking: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: booking }));
      saveSubject.complete();

      // THEN
      expect(bookingFormService.getBooking).toHaveBeenCalled();
      expect(bookingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBooking>>();
      const booking = { id: 1408 };
      jest.spyOn(bookingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ booking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookingService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProperty', () => {
      it('Should forward to propertyService', () => {
        const entity = { id: 30394 };
        const entity2 = { id: 19222 };
        jest.spyOn(propertyService, 'compareProperty');
        comp.compareProperty(entity, entity2);
        expect(propertyService.compareProperty).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCustomUser', () => {
      it('Should forward to customUserService', () => {
        const entity = { id: 11466 };
        const entity2 = { id: 17439 };
        jest.spyOn(customUserService, 'compareCustomUser');
        comp.compareCustomUser(entity, entity2);
        expect(customUserService.compareCustomUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
