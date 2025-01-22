import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProperty } from 'app/entities/property/property.model';
import { PropertyService } from 'app/entities/property/service/property.service';
import { IMedia } from '../media.model';
import { MediaService } from '../service/media.service';
import { MediaFormGroup, MediaFormService } from './media-form.service';

@Component({
  selector: 'jhi-media-update',
  templateUrl: './media-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MediaUpdateComponent implements OnInit {
  isSaving = false;
  media: IMedia | null = null;

  propertiesSharedCollection: IProperty[] = [];

  protected mediaService = inject(MediaService);
  protected mediaFormService = inject(MediaFormService);
  protected propertyService = inject(PropertyService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MediaFormGroup = this.mediaFormService.createMediaFormGroup();

  compareProperty = (o1: IProperty | null, o2: IProperty | null): boolean => this.propertyService.compareProperty(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ media }) => {
      this.media = media;
      if (media) {
        this.updateForm(media);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const media = this.mediaFormService.getMedia(this.editForm);
    if (media.id !== null) {
      this.subscribeToSaveResponse(this.mediaService.update(media));
    } else {
      this.subscribeToSaveResponse(this.mediaService.create(media));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMedia>>): void {
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

  protected updateForm(media: IMedia): void {
    this.media = media;
    this.mediaFormService.resetForm(this.editForm, media);

    this.propertiesSharedCollection = this.propertyService.addPropertyToCollectionIfMissing<IProperty>(
      this.propertiesSharedCollection,
      media.property,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.propertyService
      .query()
      .pipe(map((res: HttpResponse<IProperty[]>) => res.body ?? []))
      .pipe(
        map((properties: IProperty[]) =>
          this.propertyService.addPropertyToCollectionIfMissing<IProperty>(properties, this.media?.property),
        ),
      )
      .subscribe((properties: IProperty[]) => (this.propertiesSharedCollection = properties));
  }
}
