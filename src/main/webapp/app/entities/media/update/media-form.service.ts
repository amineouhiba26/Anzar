import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IMedia, NewMedia } from '../media.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedia for edit and NewMediaFormGroupInput for create.
 */
type MediaFormGroupInput = IMedia | PartialWithRequiredKeyOf<NewMedia>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IMedia | NewMedia> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type MediaFormRawValue = FormValueOf<IMedia>;

type NewMediaFormRawValue = FormValueOf<NewMedia>;

type MediaFormDefaults = Pick<NewMedia, 'id' | 'createdDate' | 'lastModifiedDate'>;

type MediaFormGroupContent = {
  id: FormControl<MediaFormRawValue['id'] | NewMedia['id']>;
  url: FormControl<MediaFormRawValue['url']>;
  caption: FormControl<MediaFormRawValue['caption']>;
  category: FormControl<MediaFormRawValue['category']>;
  order: FormControl<MediaFormRawValue['order']>;
  createdBy: FormControl<MediaFormRawValue['createdBy']>;
  createdDate: FormControl<MediaFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<MediaFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<MediaFormRawValue['lastModifiedDate']>;
  property: FormControl<MediaFormRawValue['property']>;
};

export type MediaFormGroup = FormGroup<MediaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MediaFormService {
  createMediaFormGroup(media: MediaFormGroupInput = { id: null }): MediaFormGroup {
    const mediaRawValue = this.convertMediaToMediaRawValue({
      ...this.getFormDefaults(),
      ...media,
    });
    return new FormGroup<MediaFormGroupContent>({
      id: new FormControl(
        { value: mediaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      url: new FormControl(mediaRawValue.url),
      caption: new FormControl(mediaRawValue.caption),
      category: new FormControl(mediaRawValue.category),
      order: new FormControl(mediaRawValue.order),
      createdBy: new FormControl(mediaRawValue.createdBy),
      createdDate: new FormControl(mediaRawValue.createdDate),
      lastModifiedBy: new FormControl(mediaRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(mediaRawValue.lastModifiedDate),
      property: new FormControl(mediaRawValue.property),
    });
  }

  getMedia(form: MediaFormGroup): IMedia | NewMedia {
    return this.convertMediaRawValueToMedia(form.getRawValue() as MediaFormRawValue | NewMediaFormRawValue);
  }

  resetForm(form: MediaFormGroup, media: MediaFormGroupInput): void {
    const mediaRawValue = this.convertMediaToMediaRawValue({ ...this.getFormDefaults(), ...media });
    form.reset(
      {
        ...mediaRawValue,
        id: { value: mediaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MediaFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertMediaRawValueToMedia(rawMedia: MediaFormRawValue | NewMediaFormRawValue): IMedia | NewMedia {
    return {
      ...rawMedia,
      createdDate: dayjs(rawMedia.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawMedia.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertMediaToMediaRawValue(
    media: IMedia | (Partial<NewMedia> & MediaFormDefaults),
  ): MediaFormRawValue | PartialWithRequiredKeyOf<NewMediaFormRawValue> {
    return {
      ...media,
      createdDate: media.createdDate ? media.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: media.lastModifiedDate ? media.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
