import { FolderWithNestedFolders } from '../models/folder-with-nested-folders.model';
import { Folder } from '../models/folder.model';

export function buildFolderHierarchy(folders: Folder[], parentId = '0'): FolderWithNestedFolders[] {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .map(
      (folder: Folder) =>
        ({
          ...folder,
          folders: buildFolderHierarchy(folders, folder.id),
        }) satisfies FolderWithNestedFolders,
    );
}
