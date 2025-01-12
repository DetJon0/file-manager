import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { File } from '../../models/file.model';
import { FolderWithNestedFolders } from '../../models/folder-with-nested-folders.model';
import { Folder } from '../../models/folder.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-folder-tree',
  imports: [MatTreeModule, MatButtonModule, MatIconModule, DragDropModule],
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

  onDrop(event: CdkDragDrop<any, any, Folder | File>, node: FolderWithNestedFolders) {
    const draggedData = event.item.data; // Data being dragged
    console.log('Dropped item:', draggedData, 'on node:', node.name);
    // Add logic to update the tree data structure here

    this.fileManagerStore.moveFolderOrFile(draggedData, node.id).subscribe();
  }
}
