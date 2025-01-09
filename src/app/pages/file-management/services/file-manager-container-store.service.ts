import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, distinctUntilChanged, EMPTY, tap } from 'rxjs';
import { AddFolderFormData } from '../models/add-folder.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';
import { FoldersApiService } from './folders-api.service';

@Injectable()
export class FileManagerContainerStoreService {
  readonly #snackBar = inject(MatSnackBar);
  readonly #folderService = inject(FoldersApiService);

  folderSearchTerm$ = new BehaviorSubject<string>('');
  folderSearchTerm = toSignal(
    this.folderSearchTerm$.pipe(debounceTime(300), distinctUntilChanged()),
  );

  folderListResource = rxResource<FolderWithNestedFolders[], string | undefined>({
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

  addNewFolder(addFolder: AddFolderFormData) {
    const folder: Folder = {
      name: addFolder.name,
      tags: addFolder.tags,
      id: Date.now().toString(),
      parentId: this.selectedFolder()?.id ?? '0',
    };

    return this.#folderService.createFolder(folder).pipe(
      tap({
        next: () => {
          //notify user

          this.#snackBar.open('Folder created Successfully', 'Close');

          this.folderListResource.reload();
          this.folderDetailsResource.reload();
        },
        error: (error) => {
          //notify user
          this.#snackBar.open(error.message ?? 'Failed to create folder', 'Close');
        },
      }),
    );
  }

  selectFolder(folder: FolderWithNestedFolders) {
    this.#selectedFolder.set(folder);
  }
}
