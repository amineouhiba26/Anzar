import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRole, NewRole } from '../role.model';

export type PartialUpdateRole = Partial<IRole> & Pick<IRole, 'id'>;

type RestOf<T extends IRole | NewRole> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestRole = RestOf<IRole>;

export type NewRestRole = RestOf<NewRole>;

export type PartialUpdateRestRole = RestOf<PartialUpdateRole>;

export type EntityResponseType = HttpResponse<IRole>;
export type EntityArrayResponseType = HttpResponse<IRole[]>;

@Injectable({ providedIn: 'root' })
export class RoleService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/roles');

  create(role: NewRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http.post<RestRole>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(role: IRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http
      .put<RestRole>(`${this.resourceUrl}/${this.getRoleIdentifier(role)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(role: PartialUpdateRole): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(role);
    return this.http
      .patch<RestRole>(`${this.resourceUrl}/${this.getRoleIdentifier(role)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestRole>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRole[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRoleIdentifier(role: Pick<IRole, 'id'>): number {
    return role.id;
  }

  compareRole(o1: Pick<IRole, 'id'> | null, o2: Pick<IRole, 'id'> | null): boolean {
    return o1 && o2 ? this.getRoleIdentifier(o1) === this.getRoleIdentifier(o2) : o1 === o2;
  }

  addRoleToCollectionIfMissing<Type extends Pick<IRole, 'id'>>(
    roleCollection: Type[],
    ...rolesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const roles: Type[] = rolesToCheck.filter(isPresent);
    if (roles.length > 0) {
      const roleCollectionIdentifiers = roleCollection.map(roleItem => this.getRoleIdentifier(roleItem));
      const rolesToAdd = roles.filter(roleItem => {
        const roleIdentifier = this.getRoleIdentifier(roleItem);
        if (roleCollectionIdentifiers.includes(roleIdentifier)) {
          return false;
        }
        roleCollectionIdentifiers.push(roleIdentifier);
        return true;
      });
      return [...rolesToAdd, ...roleCollection];
    }
    return roleCollection;
  }

  protected convertDateFromClient<T extends IRole | NewRole | PartialUpdateRole>(role: T): RestOf<T> {
    return {
      ...role,
      createdDate: role.createdDate?.toJSON() ?? null,
      lastModifiedDate: role.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRole: RestRole): IRole {
    return {
      ...restRole,
      createdDate: restRole.createdDate ? dayjs(restRole.createdDate) : undefined,
      lastModifiedDate: restRole.lastModifiedDate ? dayjs(restRole.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRole>): HttpResponse<IRole> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRole[]>): HttpResponse<IRole[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
