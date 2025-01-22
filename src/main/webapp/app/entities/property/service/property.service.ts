import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProperty, NewProperty } from '../property.model';

export type PartialUpdateProperty = Partial<IProperty> & Pick<IProperty, 'id'>;

type RestOf<T extends IProperty | NewProperty> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestProperty = RestOf<IProperty>;

export type NewRestProperty = RestOf<NewProperty>;

export type PartialUpdateRestProperty = RestOf<PartialUpdateProperty>;

export type EntityResponseType = HttpResponse<IProperty>;
export type EntityArrayResponseType = HttpResponse<IProperty[]>;

@Injectable({ providedIn: 'root' })
export class PropertyService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/properties');

  create(property: NewProperty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(property);
    return this.http
      .post<RestProperty>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(property: IProperty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(property);
    return this.http
      .put<RestProperty>(`${this.resourceUrl}/${this.getPropertyIdentifier(property)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(property: PartialUpdateProperty): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(property);
    return this.http
      .patch<RestProperty>(`${this.resourceUrl}/${this.getPropertyIdentifier(property)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProperty>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProperty[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPropertyIdentifier(property: Pick<IProperty, 'id'>): number {
    return property.id;
  }

  compareProperty(o1: Pick<IProperty, 'id'> | null, o2: Pick<IProperty, 'id'> | null): boolean {
    return o1 && o2 ? this.getPropertyIdentifier(o1) === this.getPropertyIdentifier(o2) : o1 === o2;
  }

  addPropertyToCollectionIfMissing<Type extends Pick<IProperty, 'id'>>(
    propertyCollection: Type[],
    ...propertiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const properties: Type[] = propertiesToCheck.filter(isPresent);
    if (properties.length > 0) {
      const propertyCollectionIdentifiers = propertyCollection.map(propertyItem => this.getPropertyIdentifier(propertyItem));
      const propertiesToAdd = properties.filter(propertyItem => {
        const propertyIdentifier = this.getPropertyIdentifier(propertyItem);
        if (propertyCollectionIdentifiers.includes(propertyIdentifier)) {
          return false;
        }
        propertyCollectionIdentifiers.push(propertyIdentifier);
        return true;
      });
      return [...propertiesToAdd, ...propertyCollection];
    }
    return propertyCollection;
  }

  protected convertDateFromClient<T extends IProperty | NewProperty | PartialUpdateProperty>(property: T): RestOf<T> {
    return {
      ...property,
      createdDate: property.createdDate?.toJSON() ?? null,
      lastModifiedDate: property.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restProperty: RestProperty): IProperty {
    return {
      ...restProperty,
      createdDate: restProperty.createdDate ? dayjs(restProperty.createdDate) : undefined,
      lastModifiedDate: restProperty.lastModifiedDate ? dayjs(restProperty.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProperty>): HttpResponse<IProperty> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProperty[]>): HttpResponse<IProperty[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
