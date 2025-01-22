import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IRole } from '../role.model';

@Component({
  selector: 'jhi-role-detail',
  templateUrl: './role-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class RoleDetailComponent {
  role = input<IRole | null>(null);

  previousState(): void {
    window.history.back();
  }
}
