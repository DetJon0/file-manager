import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged, EMPTY } from 'rxjs';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { FoldersApiService } from './folders-api.service';

@Injectable()
export class FileManagerContainerStoreService {
  #folderService = inject(FoldersApiService);

  folderSearchTerm$ = new BehaviorSubject<string>('');
  folderSearchTerm = toSignal(
    this.folderSearchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
  );

  folderListResource = rxResource({
    request: () => this.folderSearchTerm(),
    loader: () => this.#folderService.getFolderWithNestedFolders(),
  });

  readonly #selectedFolder = signal<FolderWithNestedFolders | null>(null);
  selectedFolder = this.#selectedFolder.asReadonly();
  folderDetailsResource = rxResource({
    request: () => this.selectedFolder(),
    loader: ({ request }) =>
      request
        ? this.#folderService.getFolderWithFilesAndFolders({
            parentId: request.parentId.toString(),
            id: request.id.toString(),
          })
        : EMPTY,
  });

  constructor() {}

  addNewFolder() {}

  selectFolder(folder: FolderWithNestedFolders) {
    this.#selectedFolder.set(folder);
  }
}
