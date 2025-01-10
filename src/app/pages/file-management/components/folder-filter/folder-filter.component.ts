import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-folder-filter',
  imports: [MatSelectModule, MatInputModule],
  templateUrl: './folder-filter.component.html',
  styleUrl: './folder-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderFilterComponent {
  readonly folderManagerStore = inject(FileManagerContainerStoreService);

  readonly searchFields = ['name', 'tags'];
  readonly searchFieldSelectCmp = viewChild<MatSelect>('searchFieldSelect');
  readonly searchTermInputCmp = viewChild<MatInput>('searchTermInput');

  constructor() {}

  onSearchTermChange(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value ?? '';
    this.folderManagerStore.updateFolderSearchParams({ searchTerm });
  }
  onSearchFieldChange(event: MatSelectChange) {
    const searchField = event.value;
    this.folderManagerStore.updateFolderSearchParams({ searchField });
  }
}
