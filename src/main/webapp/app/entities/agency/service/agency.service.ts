import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgency, NewAgency } from '../agency.model';

export type PartialUpdateAgency = Partial<IAgency> & Pick<IAgency, 'id'>;

type RestOf<T extends IAgency | NewAgency> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestAgency = RestOf<IAgency>;

export type NewRestAgency = RestOf<NewAgency>;

export type PartialUpdateRestAgency = RestOf<PartialUpdateAgency>;

export type EntityResponseType = HttpResponse<IAgency>;
export type EntityArrayResponseType = HttpResponse<IAgency[]>;

@Injectable({ providedIn: 'root' })
export class AgencyService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/agencies');

  create(agency: NewAgency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agency);
    return this.http
      .post<RestAgency>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(agency: IAgency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agency);
    return this.http
      .put<RestAgency>(`${this.resourceUrl}/${this.getAgencyIdentifier(agency)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(agency: PartialUpdateAgency): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(agency);
    return this.http
      .patch<RestAgency>(`${this.resourceUrl}/${this.getAgencyIdentifier(agency)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAgency>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAgency[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAgencyIdentifier(agency: Pick<IAgency, 'id'>): number {
    return agency.id;
  }

  compareAgency(o1: Pick<IAgency, 'id'> | null, o2: Pick<IAgency, 'id'> | null): boolean {
    return o1 && o2 ? this.getAgencyIdentifier(o1) === this.getAgencyIdentifier(o2) : o1 === o2;
  }

  addAgencyToCollectionIfMissing<Type extends Pick<IAgency, 'id'>>(
    agencyCollection: Type[],
    ...agenciesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const agencies: Type[] = agenciesToCheck.filter(isPresent);
    if (agencies.length > 0) {
      const agencyCollectionIdentifiers = agencyCollection.map(agencyItem => this.getAgencyIdentifier(agencyItem));
      const agenciesToAdd = agencies.filter(agencyItem => {
        const agencyIdentifier = this.getAgencyIdentifier(agencyItem);
        if (agencyCollectionIdentifiers.includes(agencyIdentifier)) {
          return false;
        }
        agencyCollectionIdentifiers.push(agencyIdentifier);
        return true;
      });
      return [...agenciesToAdd, ...agencyCollection];
    }
    return agencyCollection;
  }

  protected convertDateFromClient<T extends IAgency | NewAgency | PartialUpdateAgency>(agency: T): RestOf<T> {
    return {
      ...agency,
      createdDate: agency.createdDate?.toJSON() ?? null,
      lastModifiedDate: agency.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAgency: RestAgency): IAgency {
    return {
      ...restAgency,
      createdDate: restAgency.createdDate ? dayjs(restAgency.createdDate) : undefined,
      lastModifiedDate: restAgency.lastModifiedDate ? dayjs(restAgency.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAgency>): HttpResponse<IAgency> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAgency[]>): HttpResponse<IAgency[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
