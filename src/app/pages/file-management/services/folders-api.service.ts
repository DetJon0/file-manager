import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { FolderWithNestedFoldersAndFiles } from '../models/folder-with-nested-folders-and-files.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';
import { SearchParams } from '../models/search-params.model';
import { buildFolderHierarchy } from '../utils/build-folder-hierarchy.fn';

@Injectable({
  providedIn: 'root',
})
export class FoldersApiService extends BaseApiService {
  constructor() {
    super();
  }

  getFolders() {
    return this.http.get<Folder[]>(`${this.baseUrl}/folders`);
  }

  getFolderWithNestedFolders(
    searchParams: Partial<SearchParams> | undefined,
    abortSignal: AbortSignal,
  ): Observable<FolderWithNestedFolders[]> {
    const stopRequest$ = new Subject<void>();

    abortSignal.onabort = () => {
      console.log('Request aborted');
      stopRequest$.next();
    };

    let params = new HttpParams();
    let searchField = searchParams?.searchField ?? 'name';

    if (searchParams?.searchTerm) {
      params = params.set(searchField === 'name' ? 'name' : 'tags[0]', searchParams.searchTerm);
    }

    return this.http
      .get<FolderWithNestedFolders[]>(`${this.baseUrl}/folders`, {
        params,
      })
      .pipe(
        takeUntil(stopRequest$),
        map((folders) => buildFolderHierarchy(folders)),
      );
  }

  getFolderWithFilesAndFolders({
    parentId,
    id,
  }: {
    parentId: string;
    id: string;
  }): Observable<FolderWithNestedFoldersAndFiles | undefined> {
    return this.http
      .get<FolderWithNestedFoldersAndFiles[]>(`${this.baseUrl}/folders?_embed=files`)
      .pipe(
        map((folders) =>
          buildFolderHierarchy<FolderWithNestedFoldersAndFiles>(folders, parentId).find(
            (x) => x.id === id,
          ),
        ),
      );
  }

  getFolder(id: string) {
    return this.http.get<FolderWithNestedFoldersAndFiles>(
      `${this.baseUrl}/folders/${id}?_embed=files&_embed=folders`,
    );
  }

  createFolder(folder: Folder) {
    return this.getFolders().pipe(
      switchMap((folders) => {
        if (
          folders.find(
            (f) => f.id !== folder.id && f.name === folder.name && f.parentId === folder.parentId,
          )
        ) {
          throw new Error('Folder with this name already exists. Choose a different name.');
        }
        return this.http.post<Folder>(`${this.baseUrl}/folders`, folder);
      }),
    );
  }

  updateFolder(id: string, folder: Folder) {
    return this.getFolders().pipe(
      switchMap((folders) => {
        if (
          folders.find(
            (f) => f.id !== folder.id && f.name === folder.name && f.parentId === folder.parentId,
          )
        ) {
          throw new Error('Folder with this name already exists. Choose a different name.');
        }
        return this.http.put<Folder>(`${this.baseUrl}/folders/${id}`, folder);
      }),
    );
  }

  deleteFolder(id: string) {
    return this.http.delete<Folder>(`${this.baseUrl}/folders/${id}`);
  }

  searchFolders(query: string) {
    return this.http.get(`${this.baseUrl}/folders/search?q=${query}`);
  }
}
