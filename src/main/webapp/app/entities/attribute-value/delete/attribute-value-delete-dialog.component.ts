import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAttributeValue } from '../attribute-value.model';
import { AttributeValueService } from '../service/attribute-value.service';

@Component({
  templateUrl: './attribute-value-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AttributeValueDeleteDialogComponent {
  attributeValue?: IAttributeValue;

  protected attributeValueService = inject(AttributeValueService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attributeValueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
