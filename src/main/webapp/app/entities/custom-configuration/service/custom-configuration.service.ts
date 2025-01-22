import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomConfiguration, NewCustomConfiguration } from '../custom-configuration.model';

export type PartialUpdateCustomConfiguration = Partial<ICustomConfiguration> & Pick<ICustomConfiguration, 'id'>;

type RestOf<T extends ICustomConfiguration | NewCustomConfiguration> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestCustomConfiguration = RestOf<ICustomConfiguration>;

export type NewRestCustomConfiguration = RestOf<NewCustomConfiguration>;

export type PartialUpdateRestCustomConfiguration = RestOf<PartialUpdateCustomConfiguration>;

export type EntityResponseType = HttpResponse<ICustomConfiguration>;
export type EntityArrayResponseType = HttpResponse<ICustomConfiguration[]>;

@Injectable({ providedIn: 'root' })
export class CustomConfigurationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/custom-configurations');

  create(customConfiguration: NewCustomConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customConfiguration);
    return this.http
      .post<RestCustomConfiguration>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(customConfiguration: ICustomConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customConfiguration);
    return this.http
      .put<RestCustomConfiguration>(`${this.resourceUrl}/${this.getCustomConfigurationIdentifier(customConfiguration)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(customConfiguration: PartialUpdateCustomConfiguration): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customConfiguration);
    return this.http
      .patch<RestCustomConfiguration>(`${this.resourceUrl}/${this.getCustomConfigurationIdentifier(customConfiguration)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCustomConfiguration>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCustomConfiguration[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCustomConfigurationIdentifier(customConfiguration: Pick<ICustomConfiguration, 'id'>): number {
    return customConfiguration.id;
  }

  compareCustomConfiguration(o1: Pick<ICustomConfiguration, 'id'> | null, o2: Pick<ICustomConfiguration, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomConfigurationIdentifier(o1) === this.getCustomConfigurationIdentifier(o2) : o1 === o2;
  }

  addCustomConfigurationToCollectionIfMissing<Type extends Pick<ICustomConfiguration, 'id'>>(
    customConfigurationCollection: Type[],
    ...customConfigurationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customConfigurations: Type[] = customConfigurationsToCheck.filter(isPresent);
    if (customConfigurations.length > 0) {
      const customConfigurationCollectionIdentifiers = customConfigurationCollection.map(customConfigurationItem =>
        this.getCustomConfigurationIdentifier(customConfigurationItem),
      );
      const customConfigurationsToAdd = customConfigurations.filter(customConfigurationItem => {
        const customConfigurationIdentifier = this.getCustomConfigurationIdentifier(customConfigurationItem);
        if (customConfigurationCollectionIdentifiers.includes(customConfigurationIdentifier)) {
          return false;
        }
        customConfigurationCollectionIdentifiers.push(customConfigurationIdentifier);
        return true;
      });
      return [...customConfigurationsToAdd, ...customConfigurationCollection];
    }
    return customConfigurationCollection;
  }

  protected convertDateFromClient<T extends ICustomConfiguration | NewCustomConfiguration | PartialUpdateCustomConfiguration>(
    customConfiguration: T,
  ): RestOf<T> {
    return {
      ...customConfiguration,
      createdDate: customConfiguration.createdDate?.toJSON() ?? null,
      lastModifiedDate: customConfiguration.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCustomConfiguration: RestCustomConfiguration): ICustomConfiguration {
    return {
      ...restCustomConfiguration,
      createdDate: restCustomConfiguration.createdDate ? dayjs(restCustomConfiguration.createdDate) : undefined,
      lastModifiedDate: restCustomConfiguration.lastModifiedDate ? dayjs(restCustomConfiguration.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCustomConfiguration>): HttpResponse<ICustomConfiguration> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCustomConfiguration[]>): HttpResponse<ICustomConfiguration[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
