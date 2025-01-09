import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { EMPTY, switchMap } from 'rxjs';
import { Folder } from '../../models/folder.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';
import { DeleteFolderDialogComponent } from '../delete-folder-dialog/delete-folder-dialog.component';

@Component({
  selector: 'app-actions-toolbar',
  imports: [MatToolbar, MatButton, MatIcon],
  templateUrl: './actions-toolbar.component.html',
  styleUrl: './actions-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsToolbarComponent {
  readonly #injector = inject(Injector);
  readonly dialog = inject(MatDialog);
  readonly folderManagerStore = inject(FileManagerContainerStoreService);

  onAddNewFolder() {
    this.dialog.open(AddFolderDialogComponent, {
      disableClose: true,
      width: '400px',
      injector: this.#injector,
    });
  }

  onRenameFolder(folder: Folder | null) {
    if (!folder) return;

    this.dialog.open(AddFolderDialogComponent, {
      disableClose: true,
      width: '400px',
      injector: this.#injector,
      data: folder,
    });
  }

  onDeleteFolder(folder: Folder | null) {
    if (!folder) return;

    const deleteRef = this.dialog.open(DeleteFolderDialogComponent, {
      disableClose: true,
      width: '400px',
    });

    deleteRef
      .afterClosed()
      .pipe(
        switchMap((isConfirmed: boolean) => {
          if (!isConfirmed) return EMPTY;

          return this.folderManagerStore.deleteFolder(folder);
        }),
      )
      .subscribe();
  }
}
