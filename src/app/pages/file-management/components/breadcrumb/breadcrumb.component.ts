import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { BreadcrumbItem } from '../../models/breadcramb-item.model';
import { FolderWithNestedFolders } from '../../models/folder-with-nested-folders.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { FolderUtilsService } from '../../services/folder-utils.service';
import {
  BREADCRUMB_QUERY_PARAM_KEY,
  BREADCRUMB_QUERY_PARAM_SEPARATOR,
  HOME_ITEM,
} from '../../utils/breadcrumb.consts';

@Component({
  selector: 'app-breadcrumb',
  imports: [JsonPipe, MatButtonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly #route = inject(ActivatedRoute);

  breadcrumbItems = computed(() => {
    const folders = this.fileManagerStore.folderListResource.value() ?? [];
    const currentFolder = this.fileManagerStore.selectedFolder();

    return this.getBreadcrumbItems(folders, currentFolder);
  });
  breadcrumbItemsIdFromRoute = toSignal(
    this.#route.queryParamMap.pipe(
      map(
        (params) =>
          params.get(BREADCRUMB_QUERY_PARAM_KEY)?.split(BREADCRUMB_QUERY_PARAM_SEPARATOR) ?? [],
      ),
    ),
    { initialValue: [] },
  );
  breadcrumbItemsFromRoute = computed(() => {
    const folders = this.fileManagerStore.folderListResource.value() ?? [];
    const ids = this.breadcrumbItemsIdFromRoute();

    return this.#getBreadcrumbItemsFromIds(folders, ids);
  });

  constructor() {}

  selectFolder(folderId: string) {
    const a = FolderUtilsService.getFolderFromId(
      this.fileManagerStore.folderListResource.value() ?? [],
      folderId,
    )!;
    console.log('🚀 ~ BreadcrumbComponent ~ selectFolder ~ a:', a);
    this.fileManagerStore.selectFolder(a);
  }

  getBreadcrumbItems(
    folders: FolderWithNestedFolders[],
    currentFolder: FolderWithNestedFolders | null,
  ): BreadcrumbItem[] {
    if (!currentFolder) {
      return [HOME_ITEM];
    }

    const path = FolderUtilsService.getPathToFile(folders, currentFolder);
    return path ? [HOME_ITEM, ...path] : [HOME_ITEM];
  }

  #getBreadcrumbItemsFromIds(
    folders: FolderWithNestedFolders[],
    breadcrumbItemIds: string[],
  ): BreadcrumbItem[] {
    let tempFolders = folders;
    const breadcrumb = [HOME_ITEM];

    for (const id of breadcrumbItemIds) {
      const folder = tempFolders.find((f) => f.id === id);
      console.assert(
        !folder,
        'Query param breadcrumbItems contains invalid value/order of folder id',
        id,
      );
      if (folder) {
        breadcrumb.push({ id: folder.id, name: folder.name });
        tempFolders = folder.folders;
      }
    }
    return breadcrumb;
  }
}
