import { File } from './file.model';
import { Folder } from './folder.model';

export type FolderWithNestedFoldersAndFiles = Folder & {
  files: File[];
  folders: FolderWithNestedFoldersAndFiles[];
};
