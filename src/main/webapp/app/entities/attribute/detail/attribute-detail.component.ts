import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAttribute } from '../attribute.model';

@Component({
  selector: 'jhi-attribute-detail',
  templateUrl: './attribute-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AttributeDetailComponent {
  attribute = input<IAttribute | null>(null);

  previousState(): void {
    window.history.back();
  }
}
