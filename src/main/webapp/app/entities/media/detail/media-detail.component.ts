import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IMedia } from '../media.model';

@Component({
  selector: 'jhi-media-detail',
  templateUrl: './media-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class MediaDetailComponent {
  media = input<IMedia | null>(null);

  previousState(): void {
    window.history.back();
  }
}
