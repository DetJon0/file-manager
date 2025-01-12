import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { File } from '../../models/file.model';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';

@Component({
  selector: 'app-file-preview-dialog',
  imports: [FileViewerComponent, MatDialogModule, MatButtonModule],
  templateUrl: './file-preview-dialog.component.html',
  styleUrl: './file-preview-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePreviewDialogComponent {
  readonly file = inject<File>(MAT_DIALOG_DATA);
}
