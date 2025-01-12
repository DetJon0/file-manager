import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/internal/operators/switchMap';
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
    return this.getFiles().pipe(
      switchMap((files) => {
        file.name = this.getFileUniqueName(file, files);

        return this.http.post<File>(`${this.baseUrl}/files`, file);
      }),
    );
  }

  updateFile(id: string, file: File) {
    return this.getFiles().pipe(
      switchMap((files) => {
        file.name = this.getFileUniqueName(file, files);

        return this.http.put(`${this.baseUrl}/files/${id}`, file);
      }),
    );
  }

  deleteFile(id: string) {
    return this.http.delete<File>(`${this.baseUrl}/files/${id}`);
  }

  moveFile(id: string, folderId: string) {
    return this.http.patch<File>(`${this.baseUrl}/files/${id}`, { folderId });
  }

  searchFiles(query: string) {
    return this.http.get(`${this.baseUrl}/files/search?q=${query}`);
  }

  getFileUniqueName(file: File, files: File[]) {
    let i = 1;
    let { name, suffix } = this.getNameAndSuffix(file.name);
    let fileName = name;
    while (
      files.find(
        (f) =>
          f.id !== file.id &&
          this.removeSuffix(f.name) === fileName &&
          f.folderId === file.folderId,
      )
    ) {
      fileName = `${name} (${i})`;
      i++;
    }
    return `${fileName}.${suffix}`;
  }
  getNameAndSuffix(fileName: string) {
    const nameAndSuffix = fileName.split('.');

    console.assert(nameAndSuffix.length !== 2, 'Invalid file name', fileName);

    return {
      name: nameAndSuffix.at(0)!,
      suffix: nameAndSuffix.at(1)!,
    };
  }
  removeSuffix(fileName: string) {
    return fileName.replace(/\..+/, '');
  }
}
