import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { IAttributeValue } from '../attribute-value.model';
import { AttributeValueService } from '../service/attribute-value.service';
import { AttributeValueFormGroup, AttributeValueFormService } from './attribute-value-form.service';

@Component({
  selector: 'jhi-attribute-value-update',
  templateUrl: './attribute-value-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AttributeValueUpdateComponent implements OnInit {
  isSaving = false;
  attributeValue: IAttributeValue | null = null;

  propertiesSharedCollection: IProperty[] = [];

  protected attributeValueService = inject(AttributeValueService);
  protected attributeValueFormService = inject(AttributeValueFormService);
  protected propertyService = inject(PropertyService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AttributeValueFormGroup = this.attributeValueFormService.createAttributeValueFormGroup();

  compareProperty = (o1: IProperty | null, o2: IProperty | null): boolean => this.propertyService.compareProperty(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attributeValue }) => {
      this.attributeValue = attributeValue;
      if (attributeValue) {
        this.updateForm(attributeValue);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attributeValue = this.attributeValueFormService.getAttributeValue(this.editForm);
    if (attributeValue.id !== null) {
      this.subscribeToSaveResponse(this.attributeValueService.update(attributeValue));
    } else {
      this.subscribeToSaveResponse(this.attributeValueService.create(attributeValue));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttributeValue>>): void {
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

  protected updateForm(attributeValue: IAttributeValue): void {
    this.attributeValue = attributeValue;
    this.attributeValueFormService.resetForm(this.editForm, attributeValue);

    this.propertiesSharedCollection = this.propertyService.addPropertyToCollectionIfMissing<IProperty>(
      this.propertiesSharedCollection,
      attributeValue.property,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.propertyService
      .query()
      .pipe(map((res: HttpResponse<IProperty[]>) => res.body ?? []))
      .pipe(
        map((properties: IProperty[]) =>
          this.propertyService.addPropertyToCollectionIfMissing<IProperty>(properties, this.attributeValue?.property),
        ),
      )
      .subscribe((properties: IProperty[]) => (this.propertiesSharedCollection = properties));
  }
}
