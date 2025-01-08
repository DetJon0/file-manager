import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-actions-toolbar',
  imports: [MatToolbar, MatIconButton, MatIcon],
  templateUrl: './actions-toolbar.component.html',
  styleUrl: './actions-toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsToolbarComponent {
  readonly folderManagerStore = inject(FileManagerContainerStoreService);

  addNewFolder() {
    this.folderManagerStore.addNewFolder();
  }
}
