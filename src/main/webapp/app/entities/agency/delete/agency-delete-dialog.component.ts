import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAgency } from '../agency.model';
import { AgencyService } from '../service/agency.service';

@Component({
  templateUrl: './agency-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AgencyDeleteDialogComponent {
  agency?: IAgency;

  protected agencyService = inject(AgencyService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.agencyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
