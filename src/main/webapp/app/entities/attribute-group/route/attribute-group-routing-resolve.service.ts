import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAttributeGroup } from '../attribute-group.model';
import { AttributeGroupService } from '../service/attribute-group.service';

const attributeGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | IAttributeGroup> => {
  const id = route.params.id;
  if (id) {
    return inject(AttributeGroupService)
      .find(id)
      .pipe(
        mergeMap((attributeGroup: HttpResponse<IAttributeGroup>) => {
          if (attributeGroup.body) {
            return of(attributeGroup.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default attributeGroupResolve;
