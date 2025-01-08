export type FolderWithNestedFolders = {
  id: number;
  name: string;
  parentId: number;
  tags: string[];
  folders: FolderWithNestedFolders[];
};
