import { inject, Injectable } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
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

  constructor() {}

  addNewFolder() {}
}
