import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-folder-tree',
  imports: [MatProgressSpinner, JsonPipe],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
})
export class FolderTreeComponent {
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  files = this.fileManagerStore.folderListResource;
}
