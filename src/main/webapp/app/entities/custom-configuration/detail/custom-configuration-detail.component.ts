import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ICustomConfiguration } from '../custom-configuration.model';

@Component({
  selector: 'jhi-custom-configuration-detail',
  templateUrl: './custom-configuration-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class CustomConfigurationDetailComponent {
  customConfiguration = input<ICustomConfiguration | null>(null);

  previousState(): void {
    window.history.back();
  }
}
