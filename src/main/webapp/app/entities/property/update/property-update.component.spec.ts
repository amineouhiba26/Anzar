import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';
import { CustomConfigurationService } from 'app/entities/custom-configuration/service/custom-configuration.service';
import { PropertyService } from '../service/property.service';
import { IProperty } from '../property.model';
import { PropertyFormService } from './property-form.service';

import { PropertyUpdateComponent } from './property-update.component';

describe('Property Management Update Component', () => {
  let comp: PropertyUpdateComponent;
  let fixture: ComponentFixture<PropertyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let propertyFormService: PropertyFormService;
  let propertyService: PropertyService;
  let customConfigurationService: CustomConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PropertyUpdateComponent],
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
      .overrideTemplate(PropertyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PropertyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    propertyFormService = TestBed.inject(PropertyFormService);
    propertyService = TestBed.inject(PropertyService);
    customConfigurationService = TestBed.inject(CustomConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CustomConfiguration query and add missing value', () => {
      const property: IProperty = { id: 19222 };
      const configuration: ICustomConfiguration = { id: 23696 };
      property.configuration = configuration;

      const customConfigurationCollection: ICustomConfiguration[] = [{ id: 23696 }];
      jest.spyOn(customConfigurationService, 'query').mockReturnValue(of(new HttpResponse({ body: customConfigurationCollection })));
      const additionalCustomConfigurations = [configuration];
      const expectedCollection: ICustomConfiguration[] = [...additionalCustomConfigurations, ...customConfigurationCollection];
      jest.spyOn(customConfigurationService, 'addCustomConfigurationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ property });
      comp.ngOnInit();

      expect(customConfigurationService.query).toHaveBeenCalled();
      expect(customConfigurationService.addCustomConfigurationToCollectionIfMissing).toHaveBeenCalledWith(
        customConfigurationCollection,
        ...additionalCustomConfigurations.map(expect.objectContaining),
      );
      expect(comp.customConfigurationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const property: IProperty = { id: 19222 };
      const configuration: ICustomConfiguration = { id: 23696 };
      property.configuration = configuration;

      activatedRoute.data = of({ property });
      comp.ngOnInit();

      expect(comp.customConfigurationsSharedCollection).toContainEqual(configuration);
      expect(comp.property).toEqual(property);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProperty>>();
      const property = { id: 30394 };
      jest.spyOn(propertyFormService, 'getProperty').mockReturnValue(property);
      jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: property }));
      saveSubject.complete();

      // THEN
      expect(propertyFormService.getProperty).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(propertyService.update).toHaveBeenCalledWith(expect.objectContaining(property));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProperty>>();
      const property = { id: 30394 };
      jest.spyOn(propertyFormService, 'getProperty').mockReturnValue({ id: null });
      jest.spyOn(propertyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: property }));
      saveSubject.complete();

      // THEN
      expect(propertyFormService.getProperty).toHaveBeenCalled();
      expect(propertyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProperty>>();
      const property = { id: 30394 };
      jest.spyOn(propertyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ property });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(propertyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCustomConfiguration', () => {
      it('Should forward to customConfigurationService', () => {
        const entity = { id: 23696 };
        const entity2 = { id: 31396 };
        jest.spyOn(customConfigurationService, 'compareCustomConfiguration');
        comp.compareCustomConfiguration(entity, entity2);
        expect(customConfigurationService.compareCustomConfiguration).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
