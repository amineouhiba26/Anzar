import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AgencyService } from '../service/agency.service';
import { IAgency } from '../agency.model';
import { AgencyFormService } from './agency-form.service';

import { AgencyUpdateComponent } from './agency-update.component';

describe('Agency Management Update Component', () => {
  let comp: AgencyUpdateComponent;
  let fixture: ComponentFixture<AgencyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agencyFormService: AgencyFormService;
  let agencyService: AgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AgencyUpdateComponent],
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
      .overrideTemplate(AgencyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgencyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agencyFormService = TestBed.inject(AgencyFormService);
    agencyService = TestBed.inject(AgencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const agency: IAgency = { id: 23199 };

      activatedRoute.data = of({ agency });
      comp.ngOnInit();

      expect(comp.agency).toEqual(agency);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgency>>();
      const agency = { id: 8238 };
      jest.spyOn(agencyFormService, 'getAgency').mockReturnValue(agency);
      jest.spyOn(agencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agency }));
      saveSubject.complete();

      // THEN
      expect(agencyFormService.getAgency).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(agencyService.update).toHaveBeenCalledWith(expect.objectContaining(agency));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgency>>();
      const agency = { id: 8238 };
      jest.spyOn(agencyFormService, 'getAgency').mockReturnValue({ id: null });
      jest.spyOn(agencyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agency: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agency }));
      saveSubject.complete();

      // THEN
      expect(agencyFormService.getAgency).toHaveBeenCalled();
      expect(agencyService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAgency>>();
      const agency = { id: 8238 };
      jest.spyOn(agencyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agency });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agencyService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
