import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/services/base-api.service';
import { FolderWithNestedFoldersAndFiles } from '../models/folder-with-nested-folders-and-files.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';

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
    return this.http.get<FolderWithNestedFolders[]>(`${this.baseUrl}/folders?_embed=folders`);
  }

  getFolderWithFilesAndFolders(id: string) {
    return this.http.get<FolderWithNestedFoldersAndFiles[]>(
      `${this.baseUrl}/folders/${id}?_embed=files&_embed=folders`,
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
