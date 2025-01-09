export function buildFolderHierarchy<T extends { parentId: string; id: string }>(
  folders: T[],
  parentId = '0',
): Array<T & { folders: T[] }> {
  return folders
    .filter((folder) => folder.parentId === parentId)
    .map((folder: T) => ({
      ...folder,
      folders: buildFolderHierarchy(folders, folder.id) as T[],
    }));
}
