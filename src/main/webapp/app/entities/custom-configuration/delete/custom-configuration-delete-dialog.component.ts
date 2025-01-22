import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICustomConfiguration } from '../custom-configuration.model';
import { CustomConfigurationService } from '../service/custom-configuration.service';

@Component({
  templateUrl: './custom-configuration-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CustomConfigurationDeleteDialogComponent {
  customConfiguration?: ICustomConfiguration;

  protected customConfigurationService = inject(CustomConfigurationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customConfigurationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
