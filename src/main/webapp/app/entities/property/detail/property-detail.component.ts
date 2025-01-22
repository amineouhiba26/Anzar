import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IProperty } from '../property.model';

@Component({
  selector: 'jhi-property-detail',
  templateUrl: './property-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class PropertyDetailComponent {
  property = input<IProperty | null>(null);

  previousState(): void {
    window.history.back();
  }
}
