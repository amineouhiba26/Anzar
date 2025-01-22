import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';
import { CustomConfigurationService } from 'app/entities/custom-configuration/service/custom-configuration.service';
import { IProperty } from '../property.model';
import { PropertyService } from '../service/property.service';
import { PropertyFormGroup, PropertyFormService } from './property-form.service';

@Component({
  selector: 'jhi-property-update',
  templateUrl: './property-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PropertyUpdateComponent implements OnInit {
  isSaving = false;
  property: IProperty | null = null;

  customConfigurationsSharedCollection: ICustomConfiguration[] = [];

  protected propertyService = inject(PropertyService);
  protected propertyFormService = inject(PropertyFormService);
  protected customConfigurationService = inject(CustomConfigurationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PropertyFormGroup = this.propertyFormService.createPropertyFormGroup();

  compareCustomConfiguration = (o1: ICustomConfiguration | null, o2: ICustomConfiguration | null): boolean =>
    this.customConfigurationService.compareCustomConfiguration(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ property }) => {
      this.property = property;
      if (property) {
        this.updateForm(property);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const property = this.propertyFormService.getProperty(this.editForm);
    if (property.id !== null) {
      this.subscribeToSaveResponse(this.propertyService.update(property));
    } else {
      this.subscribeToSaveResponse(this.propertyService.create(property));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProperty>>): void {
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

  protected updateForm(property: IProperty): void {
    this.property = property;
    this.propertyFormService.resetForm(this.editForm, property);

    this.customConfigurationsSharedCollection =
      this.customConfigurationService.addCustomConfigurationToCollectionIfMissing<ICustomConfiguration>(
        this.customConfigurationsSharedCollection,
        property.configuration,
      );
  }

  protected loadRelationshipsOptions(): void {
    this.customConfigurationService
      .query()
      .pipe(map((res: HttpResponse<ICustomConfiguration[]>) => res.body ?? []))
      .pipe(
        map((customConfigurations: ICustomConfiguration[]) =>
          this.customConfigurationService.addCustomConfigurationToCollectionIfMissing<ICustomConfiguration>(
            customConfigurations,
            this.property?.configuration,
          ),
        ),
      )
      .subscribe((customConfigurations: ICustomConfiguration[]) => (this.customConfigurationsSharedCollection = customConfigurations));
  }
}
