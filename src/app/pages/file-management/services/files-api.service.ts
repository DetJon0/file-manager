import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../core/services/base-api.service';
import { File } from '../models/file.model';

@Injectable({
  providedIn: 'root',
})
export class FilesApiService extends BaseApiService {
  constructor() {
    super();
  }

  getFiles() {
    return this.http.get<File[]>(`${this.baseUrl}/files`);
  }

  getFile(id: string) {
    return this.http.get<File>(`${this.baseUrl}/files/${id}`);
  }

  createFile(file: File) {
    return this.http.post(`${this.baseUrl}/files`, file);
  }

  updateFile(id: string, file: File) {
    return this.http.put(`${this.baseUrl}/files/${id}`, file);
  }

  searchFiles(query: string) {
    return this.http.get(`${this.baseUrl}/files/search?q=${query}`);
  }
}
