import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { File } from '../../models/file.model';
import { FolderWithNestedFolders } from '../../models/folder-with-nested-folders.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { FileIconComponent } from '../file-icon/file-icon.component';

@Component({
  selector: 'app-folder-details',
  imports: [MatCard, MatIcon, FileIconComponent],
  templateUrl: './folder-details.component.html',
  styleUrl: './folder-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderDetailsComponent {
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly folderDetailsResource = this.fileManagerStore.folderDetailsResource;

  selectFolder(folder: FolderWithNestedFolders) {
    this.fileManagerStore.selectFolder(folder);
  }
  openFile(file: File) {
    console.log(file);
  }
}
