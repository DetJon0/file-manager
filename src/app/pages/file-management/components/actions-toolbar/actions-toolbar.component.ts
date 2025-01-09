import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';

@Component({
  selector: 'app-actions-toolbar',
  imports: [MatToolbar, MatIconButton, MatIcon],
  templateUrl: './actions-toolbar.component.html',
  styleUrl: './actions-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsToolbarComponent {
  readonly #injector = inject(Injector);
  readonly dialog = inject(MatDialog);
  readonly folderManagerStore = inject(FileManagerContainerStoreService);

  addNewFolder() {
    this.dialog.open(AddFolderDialogComponent, {
      disableClose: true,
      width: '400px',
      injector: this.#injector,
    });
  }
}
