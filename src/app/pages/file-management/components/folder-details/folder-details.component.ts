import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { File } from '../../models/file.model';
import { FolderWithNestedFolders } from '../../models/folder-with-nested-folders.model';
import { Folder } from '../../models/folder.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { FileIconComponent } from '../file-icon/file-icon.component';
import { FilePreviewDialogComponent } from '../file-preview-dialog/file-preview-dialog.component';

@Component({
  selector: 'app-folder-details',
  imports: [MatCard, MatIcon, FileIconComponent, DragDropModule, MatCheckbox],
  templateUrl: './folder-details.component.html',
  styleUrl: './folder-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderDetailsComponent {
  readonly #dialog = inject(MatDialog);
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly folderDetailsResource = this.fileManagerStore.folderDetailsResource;
  readonly selectMode = this.fileManagerStore.selectMode;

  selectFolder(folder: FolderWithNestedFolders) {
    this.fileManagerStore.selectFolder(folder);
  }
  openFile(file: File) {
    this.#dialog.open(FilePreviewDialogComponent, {
      disableClose: true,
      width: '800px',
      data: file,
    });
  }

  onSelectElement(event: MatCheckboxChange, element: Folder | File) {
    if (event.checked) {
      this.fileManagerStore.selectElement(element);
    } else {
      this.fileManagerStore.deselectElement(element);
    }
  }
}
