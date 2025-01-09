import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-folder-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-folder-dialog.component.html',
  styleUrl: './delete-folder-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFolderDialogComponent {}
