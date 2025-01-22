import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../custom-configuration.test-samples';

import { CustomConfigurationFormService } from './custom-configuration-form.service';

describe('CustomConfiguration Form Service', () => {
  let service: CustomConfigurationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomConfigurationFormService);
  });

  describe('Service methods', () => {
    describe('createCustomConfigurationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCustomConfigurationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing ICustomConfiguration should create a new form with FormGroup', () => {
        const formGroup = service.createCustomConfigurationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getCustomConfiguration', () => {
      it('should return NewCustomConfiguration for default CustomConfiguration initial value', () => {
        const formGroup = service.createCustomConfigurationFormGroup(sampleWithNewData);

        const customConfiguration = service.getCustomConfiguration(formGroup) as any;

        expect(customConfiguration).toMatchObject(sampleWithNewData);
      });

      it('should return NewCustomConfiguration for empty CustomConfiguration initial value', () => {
        const formGroup = service.createCustomConfigurationFormGroup();

        const customConfiguration = service.getCustomConfiguration(formGroup) as any;

        expect(customConfiguration).toMatchObject({});
      });

      it('should return ICustomConfiguration', () => {
        const formGroup = service.createCustomConfigurationFormGroup(sampleWithRequiredData);

        const customConfiguration = service.getCustomConfiguration(formGroup) as any;

        expect(customConfiguration).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICustomConfiguration should not enable id FormControl', () => {
        const formGroup = service.createCustomConfigurationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCustomConfiguration should disable id FormControl', () => {
        const formGroup = service.createCustomConfigurationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
