import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../property.test-samples';

import { PropertyFormService } from './property-form.service';

describe('Property Form Service', () => {
  let service: PropertyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyFormService);
  });

  describe('Service methods', () => {
    describe('createPropertyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPropertyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            price: expect.any(Object),
            location: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            configuration: expect.any(Object),
          }),
        );
      });

      it('passing IProperty should create a new form with FormGroup', () => {
        const formGroup = service.createPropertyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            price: expect.any(Object),
            location: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            configuration: expect.any(Object),
          }),
        );
      });
    });

    describe('getProperty', () => {
      it('should return NewProperty for default Property initial value', () => {
        const formGroup = service.createPropertyFormGroup(sampleWithNewData);

        const property = service.getProperty(formGroup) as any;

        expect(property).toMatchObject(sampleWithNewData);
      });

      it('should return NewProperty for empty Property initial value', () => {
        const formGroup = service.createPropertyFormGroup();

        const property = service.getProperty(formGroup) as any;

        expect(property).toMatchObject({});
      });

      it('should return IProperty', () => {
        const formGroup = service.createPropertyFormGroup(sampleWithRequiredData);

        const property = service.getProperty(formGroup) as any;

        expect(property).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProperty should not enable id FormControl', () => {
        const formGroup = service.createPropertyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProperty should disable id FormControl', () => {
        const formGroup = service.createPropertyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
