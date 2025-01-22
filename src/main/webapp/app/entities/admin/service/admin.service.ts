import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAdmin, NewAdmin } from '../admin.model';

export type PartialUpdateAdmin = Partial<IAdmin> & Pick<IAdmin, 'id'>;

type RestOf<T extends IAdmin | NewAdmin> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAdmin = RestOf<IAdmin>;

export type NewRestAdmin = RestOf<NewAdmin>;

export type PartialUpdateRestAdmin = RestOf<PartialUpdateAdmin>;

export type EntityResponseType = HttpResponse<IAdmin>;
export type EntityArrayResponseType = HttpResponse<IAdmin[]>;

@Injectable({ providedIn: 'root' })
export class AdminService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/admins');

  create(admin: NewAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(admin);
    return this.http.post<RestAdmin>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(admin: IAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(admin);
    return this.http
      .put<RestAdmin>(`${this.resourceUrl}/${this.getAdminIdentifier(admin)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(admin: PartialUpdateAdmin): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(admin);
    return this.http
      .patch<RestAdmin>(`${this.resourceUrl}/${this.getAdminIdentifier(admin)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAdmin[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAdminIdentifier(admin: Pick<IAdmin, 'id'>): number {
    return admin.id;
  }

  compareAdmin(o1: Pick<IAdmin, 'id'> | null, o2: Pick<IAdmin, 'id'> | null): boolean {
    return o1 && o2 ? this.getAdminIdentifier(o1) === this.getAdminIdentifier(o2) : o1 === o2;
  }

  addAdminToCollectionIfMissing<Type extends Pick<IAdmin, 'id'>>(
    adminCollection: Type[],
    ...adminsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const admins: Type[] = adminsToCheck.filter(isPresent);
    if (admins.length > 0) {
      const adminCollectionIdentifiers = adminCollection.map(adminItem => this.getAdminIdentifier(adminItem));
      const adminsToAdd = admins.filter(adminItem => {
        const adminIdentifier = this.getAdminIdentifier(adminItem);
        if (adminCollectionIdentifiers.includes(adminIdentifier)) {
          return false;
        }
        adminCollectionIdentifiers.push(adminIdentifier);
        return true;
      });
      return [...adminsToAdd, ...adminCollection];
    }
    return adminCollection;
  }

  protected convertDateFromClient<T extends IAdmin | NewAdmin | PartialUpdateAdmin>(admin: T): RestOf<T> {
    return {
      ...admin,
      createdDate: admin.createdDate?.toJSON() ?? null,
      lastModifiedDate: admin.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAdmin: RestAdmin): IAdmin {
    return {
      ...restAdmin,
      createdDate: restAdmin.createdDate ? dayjs(restAdmin.createdDate) : undefined,
      lastModifiedDate: restAdmin.lastModifiedDate ? dayjs(restAdmin.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAdmin>): HttpResponse<IAdmin> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAdmin[]>): HttpResponse<IAdmin[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
