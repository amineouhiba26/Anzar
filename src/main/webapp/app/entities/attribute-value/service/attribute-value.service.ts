import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttributeValue, NewAttributeValue } from '../attribute-value.model';

export type PartialUpdateAttributeValue = Partial<IAttributeValue> & Pick<IAttributeValue, 'id'>;

type RestOf<T extends IAttributeValue | NewAttributeValue> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAttributeValue = RestOf<IAttributeValue>;

export type NewRestAttributeValue = RestOf<NewAttributeValue>;

export type PartialUpdateRestAttributeValue = RestOf<PartialUpdateAttributeValue>;

export type EntityResponseType = HttpResponse<IAttributeValue>;
export type EntityArrayResponseType = HttpResponse<IAttributeValue[]>;

@Injectable({ providedIn: 'root' })
export class AttributeValueService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attribute-values');

  create(attributeValue: NewAttributeValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeValue);
    return this.http
      .post<RestAttributeValue>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(attributeValue: IAttributeValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeValue);
    return this.http
      .put<RestAttributeValue>(`${this.resourceUrl}/${this.getAttributeValueIdentifier(attributeValue)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(attributeValue: PartialUpdateAttributeValue): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeValue);
    return this.http
      .patch<RestAttributeValue>(`${this.resourceUrl}/${this.getAttributeValueIdentifier(attributeValue)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAttributeValue>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAttributeValue[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttributeValueIdentifier(attributeValue: Pick<IAttributeValue, 'id'>): number {
    return attributeValue.id;
  }

  compareAttributeValue(o1: Pick<IAttributeValue, 'id'> | null, o2: Pick<IAttributeValue, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttributeValueIdentifier(o1) === this.getAttributeValueIdentifier(o2) : o1 === o2;
  }

  addAttributeValueToCollectionIfMissing<Type extends Pick<IAttributeValue, 'id'>>(
    attributeValueCollection: Type[],
    ...attributeValuesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attributeValues: Type[] = attributeValuesToCheck.filter(isPresent);
    if (attributeValues.length > 0) {
      const attributeValueCollectionIdentifiers = attributeValueCollection.map(attributeValueItem =>
        this.getAttributeValueIdentifier(attributeValueItem),
      );
      const attributeValuesToAdd = attributeValues.filter(attributeValueItem => {
        const attributeValueIdentifier = this.getAttributeValueIdentifier(attributeValueItem);
        if (attributeValueCollectionIdentifiers.includes(attributeValueIdentifier)) {
          return false;
        }
        attributeValueCollectionIdentifiers.push(attributeValueIdentifier);
        return true;
      });
      return [...attributeValuesToAdd, ...attributeValueCollection];
    }
    return attributeValueCollection;
  }

  protected convertDateFromClient<T extends IAttributeValue | NewAttributeValue | PartialUpdateAttributeValue>(
    attributeValue: T,
  ): RestOf<T> {
    return {
      ...attributeValue,
      createdDate: attributeValue.createdDate?.toJSON() ?? null,
      lastModifiedDate: attributeValue.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAttributeValue: RestAttributeValue): IAttributeValue {
    return {
      ...restAttributeValue,
      createdDate: restAttributeValue.createdDate ? dayjs(restAttributeValue.createdDate) : undefined,
      lastModifiedDate: restAttributeValue.lastModifiedDate ? dayjs(restAttributeValue.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAttributeValue>): HttpResponse<IAttributeValue> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAttributeValue[]>): HttpResponse<IAttributeValue[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
