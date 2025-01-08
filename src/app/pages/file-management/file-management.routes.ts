import { Routes } from '@angular/router';
import { FileManagerContainerComponent } from './containers/file-manager-container/file-manager-container.component';

export default [
  {
    path: '',
    component: FileManagerContainerComponent,
  },
] satisfies Routes;
