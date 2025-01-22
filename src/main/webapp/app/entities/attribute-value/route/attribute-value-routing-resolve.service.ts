import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttributeValue } from '../attribute-value.model';
import { AttributeValueService } from '../service/attribute-value.service';

const attributeValueResolve = (route: ActivatedRouteSnapshot): Observable<null | IAttributeValue> => {
  const id = route.params.id;
  if (id) {
    return inject(AttributeValueService)
      .find(id)
      .pipe(
        mergeMap((attributeValue: HttpResponse<IAttributeValue>) => {
          if (attributeValue.body) {
            return of(attributeValue.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default attributeValueResolve;
