import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../attribute.test-samples';

import { AttributeFormService } from './attribute-form.service';

describe('Attribute Form Service', () => {
  let service: AttributeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeFormService);
  });

  describe('Service methods', () => {
    describe('createAttributeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAttributeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            attributeGroup: expect.any(Object),
          }),
        );
      });

      it('passing IAttribute should create a new form with FormGroup', () => {
        const formGroup = service.createAttributeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            type: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            attributeGroup: expect.any(Object),
          }),
        );
      });
    });

    describe('getAttribute', () => {
      it('should return NewAttribute for default Attribute initial value', () => {
        const formGroup = service.createAttributeFormGroup(sampleWithNewData);

        const attribute = service.getAttribute(formGroup) as any;

        expect(attribute).toMatchObject(sampleWithNewData);
      });

      it('should return NewAttribute for empty Attribute initial value', () => {
        const formGroup = service.createAttributeFormGroup();

        const attribute = service.getAttribute(formGroup) as any;

        expect(attribute).toMatchObject({});
      });

      it('should return IAttribute', () => {
        const formGroup = service.createAttributeFormGroup(sampleWithRequiredData);

        const attribute = service.getAttribute(formGroup) as any;

        expect(attribute).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAttribute should not enable id FormControl', () => {
        const formGroup = service.createAttributeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAttribute should disable id FormControl', () => {
        const formGroup = service.createAttributeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
