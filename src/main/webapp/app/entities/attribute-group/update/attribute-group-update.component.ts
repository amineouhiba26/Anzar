import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICustomConfiguration } from 'app/entities/custom-configuration/custom-configuration.model';
import { CustomConfigurationService } from 'app/entities/custom-configuration/service/custom-configuration.service';
import { IAttributeGroup } from '../attribute-group.model';
import { AttributeGroupService } from '../service/attribute-group.service';
import { AttributeGroupFormGroup, AttributeGroupFormService } from './attribute-group-form.service';

@Component({
  selector: 'jhi-attribute-group-update',
  templateUrl: './attribute-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AttributeGroupUpdateComponent implements OnInit {
  isSaving = false;
  attributeGroup: IAttributeGroup | null = null;

  customConfigurationsSharedCollection: ICustomConfiguration[] = [];

  protected attributeGroupService = inject(AttributeGroupService);
  protected attributeGroupFormService = inject(AttributeGroupFormService);
  protected customConfigurationService = inject(CustomConfigurationService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AttributeGroupFormGroup = this.attributeGroupFormService.createAttributeGroupFormGroup();

  compareCustomConfiguration = (o1: ICustomConfiguration | null, o2: ICustomConfiguration | null): boolean =>
    this.customConfigurationService.compareCustomConfiguration(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attributeGroup }) => {
      this.attributeGroup = attributeGroup;
      if (attributeGroup) {
        this.updateForm(attributeGroup);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attributeGroup = this.attributeGroupFormService.getAttributeGroup(this.editForm);
    if (attributeGroup.id !== null) {
      this.subscribeToSaveResponse(this.attributeGroupService.update(attributeGroup));
    } else {
      this.subscribeToSaveResponse(this.attributeGroupService.create(attributeGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttributeGroup>>): void {
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

  protected updateForm(attributeGroup: IAttributeGroup): void {
    this.attributeGroup = attributeGroup;
    this.attributeGroupFormService.resetForm(this.editForm, attributeGroup);

    this.customConfigurationsSharedCollection =
      this.customConfigurationService.addCustomConfigurationToCollectionIfMissing<ICustomConfiguration>(
        this.customConfigurationsSharedCollection,
        attributeGroup.customConfiguration,
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
            this.attributeGroup?.customConfiguration,
          ),
        ),
      )
      .subscribe((customConfigurations: ICustomConfiguration[]) => (this.customConfigurationsSharedCollection = customConfigurations));
  }
}
