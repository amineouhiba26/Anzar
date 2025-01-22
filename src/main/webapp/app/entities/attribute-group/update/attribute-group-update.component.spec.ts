import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';
import { CustomConfigurationService } from 'app/entities/custom-configuration/service/custom-configuration.service';
import { AttributeGroupService } from '../service/attribute-group.service';
import { IAttributeGroup } from '../attribute-group.model';
import { AttributeGroupFormService } from './attribute-group-form.service';

import { AttributeGroupUpdateComponent } from './attribute-group-update.component';

describe('AttributeGroup Management Update Component', () => {
  let comp: AttributeGroupUpdateComponent;
  let fixture: ComponentFixture<AttributeGroupUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attributeGroupFormService: AttributeGroupFormService;
  let attributeGroupService: AttributeGroupService;
  let customConfigurationService: CustomConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttributeGroupUpdateComponent],
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
      .overrideTemplate(AttributeGroupUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttributeGroupUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attributeGroupFormService = TestBed.inject(AttributeGroupFormService);
    attributeGroupService = TestBed.inject(AttributeGroupService);
    customConfigurationService = TestBed.inject(CustomConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CustomConfiguration query and add missing value', () => {
      const attributeGroup: IAttributeGroup = { id: 7653 };
      const customConfiguration: ICustomConfiguration = { id: 23696 };
      attributeGroup.customConfiguration = customConfiguration;

      const customConfigurationCollection: ICustomConfiguration[] = [{ id: 23696 }];
      jest.spyOn(customConfigurationService, 'query').mockReturnValue(of(new HttpResponse({ body: customConfigurationCollection })));
      const additionalCustomConfigurations = [customConfiguration];
      const expectedCollection: ICustomConfiguration[] = [...additionalCustomConfigurations, ...customConfigurationCollection];
      jest.spyOn(customConfigurationService, 'addCustomConfigurationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attributeGroup });
      comp.ngOnInit();

      expect(customConfigurationService.query).toHaveBeenCalled();
      expect(customConfigurationService.addCustomConfigurationToCollectionIfMissing).toHaveBeenCalledWith(
        customConfigurationCollection,
        ...additionalCustomConfigurations.map(expect.objectContaining),
      );
      expect(comp.customConfigurationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attributeGroup: IAttributeGroup = { id: 7653 };
      const customConfiguration: ICustomConfiguration = { id: 23696 };
      attributeGroup.customConfiguration = customConfiguration;

      activatedRoute.data = of({ attributeGroup });
      comp.ngOnInit();

      expect(comp.customConfigurationsSharedCollection).toContainEqual(customConfiguration);
      expect(comp.attributeGroup).toEqual(attributeGroup);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeGroup>>();
      const attributeGroup = { id: 17745 };
      jest.spyOn(attributeGroupFormService, 'getAttributeGroup').mockReturnValue(attributeGroup);
      jest.spyOn(attributeGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attributeGroup }));
      saveSubject.complete();

      // THEN
      expect(attributeGroupFormService.getAttributeGroup).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attributeGroupService.update).toHaveBeenCalledWith(expect.objectContaining(attributeGroup));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeGroup>>();
      const attributeGroup = { id: 17745 };
      jest.spyOn(attributeGroupFormService, 'getAttributeGroup').mockReturnValue({ id: null });
      jest.spyOn(attributeGroupService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeGroup: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attributeGroup }));
      saveSubject.complete();

      // THEN
      expect(attributeGroupFormService.getAttributeGroup).toHaveBeenCalled();
      expect(attributeGroupService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttributeGroup>>();
      const attributeGroup = { id: 17745 };
      jest.spyOn(attributeGroupService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attributeGroup });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attributeGroupService.update).toHaveBeenCalled();
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
