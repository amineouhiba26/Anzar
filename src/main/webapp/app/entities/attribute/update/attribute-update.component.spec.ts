import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAttributeGroup } from 'app/entities/attribute-group/attribute-group.model';
import { AttributeGroupService } from 'app/entities/attribute-group/service/attribute-group.service';
import { AttributeService } from '../service/attribute.service';
import { IAttribute } from '../attribute.model';
import { AttributeFormService } from './attribute-form.service';

import { AttributeUpdateComponent } from './attribute-update.component';

describe('Attribute Management Update Component', () => {
  let comp: AttributeUpdateComponent;
  let fixture: ComponentFixture<AttributeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attributeFormService: AttributeFormService;
  let attributeService: AttributeService;
  let attributeGroupService: AttributeGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AttributeUpdateComponent],
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
      .overrideTemplate(AttributeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttributeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attributeFormService = TestBed.inject(AttributeFormService);
    attributeService = TestBed.inject(AttributeService);
    attributeGroupService = TestBed.inject(AttributeGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AttributeGroup query and add missing value', () => {
      const attribute: IAttribute = { id: 13715 };
      const attributeGroup: IAttributeGroup = { id: 17745 };
      attribute.attributeGroup = attributeGroup;

      const attributeGroupCollection: IAttributeGroup[] = [{ id: 17745 }];
      jest.spyOn(attributeGroupService, 'query').mockReturnValue(of(new HttpResponse({ body: attributeGroupCollection })));
      const additionalAttributeGroups = [attributeGroup];
      const expectedCollection: IAttributeGroup[] = [...additionalAttributeGroups, ...attributeGroupCollection];
      jest.spyOn(attributeGroupService, 'addAttributeGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      expect(attributeGroupService.query).toHaveBeenCalled();
      expect(attributeGroupService.addAttributeGroupToCollectionIfMissing).toHaveBeenCalledWith(
        attributeGroupCollection,
        ...additionalAttributeGroups.map(expect.objectContaining),
      );
      expect(comp.attributeGroupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attribute: IAttribute = { id: 13715 };
      const attributeGroup: IAttributeGroup = { id: 17745 };
      attribute.attributeGroup = attributeGroup;

      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      expect(comp.attributeGroupsSharedCollection).toContainEqual(attributeGroup);
      expect(comp.attribute).toEqual(attribute);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttribute>>();
      const attribute = { id: 20409 };
      jest.spyOn(attributeFormService, 'getAttribute').mockReturnValue(attribute);
      jest.spyOn(attributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attribute }));
      saveSubject.complete();

      // THEN
      expect(attributeFormService.getAttribute).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attributeService.update).toHaveBeenCalledWith(expect.objectContaining(attribute));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttribute>>();
      const attribute = { id: 20409 };
      jest.spyOn(attributeFormService, 'getAttribute').mockReturnValue({ id: null });
      jest.spyOn(attributeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attribute }));
      saveSubject.complete();

      // THEN
      expect(attributeFormService.getAttribute).toHaveBeenCalled();
      expect(attributeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttribute>>();
      const attribute = { id: 20409 };
      jest.spyOn(attributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attributeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAttributeGroup', () => {
      it('Should forward to attributeGroupService', () => {
        const entity = { id: 17745 };
        const entity2 = { id: 7653 };
        jest.spyOn(attributeGroupService, 'compareAttributeGroup');
        comp.compareAttributeGroup(entity, entity2);
        expect(attributeGroupService.compareAttributeGroup).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
