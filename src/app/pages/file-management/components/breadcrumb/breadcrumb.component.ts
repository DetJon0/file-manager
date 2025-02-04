import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
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
  imports: [MatButtonModule, MatIcon],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly #route = inject(ActivatedRoute);

  #breadcrumbItemsIdFromRoute = toSignal(
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
    const ids = this.#breadcrumbItemsIdFromRoute();

    return this.#getBreadcrumbItemsFromIds(folders, ids);
  });

  constructor() {}

  selectFolder(folderId: string) {
    this.fileManagerStore.selectFolder(
      FolderUtilsService.getFolderFromId(
        this.fileManagerStore.folderListResource.value() ?? [],
        folderId,
      ),
    );
  }

  #getBreadcrumbItemsFromIds(
    folders: FolderWithNestedFolders[],
    breadcrumbItemIds: string[],
  ): BreadcrumbItem[] {
    let tempFolders = folders;
    console.log('🚀 ~ BreadcrumbComponent ~ tempFolders:', tempFolders);
    const breadcrumb = [HOME_ITEM];
    console.log('🚀 ~ BreadcrumbComponent ~ breadcrumb:', breadcrumb);

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
