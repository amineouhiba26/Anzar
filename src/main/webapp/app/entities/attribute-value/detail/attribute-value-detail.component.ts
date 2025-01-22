import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAttributeValue } from '../attribute-value.model';

@Component({
  selector: 'jhi-attribute-value-detail',
  templateUrl: './attribute-value-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AttributeValueDetailComponent {
  attributeValue = input<IAttributeValue | null>(null);

  previousState(): void {
    window.history.back();
  }
}
