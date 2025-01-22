import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../attribute-group.test-samples';

import { AttributeGroupFormService } from './attribute-group-form.service';

describe('AttributeGroup Form Service', () => {
  let service: AttributeGroupFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeGroupFormService);
  });

  describe('Service methods', () => {
    describe('createAttributeGroupFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAttributeGroupFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            customConfiguration: expect.any(Object),
          }),
        );
      });

      it('passing IAttributeGroup should create a new form with FormGroup', () => {
        const formGroup = service.createAttributeGroupFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            customConfiguration: expect.any(Object),
          }),
        );
      });
    });

    describe('getAttributeGroup', () => {
      it('should return NewAttributeGroup for default AttributeGroup initial value', () => {
        const formGroup = service.createAttributeGroupFormGroup(sampleWithNewData);

        const attributeGroup = service.getAttributeGroup(formGroup) as any;

        expect(attributeGroup).toMatchObject(sampleWithNewData);
      });

      it('should return NewAttributeGroup for empty AttributeGroup initial value', () => {
        const formGroup = service.createAttributeGroupFormGroup();

        const attributeGroup = service.getAttributeGroup(formGroup) as any;

        expect(attributeGroup).toMatchObject({});
      });

      it('should return IAttributeGroup', () => {
        const formGroup = service.createAttributeGroupFormGroup(sampleWithRequiredData);

        const attributeGroup = service.getAttributeGroup(formGroup) as any;

        expect(attributeGroup).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAttributeGroup should not enable id FormControl', () => {
        const formGroup = service.createAttributeGroupFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAttributeGroup should disable id FormControl', () => {
        const formGroup = service.createAttributeGroupFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
