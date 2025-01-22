import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAttributeGroup, NewAttributeGroup } from '../attribute-group.model';

export type PartialUpdateAttributeGroup = Partial<IAttributeGroup> & Pick<IAttributeGroup, 'id'>;

type RestOf<T extends IAttributeGroup | NewAttributeGroup> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAttributeGroup = RestOf<IAttributeGroup>;

export type NewRestAttributeGroup = RestOf<NewAttributeGroup>;

export type PartialUpdateRestAttributeGroup = RestOf<PartialUpdateAttributeGroup>;

export type EntityResponseType = HttpResponse<IAttributeGroup>;
export type EntityArrayResponseType = HttpResponse<IAttributeGroup[]>;

@Injectable({ providedIn: 'root' })
export class AttributeGroupService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/attribute-groups');

  create(attributeGroup: NewAttributeGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeGroup);
    return this.http
      .post<RestAttributeGroup>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(attributeGroup: IAttributeGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeGroup);
    return this.http
      .put<RestAttributeGroup>(`${this.resourceUrl}/${this.getAttributeGroupIdentifier(attributeGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(attributeGroup: PartialUpdateAttributeGroup): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(attributeGroup);
    return this.http
      .patch<RestAttributeGroup>(`${this.resourceUrl}/${this.getAttributeGroupIdentifier(attributeGroup)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAttributeGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAttributeGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAttributeGroupIdentifier(attributeGroup: Pick<IAttributeGroup, 'id'>): number {
    return attributeGroup.id;
  }

  compareAttributeGroup(o1: Pick<IAttributeGroup, 'id'> | null, o2: Pick<IAttributeGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getAttributeGroupIdentifier(o1) === this.getAttributeGroupIdentifier(o2) : o1 === o2;
  }

  addAttributeGroupToCollectionIfMissing<Type extends Pick<IAttributeGroup, 'id'>>(
    attributeGroupCollection: Type[],
    ...attributeGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const attributeGroups: Type[] = attributeGroupsToCheck.filter(isPresent);
    if (attributeGroups.length > 0) {
      const attributeGroupCollectionIdentifiers = attributeGroupCollection.map(attributeGroupItem =>
        this.getAttributeGroupIdentifier(attributeGroupItem),
      );
      const attributeGroupsToAdd = attributeGroups.filter(attributeGroupItem => {
        const attributeGroupIdentifier = this.getAttributeGroupIdentifier(attributeGroupItem);
        if (attributeGroupCollectionIdentifiers.includes(attributeGroupIdentifier)) {
          return false;
        }
        attributeGroupCollectionIdentifiers.push(attributeGroupIdentifier);
        return true;
      });
      return [...attributeGroupsToAdd, ...attributeGroupCollection];
    }
    return attributeGroupCollection;
  }

  protected convertDateFromClient<T extends IAttributeGroup | NewAttributeGroup | PartialUpdateAttributeGroup>(
    attributeGroup: T,
  ): RestOf<T> {
    return {
      ...attributeGroup,
      createdDate: attributeGroup.createdDate?.toJSON() ?? null,
      lastModifiedDate: attributeGroup.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAttributeGroup: RestAttributeGroup): IAttributeGroup {
    return {
      ...restAttributeGroup,
      createdDate: restAttributeGroup.createdDate ? dayjs(restAttributeGroup.createdDate) : undefined,
      lastModifiedDate: restAttributeGroup.lastModifiedDate ? dayjs(restAttributeGroup.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAttributeGroup>): HttpResponse<IAttributeGroup> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAttributeGroup[]>): HttpResponse<IAttributeGroup[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
