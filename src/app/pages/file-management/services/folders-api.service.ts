import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { FolderWithNestedFoldersAndFiles } from '../models/folder-with-nested-folders-and-files.model';
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

  getFolderWithNestedFolders() {
    return this.http
      .get<Folder[]>(`${this.baseUrl}/folders`)
      .pipe(map((folders) => buildFolderHierarchy(folders)));
  }

  getFolderWithFilesAndFolders(id: string) {
    return this.http
      .get<FolderWithNestedFoldersAndFiles[]>(`${this.baseUrl}/folders/${id}?_embed=files`)
      .pipe(map((folders) => buildFolderHierarchy(folders)));
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
