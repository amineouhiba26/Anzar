import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomUser } from '../custom-user.model';
import { CustomUserService } from '../service/custom-user.service';

const customUserResolve = (route: ActivatedRouteSnapshot): Observable<null | ICustomUser> => {
  const id = route.params.id;
  if (id) {
    return inject(CustomUserService)
      .find(id)
      .pipe(
        mergeMap((customUser: HttpResponse<ICustomUser>) => {
          if (customUser.body) {
            return of(customUser.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default customUserResolve;
