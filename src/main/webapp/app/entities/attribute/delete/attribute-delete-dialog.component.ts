import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAttribute } from '../attribute.model';
import { AttributeService } from '../service/attribute.service';

@Component({
  templateUrl: './attribute-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AttributeDeleteDialogComponent {
  attribute?: IAttribute;

  protected attributeService = inject(AttributeService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attributeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
