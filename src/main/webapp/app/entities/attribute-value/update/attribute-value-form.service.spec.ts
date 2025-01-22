import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../attribute-value.test-samples';

import { AttributeValueFormService } from './attribute-value-form.service';

describe('AttributeValue Form Service', () => {
  let service: AttributeValueFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeValueFormService);
  });

  describe('Service methods', () => {
    describe('createAttributeValueFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAttributeValueFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valueString: expect.any(Object),
            valueBigDecimal: expect.any(Object),
            valueBoolean: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            property: expect.any(Object),
          }),
        );
      });

      it('passing IAttributeValue should create a new form with FormGroup', () => {
        const formGroup = service.createAttributeValueFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            valueString: expect.any(Object),
            valueBigDecimal: expect.any(Object),
            valueBoolean: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            property: expect.any(Object),
          }),
        );
      });
    });

    describe('getAttributeValue', () => {
      it('should return NewAttributeValue for default AttributeValue initial value', () => {
        const formGroup = service.createAttributeValueFormGroup(sampleWithNewData);

        const attributeValue = service.getAttributeValue(formGroup) as any;

        expect(attributeValue).toMatchObject(sampleWithNewData);
      });

      it('should return NewAttributeValue for empty AttributeValue initial value', () => {
        const formGroup = service.createAttributeValueFormGroup();

        const attributeValue = service.getAttributeValue(formGroup) as any;

        expect(attributeValue).toMatchObject({});
      });

      it('should return IAttributeValue', () => {
        const formGroup = service.createAttributeValueFormGroup(sampleWithRequiredData);

        const attributeValue = service.getAttributeValue(formGroup) as any;

        expect(attributeValue).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAttributeValue should not enable id FormControl', () => {
        const formGroup = service.createAttributeValueFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAttributeValue should disable id FormControl', () => {
        const formGroup = service.createAttributeValueFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
