import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProperty } from '../property.model';
import { PropertyService } from '../service/property.service';

const propertyResolve = (route: ActivatedRouteSnapshot): Observable<null | IProperty> => {
  const id = route.params.id;
  if (id) {
    return inject(PropertyService)
      .find(id)
      .pipe(
        mergeMap((property: HttpResponse<IProperty>) => {
          if (property.body) {
            return of(property.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default propertyResolve;
