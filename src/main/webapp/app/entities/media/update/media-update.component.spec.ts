import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { MediaService } from '../service/media.service';
import { IMedia } from '../media.model';
import { MediaFormService } from './media-form.service';

import { MediaUpdateComponent } from './media-update.component';

describe('Media Management Update Component', () => {
  let comp: MediaUpdateComponent;
  let fixture: ComponentFixture<MediaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mediaFormService: MediaFormService;
  let mediaService: MediaService;
  let propertyService: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MediaUpdateComponent],
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
      .overrideTemplate(MediaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MediaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mediaFormService = TestBed.inject(MediaFormService);
    mediaService = TestBed.inject(MediaService);
    propertyService = TestBed.inject(PropertyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Property query and add missing value', () => {
      const media: IMedia = { id: 26043 };
      const property: IProperty = { id: 30394 };
      media.property = property;

      const propertyCollection: IProperty[] = [{ id: 30394 }];
      jest.spyOn(propertyService, 'query').mockReturnValue(of(new HttpResponse({ body: propertyCollection })));
      const additionalProperties = [property];
      const expectedCollection: IProperty[] = [...additionalProperties, ...propertyCollection];
      jest.spyOn(propertyService, 'addPropertyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ media });
      comp.ngOnInit();

      expect(propertyService.query).toHaveBeenCalled();
      expect(propertyService.addPropertyToCollectionIfMissing).toHaveBeenCalledWith(
        propertyCollection,
        ...additionalProperties.map(expect.objectContaining),
      );
      expect(comp.propertiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const media: IMedia = { id: 26043 };
      const property: IProperty = { id: 30394 };
      media.property = property;

      activatedRoute.data = of({ media });
      comp.ngOnInit();

      expect(comp.propertiesSharedCollection).toContainEqual(property);
      expect(comp.media).toEqual(media);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 179 };
      jest.spyOn(mediaFormService, 'getMedia').mockReturnValue(media);
      jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: media }));
      saveSubject.complete();

      // THEN
      expect(mediaFormService.getMedia).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mediaService.update).toHaveBeenCalledWith(expect.objectContaining(media));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 179 };
      jest.spyOn(mediaFormService, 'getMedia').mockReturnValue({ id: null });
      jest.spyOn(mediaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: media }));
      saveSubject.complete();

      // THEN
      expect(mediaFormService.getMedia).toHaveBeenCalled();
      expect(mediaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMedia>>();
      const media = { id: 179 };
      jest.spyOn(mediaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ media });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mediaService.update).toHaveBeenCalled();
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
