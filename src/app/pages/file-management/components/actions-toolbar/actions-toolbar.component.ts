import { ChangeDetectionStrategy, Component, inject, Injector } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbar } from '@angular/material/toolbar';
import { EMPTY, switchMap } from 'rxjs';
import { Folder } from '../../models/folder.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';
import { DeleteFolderDialogComponent } from '../delete-folder-dialog/delete-folder-dialog.component';
import { FolderFilterComponent } from '../folder-filter/folder-filter.component';
import { UploadFileDialogComponent } from '../upload-file-dialog/upload-file-dialog.component';
import { RoleDirective } from '../../../../core/directives/role.directive';

@Component({
  selector: 'app-actions-toolbar',
  imports: [
    MatToolbar,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    MatSelectModule,
    FolderFilterComponent,
    RoleDirective,
  ],
  templateUrl: './actions-toolbar.component.html',
  styleUrl: './actions-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsToolbarComponent {
  readonly folderManagerStore = inject(FileManagerContainerStoreService);
  readonly #injector = inject(Injector);
  readonly dialog = inject(MatDialog);

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

  onUploadFile(folder: Folder | null) {
    if (!folder) return;

    this.dialog.open(UploadFileDialogComponent, {
      disableClose: true,
      width: '400px',
      injector: this.#injector,
    });
  }
}
