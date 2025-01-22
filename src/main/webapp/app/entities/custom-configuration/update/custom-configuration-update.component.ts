import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICustomConfiguration } from '../custom-configuration.model';
import { CustomConfigurationService } from '../service/custom-configuration.service';
import { CustomConfigurationFormGroup, CustomConfigurationFormService } from './custom-configuration-form.service';

@Component({
  selector: 'jhi-custom-configuration-update',
  templateUrl: './custom-configuration-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CustomConfigurationUpdateComponent implements OnInit {
  isSaving = false;
  customConfiguration: ICustomConfiguration | null = null;

  protected customConfigurationService = inject(CustomConfigurationService);
  protected customConfigurationFormService = inject(CustomConfigurationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: CustomConfigurationFormGroup = this.customConfigurationFormService.createCustomConfigurationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customConfiguration }) => {
      this.customConfiguration = customConfiguration;
      if (customConfiguration) {
        this.updateForm(customConfiguration);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customConfiguration = this.customConfigurationFormService.getCustomConfiguration(this.editForm);
    if (customConfiguration.id !== null) {
      this.subscribeToSaveResponse(this.customConfigurationService.update(customConfiguration));
    } else {
      this.subscribeToSaveResponse(this.customConfigurationService.create(customConfiguration));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomConfiguration>>): void {
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

  protected updateForm(customConfiguration: ICustomConfiguration): void {
    this.customConfiguration = customConfiguration;
    this.customConfigurationFormService.resetForm(this.editForm, customConfiguration);
  }
}
