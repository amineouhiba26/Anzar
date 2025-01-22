import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAgency } from '../agency.model';
import { AgencyService } from '../service/agency.service';

const agencyResolve = (route: ActivatedRouteSnapshot): Observable<null | IAgency> => {
  const id = route.params.id;
  if (id) {
    return inject(AgencyService)
      .find(id)
      .pipe(
        mergeMap((agency: HttpResponse<IAgency>) => {
          if (agency.body) {
            return of(agency.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default agencyResolve;
