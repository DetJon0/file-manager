import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../../../core/compoenents/page-title/page-title.component';
import { ActionsToolbarComponent } from '../../components/actions-toolbar/actions-toolbar.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FolderDetailsComponent } from '../../components/folder-details/folder-details.component';
import { FolderTreeComponent } from '../../components/folder-tree/folder-tree.component';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-file-manager-container',
  imports: [
    ActionsToolbarComponent,
    FolderTreeComponent,
    FolderDetailsComponent,
    BreadcrumbComponent,
    PageTitleComponent,
  ],
  templateUrl: './file-manager-container.component.html',
  styleUrl: './file-manager-container.component.scss',
  providers: [FileManagerContainerStoreService],
})
export class FileManagerContainerComponent {
  fileManagerStore = inject(FileManagerContainerStoreService);

  files = this.fileManagerStore.folderListResource;

  constructor() {}
}