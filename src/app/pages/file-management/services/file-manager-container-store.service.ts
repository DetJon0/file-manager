import { inject, Injectable, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, debounceTime, distinctUntilChanged, EMPTY, Observable, tap } from 'rxjs';
import { AddFolderFormData } from '../models/add-folder.model';
import { File } from '../models/file.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';
import { SearchParams } from '../models/search-params.model';
import {
  BREADCRUMB_QUERY_PARAM_KEY,
  BREADCRUMB_QUERY_PARAM_SEPARATOR,
} from '../utils/breadcrumb.consts';
import { FilesApiService } from './files-api.service';
import { FolderUtilsService } from './folder-utils.service';
import { FoldersApiService } from './folders-api.service';

@Injectable()
export class FileManagerContainerStoreService {
  readonly #snackBar = inject(MatSnackBar);
  readonly #folderService = inject(FoldersApiService);
  readonly #fileService = inject(FilesApiService);
  readonly #router = inject(Router);

  #folderSearchParams$ = new BehaviorSubject<Partial<SearchParams>>({});
  folderSearchParams = toSignal(
    this.#folderSearchParams$.pipe(debounceTime(300), distinctUntilChanged()),
  );

  folderListResource = rxResource({
    request: () => this.folderSearchParams(),
    loader: ({ request, abortSignal }) =>
      this.#folderService.getFolderWithNestedFolders(request, abortSignal),
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

  readonly #selectMode = signal(false);
  readonly selectMode = this.#selectMode.asReadonly();
  readonly selectedElements = new Set<File | Folder>();

  constructor() {}

  updateFolderSearchParams(searchParams: Partial<SearchParams>) {
    this.#folderSearchParams$.next({ ...this.#folderSearchParams$.value, ...searchParams });
  }

  addNewFolder(addFolder: AddFolderFormData) {
    const folder: Folder = {
      ...addFolder,
      id: Date.now().toString(),
      parentId: this.selectedFolder()?.id ?? '0',
    };

    return this.#folderService.createFolder(folder).pipe(
      tap({
        next: () => {
          this.#snackBar.open('Folder created Successfully', 'Close');

          this.folderListResource.reload();
          this.folderDetailsResource.reload();
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to create folder', 'Close');
        },
      }),
    );
  }

  updateFolder(oldFolder: Folder, newChanges: AddFolderFormData) {
    const folder: Folder = {
      ...oldFolder,
      ...newChanges,
    };

    return this.#folderService.updateFolder(folder.id, folder).pipe(
      tap({
        next: () => {
          this.#snackBar.open('Folder updated Successfully', 'Close');

          this.folderListResource.update((old) =>
            old?.map((f) => (f.id === folder.id ? { ...f, ...folder } : f)),
          );
          this.#selectedFolder.update((x) => ({ ...x!, ...folder }));
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to update folder', 'Close');
        },
      }),
    );
  }

  deleteFolder(folder: Folder) {
    if (this.selectMode()) {
      return this.batchDelete();
    }
    return this.#folderService.deleteFolder(folder.id).pipe(
      tap({
        next: () => {
          this.#snackBar.open('Folder deleted Successfully', 'Close');

          this.folderListResource.update((old) => old?.filter((f) => f.id !== folder.id));
          this.folderDetailsResource.reload();
          this.#selectedFolder.set(null);
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to delete folder', 'Close');
        },
      }),
    );
  }
  deleteFile(file: File) {
    if (this.selectMode()) {
      return this.batchDelete();
    }
    return this.#fileService.deleteFile(file.id).pipe(
      tap({
        next: () => {
          this.#snackBar.open('File deleted Successfully', 'Close');

          this.folderDetailsResource.reload();
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to delete file', 'Close');
        },
      }),
    );
  }

  uploadFile(file: File) {
    return this.#fileService.createFile(file).pipe(
      tap({
        next: () => {
          this.#snackBar.open('File uploaded Successfully', 'Close');

          this.folderDetailsResource.reload();
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to upload file', 'Close');
        },
      }),
    );
  }

  toggleSelectMode() {
    this.#selectMode.update((x) => !x);
    this.selectedElements.clear();
  }
  selectElement(element: Folder | File) {
    this.selectedElements.add(element);
  }
  deselectElement(element: Folder | File) {
    this.selectedElements.delete(element);
  }

  batchDelete() {
    return this.#folderService.batchDeleteFoldersAndFiles([...this.selectedElements]).pipe(
      tap({
        next: () => {
          this.#snackBar.open('Folders and Files deleted Successfully', 'Close');

          this.folderListResource.reload();
          this.folderDetailsResource.reload();
          this.toggleSelectMode();
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to delete folders and files', 'Close');
        },
      }),
    );
  }

  selectFolder(folder: FolderWithNestedFolders | null) {
    if (this.#selectMode()) return;

    const path = folder
      ? (FolderUtilsService.getPathToFile(this.folderListResource.value() ?? [], folder) ?? [])
      : [];

    const queryParamIdPath = path.map((item) => item.id).join(BREADCRUMB_QUERY_PARAM_SEPARATOR);
    this.#router.navigate([], { queryParams: { [BREADCRUMB_QUERY_PARAM_KEY]: queryParamIdPath } });

    this.#selectedFolder.set(folder);
  }

  moveFolderOrFile(draggedData: Folder | File, targetFolderId: string): Observable<unknown> {
    if (this.selectMode()) {
      return this.#folderService
        .batchMoveFoldersAndFiles([...this.selectedElements], targetFolderId)
        .pipe(
          tap({
            next: () => {
              this.#snackBar.open('Files and folders moved Successfully', 'Close');

              this.folderListResource.reload();
              this.folderDetailsResource.reload();
              this.toggleSelectMode();
            },
            error: (error) => {
              this.#snackBar.open(error.message ?? 'Failed to move files and Folders', 'Close');
            },
          }),
        );
    }

    let obs: Observable<Folder | File>;
    if ('type' in draggedData) {
      // file
      obs = this.#fileService.moveFile(draggedData.id, targetFolderId);
    } else {
      // folder
      obs = this.#folderService.moveFolder(draggedData.id, targetFolderId);
    }

    return obs.pipe(
      tap({
        next: () => {
          this.#snackBar.open('File moved Successfully', 'Close');

          this.folderListResource.reload();
          this.folderDetailsResource.reload();
        },
        error: (error) => {
          this.#snackBar.open(error.message ?? 'Failed to move file', 'Close');
        },
      }),
    );
  }
}
