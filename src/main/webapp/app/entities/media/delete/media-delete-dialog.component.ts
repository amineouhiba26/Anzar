import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMedia } from '../media.model';
import { MediaService } from '../service/media.service';

@Component({
  templateUrl: './media-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MediaDeleteDialogComponent {
  media?: IMedia;

  protected mediaService = inject(MediaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mediaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
