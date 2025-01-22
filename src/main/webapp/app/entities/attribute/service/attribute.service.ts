import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttribute, NewAttribute } from '../attribute.model';

export type PartialUpdateAttribute = Partial<IAttribute> & Pick<IAttribute, 'id'>;

type RestOf<T extends IAttribute | NewAttribute> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAttribute = RestOf<IAttribute>;

export type NewRestAttribute = RestOf<NewAttribute>;

export type PartialUpdateRestAttribute = RestOf<PartialUpdateAttribute>;

export type EntityResponseType = HttpResponse<IAttribute>;
export type EntityArrayResponseType = HttpResponse<IAttribute[]>;

@Injectable({ providedIn: 'root' })
export class AttributeService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attributes');

  create(attribute: NewAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .post<RestAttribute>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(attribute: IAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .put<RestAttribute>(`${this.resourceUrl}/${this.getAttributeIdentifier(attribute)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(attribute: PartialUpdateAttribute): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attribute);
    return this.http
      .patch<RestAttribute>(`${this.resourceUrl}/${this.getAttributeIdentifier(attribute)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAttribute>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAttribute[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttributeIdentifier(attribute: Pick<IAttribute, 'id'>): number {
    return attribute.id;
  }

  compareAttribute(o1: Pick<IAttribute, 'id'> | null, o2: Pick<IAttribute, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttributeIdentifier(o1) === this.getAttributeIdentifier(o2) : o1 === o2;
  }

  addAttributeToCollectionIfMissing<Type extends Pick<IAttribute, 'id'>>(
    attributeCollection: Type[],
    ...attributesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attributes: Type[] = attributesToCheck.filter(isPresent);
    if (attributes.length > 0) {
      const attributeCollectionIdentifiers = attributeCollection.map(attributeItem => this.getAttributeIdentifier(attributeItem));
      const attributesToAdd = attributes.filter(attributeItem => {
        const attributeIdentifier = this.getAttributeIdentifier(attributeItem);
        if (attributeCollectionIdentifiers.includes(attributeIdentifier)) {
          return false;
        }
        attributeCollectionIdentifiers.push(attributeIdentifier);
        return true;
      });
      return [...attributesToAdd, ...attributeCollection];
    }
    return attributeCollection;
  }

  protected convertDateFromClient<T extends IAttribute | NewAttribute | PartialUpdateAttribute>(attribute: T): RestOf<T> {
    return {
      ...attribute,
      createdDate: attribute.createdDate?.toJSON() ?? null,
      lastModifiedDate: attribute.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAttribute: RestAttribute): IAttribute {
    return {
      ...restAttribute,
      createdDate: restAttribute.createdDate ? dayjs(restAttribute.createdDate) : undefined,
      lastModifiedDate: restAttribute.lastModifiedDate ? dayjs(restAttribute.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAttribute>): HttpResponse<IAttribute> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAttribute[]>): HttpResponse<IAttribute[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
