import { File } from './file.model';

export type FolderWithNestedFoldersAndFiles = {
  id: number;
  name: string;
  parentId: number;
  tags: string[];
  files: File[];
  folders: FolderWithNestedFoldersAndFiles[];
};
