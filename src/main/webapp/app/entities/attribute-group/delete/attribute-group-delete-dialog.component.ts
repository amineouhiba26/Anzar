import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAttributeGroup } from '../attribute-group.model';
import { AttributeGroupService } from '../service/attribute-group.service';

@Component({
  templateUrl: './attribute-group-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AttributeGroupDeleteDialogComponent {
  attributeGroup?: IAttributeGroup;

  protected attributeGroupService = inject(AttributeGroupService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.attributeGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
