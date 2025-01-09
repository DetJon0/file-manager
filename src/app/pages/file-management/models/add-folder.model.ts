import { Folder } from './folder.model';

export type AddFolderFormData = Pick<Folder, 'name' | 'tags'>;
