import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { AttributeValueService } from '../service/attribute-value.service';
import { IAttributeValue } from '../attribute-value.model';
import { AttributeValueFormService } from './attribute-value-form.service';

import { AttributeValueUpdateComponent } from './attribute-value-update.component';

describe('AttributeValue Management Update Component', () => {
  let comp: AttributeValueUpdateComponent;
  let fixture: ComponentFixture<AttributeValueUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attributeValueFormService: AttributeValueFormService;
  let attributeValueService: AttributeValueService;
  let propertyService: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttributeValueUpdateComponent],
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
      .overrideTemplate(AttributeValueUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttributeValueUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attributeValueFormService = TestBed.inject(AttributeValueFormService);
    attributeValueService = TestBed.inject(AttributeValueService);
    propertyService = TestBed.inject(PropertyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Property query and add missing value', () => {
      const attributeValue: IAttributeValue = { id: 2753 };
      const property: IProperty = { id: 30394 };
      attributeValue.property = property;

      const propertyCollection: IProperty[] = [{ id: 30394 }];
      jest.spyOn(propertyService, 'query').mockReturnValue(of(new HttpResponse({ body: propertyCollection })));
      const additionalProperties = [property];
      const expectedCollection: IProperty[] = [...additionalProperties, ...propertyCollection];
      jest.spyOn(propertyService, 'addPropertyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attributeValue });
      comp.ngOnInit();

      expect(propertyService.query).toHaveBeenCalled();
      expect(propertyService.addPropertyToCollectionIfMissing).toHaveBeenCalledWith(
        propertyCollection,
        ...additionalProperties.map(expect.objectContaining),
      );
      expect(comp.propertiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attributeValue: IAttributeValue = { id: 2753 };
      const property: IProperty = { id: 30394 };
      attributeValue.property = property;

      activatedRoute.data = of({ attributeValue });
      comp.ngOnInit();

      expect(comp.propertiesSharedCollection).toContainEqual(property);
      expect(comp.attributeValue).toEqual(attributeValue);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeValue>>();
      const attributeValue = { id: 32470 };
      jest.spyOn(attributeValueFormService, 'getAttributeValue').mockReturnValue(attributeValue);
      jest.spyOn(attributeValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attributeValue }));
      saveSubject.complete();

      // THEN
      expect(attributeValueFormService.getAttributeValue).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attributeValueService.update).toHaveBeenCalledWith(expect.objectContaining(attributeValue));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeValue>>();
      const attributeValue = { id: 32470 };
      jest.spyOn(attributeValueFormService, 'getAttributeValue').mockReturnValue({ id: null });
      jest.spyOn(attributeValueService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeValue: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attributeValue }));
      saveSubject.complete();

      // THEN
      expect(attributeValueFormService.getAttributeValue).toHaveBeenCalled();
      expect(attributeValueService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeValue>>();
      const attributeValue = { id: 32470 };
      jest.spyOn(attributeValueService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeValue });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attributeValueService.update).toHaveBeenCalled();
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
  });
});
