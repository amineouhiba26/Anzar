import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IAgency } from 'app/entities/agency/agency.model';
import { AgencyService } from 'app/entities/agency/service/agency.service';
import { ICustomUser } from '../custom-user.model';
import { CustomUserService } from '../service/custom-user.service';
import { CustomUserFormService } from './custom-user-form.service';

import { CustomUserUpdateComponent } from './custom-user-update.component';

describe('CustomUser Management Update Component', () => {
  let comp: CustomUserUpdateComponent;
  let fixture: ComponentFixture<CustomUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customUserFormService: CustomUserFormService;
  let customUserService: CustomUserService;
  let roleService: RoleService;
  let agencyService: AgencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomUserUpdateComponent],
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
      .overrideTemplate(CustomUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customUserFormService = TestBed.inject(CustomUserFormService);
    customUserService = TestBed.inject(CustomUserService);
    roleService = TestBed.inject(RoleService);
    agencyService = TestBed.inject(AgencyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Role query and add missing value', () => {
      const customUser: ICustomUser = { id: 17439 };
      const role: IRole = { id: 12873 };
      customUser.role = role;

      const roleCollection: IRole[] = [{ id: 12873 }];
      jest.spyOn(roleService, 'query').mockReturnValue(of(new HttpResponse({ body: roleCollection })));
      const additionalRoles = [role];
      const expectedCollection: IRole[] = [...additionalRoles, ...roleCollection];
      jest.spyOn(roleService, 'addRoleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      expect(roleService.query).toHaveBeenCalled();
      expect(roleService.addRoleToCollectionIfMissing).toHaveBeenCalledWith(
        roleCollection,
        ...additionalRoles.map(expect.objectContaining),
      );
      expect(comp.rolesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Agency query and add missing value', () => {
      const customUser: ICustomUser = { id: 17439 };
      const agency: IAgency = { id: 8238 };
      customUser.agency = agency;

      const agencyCollection: IAgency[] = [{ id: 8238 }];
      jest.spyOn(agencyService, 'query').mockReturnValue(of(new HttpResponse({ body: agencyCollection })));
      const additionalAgencies = [agency];
      const expectedCollection: IAgency[] = [...additionalAgencies, ...agencyCollection];
      jest.spyOn(agencyService, 'addAgencyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      expect(agencyService.query).toHaveBeenCalled();
      expect(agencyService.addAgencyToCollectionIfMissing).toHaveBeenCalledWith(
        agencyCollection,
        ...additionalAgencies.map(expect.objectContaining),
      );
      expect(comp.agenciesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customUser: ICustomUser = { id: 17439 };
      const role: IRole = { id: 12873 };
      customUser.role = role;
      const agency: IAgency = { id: 8238 };
      customUser.agency = agency;

      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      expect(comp.rolesSharedCollection).toContainEqual(role);
      expect(comp.agenciesSharedCollection).toContainEqual(agency);
      expect(comp.customUser).toEqual(customUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 11466 };
      jest.spyOn(customUserFormService, 'getCustomUser').mockReturnValue(customUser);
      jest.spyOn(customUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customUser }));
      saveSubject.complete();

      // THEN
      expect(customUserFormService.getCustomUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customUserService.update).toHaveBeenCalledWith(expect.objectContaining(customUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 11466 };
      jest.spyOn(customUserFormService, 'getCustomUser').mockReturnValue({ id: null });
      jest.spyOn(customUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customUser }));
      saveSubject.complete();

      // THEN
      expect(customUserFormService.getCustomUser).toHaveBeenCalled();
      expect(customUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomUser>>();
      const customUser = { id: 11466 };
      jest.spyOn(customUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareRole', () => {
      it('Should forward to roleService', () => {
        const entity = { id: 12873 };
        const entity2 = { id: 333 };
        jest.spyOn(roleService, 'compareRole');
        comp.compareRole(entity, entity2);
        expect(roleService.compareRole).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
