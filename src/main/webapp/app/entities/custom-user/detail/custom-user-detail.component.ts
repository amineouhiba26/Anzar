import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ICustomUser } from '../custom-user.model';

@Component({
  selector: 'jhi-custom-user-detail',
  templateUrl: './custom-user-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class CustomUserDetailComponent {
  customUser = input<ICustomUser | null>(null);

  previousState(): void {
    window.history.back();
  }
}
