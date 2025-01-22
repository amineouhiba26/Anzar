import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomConfiguration } from '../custom-configuration.model';
import { CustomConfigurationService } from '../service/custom-configuration.service';

const customConfigurationResolve = (route: ActivatedRouteSnapshot): Observable<null | ICustomConfiguration> => {
  const id = route.params.id;
  if (id) {
    return inject(CustomConfigurationService)
      .find(id)
      .pipe(
        mergeMap((customConfiguration: HttpResponse<ICustomConfiguration>) => {
          if (customConfiguration.body) {
            return of(customConfiguration.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default customConfigurationResolve;
