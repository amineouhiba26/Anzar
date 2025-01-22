import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomUser, NewCustomUser } from '../custom-user.model';

export type PartialUpdateCustomUser = Partial<ICustomUser> & Pick<ICustomUser, 'id'>;

type RestOf<T extends ICustomUser | NewCustomUser> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCustomUser = RestOf<ICustomUser>;

export type NewRestCustomUser = RestOf<NewCustomUser>;

export type PartialUpdateRestCustomUser = RestOf<PartialUpdateCustomUser>;

export type EntityResponseType = HttpResponse<ICustomUser>;
export type EntityArrayResponseType = HttpResponse<ICustomUser[]>;

@Injectable({ providedIn: 'root' })
export class CustomUserService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/custom-users');

  create(customUser: NewCustomUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customUser);
    return this.http
      .post<RestCustomUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(customUser: ICustomUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customUser);
    return this.http
      .put<RestCustomUser>(`${this.resourceUrl}/${this.getCustomUserIdentifier(customUser)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(customUser: PartialUpdateCustomUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customUser);
    return this.http
      .patch<RestCustomUser>(`${this.resourceUrl}/${this.getCustomUserIdentifier(customUser)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCustomUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCustomUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCustomUserIdentifier(customUser: Pick<ICustomUser, 'id'>): number {
    return customUser.id;
  }

  compareCustomUser(o1: Pick<ICustomUser, 'id'> | null, o2: Pick<ICustomUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomUserIdentifier(o1) === this.getCustomUserIdentifier(o2) : o1 === o2;
  }

  addCustomUserToCollectionIfMissing<Type extends Pick<ICustomUser, 'id'>>(
    customUserCollection: Type[],
    ...customUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customUsers: Type[] = customUsersToCheck.filter(isPresent);
    if (customUsers.length > 0) {
      const customUserCollectionIdentifiers = customUserCollection.map(customUserItem => this.getCustomUserIdentifier(customUserItem));
      const customUsersToAdd = customUsers.filter(customUserItem => {
        const customUserIdentifier = this.getCustomUserIdentifier(customUserItem);
        if (customUserCollectionIdentifiers.includes(customUserIdentifier)) {
          return false;
        }
        customUserCollectionIdentifiers.push(customUserIdentifier);
        return true;
      });
      return [...customUsersToAdd, ...customUserCollection];
    }
    return customUserCollection;
  }

  protected convertDateFromClient<T extends ICustomUser | NewCustomUser | PartialUpdateCustomUser>(customUser: T): RestOf<T> {
    return {
      ...customUser,
      createdDate: customUser.createdDate?.toJSON() ?? null,
      lastModifiedDate: customUser.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCustomUser: RestCustomUser): ICustomUser {
    return {
      ...restCustomUser,
      createdDate: restCustomUser.createdDate ? dayjs(restCustomUser.createdDate) : undefined,
      lastModifiedDate: restCustomUser.lastModifiedDate ? dayjs(restCustomUser.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCustomUser>): HttpResponse<ICustomUser> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCustomUser[]>): HttpResponse<ICustomUser[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
