import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMedia, NewMedia } from '../media.model';

export type PartialUpdateMedia = Partial<IMedia> & Pick<IMedia, 'id'>;

type RestOf<T extends IMedia | NewMedia> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestMedia = RestOf<IMedia>;

export type NewRestMedia = RestOf<NewMedia>;

export type PartialUpdateRestMedia = RestOf<PartialUpdateMedia>;

export type EntityResponseType = HttpResponse<IMedia>;
export type EntityArrayResponseType = HttpResponse<IMedia[]>;

@Injectable({ providedIn: 'root' })
export class MediaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/media');

  create(media: NewMedia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(media);
    return this.http.post<RestMedia>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(media: IMedia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(media);
    return this.http
      .put<RestMedia>(`${this.resourceUrl}/${this.getMediaIdentifier(media)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(media: PartialUpdateMedia): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(media);
    return this.http
      .patch<RestMedia>(`${this.resourceUrl}/${this.getMediaIdentifier(media)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMedia>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMedia[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMediaIdentifier(media: Pick<IMedia, 'id'>): number {
    return media.id;
  }

  compareMedia(o1: Pick<IMedia, 'id'> | null, o2: Pick<IMedia, 'id'> | null): boolean {
    return o1 && o2 ? this.getMediaIdentifier(o1) === this.getMediaIdentifier(o2) : o1 === o2;
  }

  addMediaToCollectionIfMissing<Type extends Pick<IMedia, 'id'>>(
    mediaCollection: Type[],
    ...mediaToCheck: (Type | null | undefined)[]
  ): Type[] {
    const media: Type[] = mediaToCheck.filter(isPresent);
    if (media.length > 0) {
      const mediaCollectionIdentifiers = mediaCollection.map(mediaItem => this.getMediaIdentifier(mediaItem));
      const mediaToAdd = media.filter(mediaItem => {
        const mediaIdentifier = this.getMediaIdentifier(mediaItem);
        if (mediaCollectionIdentifiers.includes(mediaIdentifier)) {
          return false;
        }
        mediaCollectionIdentifiers.push(mediaIdentifier);
        return true;
      });
      return [...mediaToAdd, ...mediaCollection];
    }
    return mediaCollection;
  }

  protected convertDateFromClient<T extends IMedia | NewMedia | PartialUpdateMedia>(media: T): RestOf<T> {
    return {
      ...media,
      createdDate: media.createdDate?.toJSON() ?? null,
      lastModifiedDate: media.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restMedia: RestMedia): IMedia {
    return {
      ...restMedia,
      createdDate: restMedia.createdDate ? dayjs(restMedia.createdDate) : undefined,
      lastModifiedDate: restMedia.lastModifiedDate ? dayjs(restMedia.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMedia>): HttpResponse<IMedia> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMedia[]>): HttpResponse<IMedia[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
