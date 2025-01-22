import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IAgency } from 'app/entities/agency/agency.model';
import { AgencyService } from 'app/entities/agency/service/agency.service';
import { AdminService } from '../service/admin.service';
import { IAdmin } from '../admin.model';
import { AdminFormService } from './admin-form.service';

import { AdminUpdateComponent } from './admin-update.component';

describe('Admin Management Update Component', () => {
  let comp: AdminUpdateComponent;
  let fixture: ComponentFixture<AdminUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let adminFormService: AdminFormService;
  let adminService: AdminService;
  let agencyService: AgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminUpdateComponent],
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
      .overrideTemplate(AdminUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    adminFormService = TestBed.inject(AdminFormService);
    adminService = TestBed.inject(AdminService);
    agencyService = TestBed.inject(AgencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call agency query and add missing value', () => {
      const admin: IAdmin = { id: 11145 };
      const agency: IAgency = { id: 8238 };
      admin.agency = agency;

      const agencyCollection: IAgency[] = [{ id: 8238 }];
      jest.spyOn(agencyService, 'query').mockReturnValue(of(new HttpResponse({ body: agencyCollection })));
      const expectedCollection: IAgency[] = [agency, ...agencyCollection];
      jest.spyOn(agencyService, 'addAgencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ admin });
      comp.ngOnInit();

      expect(agencyService.query).toHaveBeenCalled();
      expect(agencyService.addAgencyToCollectionIfMissing).toHaveBeenCalledWith(agencyCollection, agency);
      expect(comp.agenciesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const admin: IAdmin = { id: 11145 };
      const agency: IAgency = { id: 8238 };
      admin.agency = agency;

      activatedRoute.data = of({ admin });
      comp.ngOnInit();

      expect(comp.agenciesCollection).toContainEqual(agency);
      expect(comp.admin).toEqual(admin);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdmin>>();
      const admin = { id: 19424 };
      jest.spyOn(adminFormService, 'getAdmin').mockReturnValue(admin);
      jest.spyOn(adminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: admin }));
      saveSubject.complete();

      // THEN
      expect(adminFormService.getAdmin).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(adminService.update).toHaveBeenCalledWith(expect.objectContaining(admin));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdmin>>();
      const admin = { id: 19424 };
      jest.spyOn(adminFormService, 'getAdmin').mockReturnValue({ id: null });
      jest.spyOn(adminService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admin: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: admin }));
      saveSubject.complete();

      // THEN
      expect(adminFormService.getAdmin).toHaveBeenCalled();
      expect(adminService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAdmin>>();
      const admin = { id: 19424 };
      jest.spyOn(adminService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ admin });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(adminService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAgency', () => {
      it('Should forward to agencyService', () => {
        const entity = { id: 8238 };
        const entity2 = { id: 23199 };
        jest.spyOn(agencyService, 'compareAgency');
        comp.compareAgency(entity, entity2);
        expect(agencyService.compareAgency).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
