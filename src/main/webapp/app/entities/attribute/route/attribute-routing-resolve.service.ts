import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';

const attributeResolve = (route: ActivatedRouteSnapshot): Observable<null | IAttribute> => {
  const id = route.params.id;
  if (id) {
    return inject(AttributeService)
      .find(id)
      .pipe(
        mergeMap((attribute: HttpResponse<IAttribute>) => {
          if (attribute.body) {
            return of(attribute.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default attributeResolve;
