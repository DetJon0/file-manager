import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-file-icon',
  imports: [MatIcon],
  template: ` <mat-icon>{{ iconName() }}</mat-icon> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileIconComponent {
  mimeType = input.required<string>();

  iconName = computed(() => {
    switch (this.mimeType()) {
      case 'image/jpeg':
      case 'image/png':
        return 'image';
      case 'application/pdf':
        return 'picture_as_pdf';
      default:
        return 'description';
    }
  });
}
