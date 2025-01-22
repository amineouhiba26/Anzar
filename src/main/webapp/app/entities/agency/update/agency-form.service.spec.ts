import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../agency.test-samples';

import { AgencyFormService } from './agency-form.service';

describe('Agency Form Service', () => {
  let service: AgencyFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgencyFormService);
  });

  describe('Service methods', () => {
    describe('createAgencyFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAgencyFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            position: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IAgency should create a new form with FormGroup', () => {
        const formGroup = service.createAgencyFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            position: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getAgency', () => {
      it('should return NewAgency for default Agency initial value', () => {
        const formGroup = service.createAgencyFormGroup(sampleWithNewData);

        const agency = service.getAgency(formGroup) as any;

        expect(agency).toMatchObject(sampleWithNewData);
      });

      it('should return NewAgency for empty Agency initial value', () => {
        const formGroup = service.createAgencyFormGroup();

        const agency = service.getAgency(formGroup) as any;

        expect(agency).toMatchObject({});
      });

      it('should return IAgency', () => {
        const formGroup = service.createAgencyFormGroup(sampleWithRequiredData);

        const agency = service.getAgency(formGroup) as any;

        expect(agency).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAgency should not enable id FormControl', () => {
        const formGroup = service.createAgencyFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAgency should disable id FormControl', () => {
        const formGroup = service.createAgencyFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
