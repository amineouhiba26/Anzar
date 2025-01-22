import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAttributeGroup } from 'app/entities/attribute-group/attribute-group.model';
import { AttributeGroupService } from 'app/entities/attribute-group/service/attribute-group.service';
import { IAttribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';
import { AttributeFormGroup, AttributeFormService } from './attribute-form.service';

@Component({
  selector: 'jhi-attribute-update',
  templateUrl: './attribute-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AttributeUpdateComponent implements OnInit {
  isSaving = false;
  attribute: IAttribute | null = null;

  attributeGroupsSharedCollection: IAttributeGroup[] = [];

  protected attributeService = inject(AttributeService);
  protected attributeFormService = inject(AttributeFormService);
  protected attributeGroupService = inject(AttributeGroupService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AttributeFormGroup = this.attributeFormService.createAttributeFormGroup();

  compareAttributeGroup = (o1: IAttributeGroup | null, o2: IAttributeGroup | null): boolean =>
    this.attributeGroupService.compareAttributeGroup(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attribute }) => {
      this.attribute = attribute;
      if (attribute) {
        this.updateForm(attribute);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attribute = this.attributeFormService.getAttribute(this.editForm);
    if (attribute.id !== null) {
      this.subscribeToSaveResponse(this.attributeService.update(attribute));
    } else {
      this.subscribeToSaveResponse(this.attributeService.create(attribute));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttribute>>): void {
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

  protected updateForm(attribute: IAttribute): void {
    this.attribute = attribute;
    this.attributeFormService.resetForm(this.editForm, attribute);

    this.attributeGroupsSharedCollection = this.attributeGroupService.addAttributeGroupToCollectionIfMissing<IAttributeGroup>(
      this.attributeGroupsSharedCollection,
      attribute.attributeGroup,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.attributeGroupService
      .query()
      .pipe(map((res: HttpResponse<IAttributeGroup[]>) => res.body ?? []))
      .pipe(
        map((attributeGroups: IAttributeGroup[]) =>
          this.attributeGroupService.addAttributeGroupToCollectionIfMissing<IAttributeGroup>(
            attributeGroups,
            this.attribute?.attributeGroup,
          ),
        ),
      )
      .subscribe((attributeGroups: IAttributeGroup[]) => (this.attributeGroupsSharedCollection = attributeGroups));
  }
}
