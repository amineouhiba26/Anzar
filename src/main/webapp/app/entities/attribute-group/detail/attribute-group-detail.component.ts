import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAttributeGroup } from '../attribute-group.model';

@Component({
  selector: 'jhi-attribute-group-detail',
  templateUrl: './attribute-group-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AttributeGroupDetailComponent {
  attributeGroup = input<IAttributeGroup | null>(null);

  previousState(): void {
    window.history.back();
  }
}
