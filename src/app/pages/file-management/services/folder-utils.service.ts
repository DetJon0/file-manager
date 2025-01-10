import { Injectable } from '@angular/core';
import { BreadcrumbItem } from '../models/breadcramb-item.model';
import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';

@Injectable()
export class FolderUtilsService {
  constructor() {}

  /**
   * Build a folder hierarchy from a flat list of folders
   * @param folders A flat list of folders that must contain parentId and id
   * @param parentId The root folder id, where the nesting will start (default is '0')
   * @returns An array of folders with nested folders according to the parentId
   */
  static buildFolderHierarchy<T extends { parentId: string; id: string }>(
    folders: T[],
    parentId = '0',
  ): Array<T & { folders: T[] }> {
    return folders
      .filter((folder) => folder.parentId === parentId)
      .map((folder: T) => ({
        ...folder,
        folders: FolderUtilsService.buildFolderHierarchy(folders, folder.id) as T[],
      }));
  }

  /**
   * Returns the path to a file in the folder hierarchy (from root to the file)
   * @param folders The list of folders to search for the file
   * @param targetFolder The folder to find the path to
   * @returns [BreadcrumbItem] or null if the folder is not found
   */
  static getPathToFile(
    folders: FolderWithNestedFolders[],
    targetFolder: FolderWithNestedFolders,
  ): BreadcrumbItem[] | null {
    let path: BreadcrumbItem[] = [];

    function findPath(
      currentFolders: FolderWithNestedFolders[],
      targetFolder: FolderWithNestedFolders,
    ): boolean {
      for (const folder of currentFolders) {
        path.push({ id: folder.id, name: folder.name });

        // Check if the file is in this folder
        if (folder.id === targetFolder.id) {
          return true;
        }

        // Recurse into child folders
        if (folder.folders && findPath(folder.folders, targetFolder)) {
          return true;
        }

        // Remove folder from path if not found in this branch
        path.pop();
      }
      return false;
    }

    const found = findPath(folders, targetFolder);
    return found ? path : null;
  }

  /**
   * Return the folder with the given id from the list of folders
   * @param folders List of folders to search with the given id
   * @param targetFolderId The id of the folder to find
   * @returns The folder with the given id or null if not found
   */
  static getFolderFromId(
    folders: FolderWithNestedFolders[],
    targetFolderId: string,
  ): FolderWithNestedFolders | null {
    for (const folder of folders) {
      if (folder.id === targetFolderId) {
        return folder;
      }

      if (folder.folders.length > 0) {
        const foundFolder = FolderUtilsService.getFolderFromId(folder.folders, targetFolderId);
        if (foundFolder) {
          return foundFolder;
        }
      }
    }
    return null;
  }
}
