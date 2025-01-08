import { Folder } from './folder.model';

export type FolderWithNestedFolders = Folder & {
  folders: FolderWithNestedFolders[];
};
