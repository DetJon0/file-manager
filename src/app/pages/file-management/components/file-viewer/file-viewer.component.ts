import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { File } from '../../models/file.model';

@Component({
  selector: 'app-file-viewer',
  imports: [],
  templateUrl: './file-viewer.component.html',
  styleUrl: './file-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewerComponent {
  readonly sanitizer = inject(DomSanitizer);

  file = input.required<File>();
  sanitizedContent = computed(() => {
    const file = this.file();
    return file && this.sanitizeFileContent(file);
  });
  downloadUrl = computed(() => {
    const file = this.file();
    return file && `data:${file.type};base64,${file.content}`;
  });

  constructor() {}

  isTextFile(file: File): boolean {
    return file.type === 'text/plain';
  }

  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  isPdfFile(file: File): boolean {
    return file.type === 'application/pdf';
  }

  isOfficeDocument(file: File): boolean {
    return [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    ].includes(file.type);
  }

  isIframeSupportedFile(file: File): boolean {
    return this.isTextFile(file) || this.isImageFile(file) || this.isPdfFile(file);
  }

  isUnsupportedFile(file: File): boolean {
    return !this.isIframeSupportedFile(file) && !this.isOfficeDocument(file);
  }

  private sanitizeFileContent(file: File): SafeResourceUrl | null {
    if (this.isTextFile(file) || this.isImageFile(file) || this.isPdfFile(file)) {
      const content = `data:${file.type};base64,${file.content}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(content);
    } else if (this.isOfficeDocument(file)) {
      const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
        `data:${file.type};base64,${file.content}`,
      )}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
    }
    return null;
  }
}
