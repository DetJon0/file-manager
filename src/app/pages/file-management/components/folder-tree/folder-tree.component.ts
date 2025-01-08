import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { FolderWithNestedFolders } from '../../models/folder-with-nested-folders.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-folder-tree',
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './folder-tree.component.html',
  styleUrl: './folder-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderTreeComponent {
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly files = this.fileManagerStore.folderListResource;
  readonly selectedFolder = this.fileManagerStore.selectedFolder;

  readonly childrenAccessor = (node: FolderWithNestedFolders) => node.folders ?? [];
  readonly hasChild = (_: number, node: FolderWithNestedFolders) =>
    !!node.folders && node.folders.length > 0;

  onFolderClick($event: MouseEvent, folder: FolderWithNestedFolders) {
    $event.stopPropagation();
    this.fileManagerStore.selectFolder(folder);
  }
}
