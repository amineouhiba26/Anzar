import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { CustomConfigurationService } from '../service/custom-configuration.service';
import { ICustomConfiguration } from '../custom-configuration.model';
import { CustomConfigurationFormService } from './custom-configuration-form.service';

import { CustomConfigurationUpdateComponent } from './custom-configuration-update.component';

describe('CustomConfiguration Management Update Component', () => {
  let comp: CustomConfigurationUpdateComponent;
  let fixture: ComponentFixture<CustomConfigurationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customConfigurationFormService: CustomConfigurationFormService;
  let customConfigurationService: CustomConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomConfigurationUpdateComponent],
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
      .overrideTemplate(CustomConfigurationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomConfigurationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customConfigurationFormService = TestBed.inject(CustomConfigurationFormService);
    customConfigurationService = TestBed.inject(CustomConfigurationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const customConfiguration: ICustomConfiguration = { id: 31396 };

      activatedRoute.data = of({ customConfiguration });
      comp.ngOnInit();

      expect(comp.customConfiguration).toEqual(customConfiguration);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomConfiguration>>();
      const customConfiguration = { id: 23696 };
      jest.spyOn(customConfigurationFormService, 'getCustomConfiguration').mockReturnValue(customConfiguration);
      jest.spyOn(customConfigurationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customConfiguration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customConfiguration }));
      saveSubject.complete();

      // THEN
      expect(customConfigurationFormService.getCustomConfiguration).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customConfigurationService.update).toHaveBeenCalledWith(expect.objectContaining(customConfiguration));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomConfiguration>>();
      const customConfiguration = { id: 23696 };
      jest.spyOn(customConfigurationFormService, 'getCustomConfiguration').mockReturnValue({ id: null });
      jest.spyOn(customConfigurationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customConfiguration: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customConfiguration }));
      saveSubject.complete();

      // THEN
      expect(customConfigurationFormService.getCustomConfiguration).toHaveBeenCalled();
      expect(customConfigurationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomConfiguration>>();
      const customConfiguration = { id: 23696 };
      jest.spyOn(customConfigurationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customConfiguration });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customConfigurationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
