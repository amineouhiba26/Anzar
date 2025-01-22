import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAgency } from '../agency.model';
import { AgencyService } from '../service/agency.service';
import { AgencyFormGroup, AgencyFormService } from './agency-form.service';

@Component({
  selector: 'jhi-agency-update',
  templateUrl: './agency-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AgencyUpdateComponent implements OnInit {
  isSaving = false;
  agency: IAgency | null = null;

  protected agencyService = inject(AgencyService);
  protected agencyFormService = inject(AgencyFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AgencyFormGroup = this.agencyFormService.createAgencyFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agency }) => {
      this.agency = agency;
      if (agency) {
        this.updateForm(agency);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agency = this.agencyFormService.getAgency(this.editForm);
    if (agency.id !== null) {
      this.subscribeToSaveResponse(this.agencyService.update(agency));
    } else {
      this.subscribeToSaveResponse(this.agencyService.create(agency));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgency>>): void {
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

  protected updateForm(agency: IAgency): void {
    this.agency = agency;
    this.agencyFormService.resetForm(this.editForm, agency);
  }
}
