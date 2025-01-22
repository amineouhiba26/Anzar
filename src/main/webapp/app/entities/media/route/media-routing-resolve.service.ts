import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMedia } from '../media.model';
import { MediaService } from '../service/media.service';

const mediaResolve = (route: ActivatedRouteSnapshot): Observable<null | IMedia> => {
  const id = route.params.id;
  if (id) {
    return inject(MediaService)
      .find(id)
      .pipe(
        mergeMap((media: HttpResponse<IMedia>) => {
          if (media.body) {
            return of(media.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default mediaResolve;
