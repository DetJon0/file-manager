import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { FolderWithNestedFoldersAndFiles } from '../models/folder-with-nested-folders-and-files.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';
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

  getFolderWithNestedFolders(): Observable<FolderWithNestedFolders[]> {
    return this.http
      .get<FolderWithNestedFolders[]>(`${this.baseUrl}/folders`)
      .pipe(map((folders) => buildFolderHierarchy(folders)));
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
    return this.http.post(`${this.baseUrl}/folders`, folder);
  }

  updateFolder(id: string, folder: Folder) {
    return this.http.put(`${this.baseUrl}/folders/${id}`, folder);
  }

  searchFolders(query: string) {
    return this.http.get(`${this.baseUrl}/folders/search?q=${query}`);
  }
}
