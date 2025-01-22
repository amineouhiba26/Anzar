import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICustomUser } from '../custom-user.model';
import { CustomUserService } from '../service/custom-user.service';

@Component({
  templateUrl: './custom-user-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CustomUserDeleteDialogComponent {
  customUser?: ICustomUser;

  protected customUserService = inject(CustomUserService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
