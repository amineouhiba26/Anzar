import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IRole } from 'app/entities/role/role.model';
import { RoleService } from 'app/entities/role/service/role.service';
import { IAgency } from 'app/entities/agency/agency.model';
import { AgencyService } from 'app/entities/agency/service/agency.service';
import { CustomUserService } from '../service/custom-user.service';
import { ICustomUser } from '../custom-user.model';
import { CustomUserFormGroup, CustomUserFormService } from './custom-user-form.service';

@Component({
  selector: 'jhi-custom-user-update',
  templateUrl: './custom-user-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CustomUserUpdateComponent implements OnInit {
  isSaving = false;
  customUser: ICustomUser | null = null;

  rolesSharedCollection: IRole[] = [];
  agenciesSharedCollection: IAgency[] = [];

  protected customUserService = inject(CustomUserService);
  protected customUserFormService = inject(CustomUserFormService);
  protected roleService = inject(RoleService);
  protected agencyService = inject(AgencyService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CustomUserFormGroup = this.customUserFormService.createCustomUserFormGroup();

  compareRole = (o1: IRole | null, o2: IRole | null): boolean => this.roleService.compareRole(o1, o2);

  compareAgency = (o1: IAgency | null, o2: IAgency | null): boolean => this.agencyService.compareAgency(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customUser }) => {
      this.customUser = customUser;
      if (customUser) {
        this.updateForm(customUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customUser = this.customUserFormService.getCustomUser(this.editForm);
    if (customUser.id !== null) {
      this.subscribeToSaveResponse(this.customUserService.update(customUser));
    } else {
      this.subscribeToSaveResponse(this.customUserService.create(customUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomUser>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customUser: ICustomUser): void {
    this.customUser = customUser;
    this.customUserFormService.resetForm(this.editForm, customUser);

    this.rolesSharedCollection = this.roleService.addRoleToCollectionIfMissing<IRole>(this.rolesSharedCollection, customUser.role);
    this.agenciesSharedCollection = this.agencyService.addAgencyToCollectionIfMissing<IAgency>(
      this.agenciesSharedCollection,
      customUser.agency,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.roleService
      .query()
      .pipe(map((res: HttpResponse<IRole[]>) => res.body ?? []))
      .pipe(map((roles: IRole[]) => this.roleService.addRoleToCollectionIfMissing<IRole>(roles, this.customUser?.role)))
      .subscribe((roles: IRole[]) => (this.rolesSharedCollection = roles));

    this.agencyService
      .query()
      .pipe(map((res: HttpResponse<IAgency[]>) => res.body ?? []))
      .pipe(map((agencies: IAgency[]) => this.agencyService.addAgencyToCollectionIfMissing<IAgency>(agencies, this.customUser?.agency)))
      .subscribe((agencies: IAgency[]) => (this.agenciesSharedCollection = agencies));
  }
}
