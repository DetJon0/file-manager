import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { File } from '../../models/file.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';
import { getFileBase64ContentOnly } from '../../utils/get-file-base64-content-only.fn';
import { AddFolderDialogComponent } from '../add-folder-dialog/add-folder-dialog.component';

@Component({
  selector: 'app-upload-file-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIcon,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './upload-file-dialog.component.html',
  styleUrl: './upload-file-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadFileDialogComponent {
  readonly #dialogRef = inject(MatDialogRef<AddFolderDialogComponent>);
  readonly #fb = inject(FormBuilder);
  readonly fileManagerStore = inject(FileManagerContainerStoreService);

  form = this.#fb.nonNullable.group({
    file: [null as File | null, Validators.required],
    tags: [[] as string[]],
  });

  ngOnInit(): void {}

  async onUploadFile(event: Event) {
    const uploadedFile = (event.target as HTMLInputElement).files?.[0];

    if (!uploadedFile) return;

    const content = await getFileBase64ContentOnly(uploadedFile);

    this.form.controls.file.patchValue({
      id: Date.now().toString(),
      name: uploadedFile.name,
      type: uploadedFile.type,
      folderId: this.fileManagerStore.selectedFolder()?.id ?? '0',
      content,
      tags: [],
    });
  }

  removeTag(tag: string) {
    this.form.controls.tags.setValue(
      this.form.controls.tags.value.filter((t: string) => t !== tag),
    );
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.form.controls.tags.setValue([...this.form.controls.tags.value, value]);
    }

    event.chipInput!.clear();
  }

  openFileUploader(fileInput: HTMLInputElement) {
    this.form.controls.file.setValue(null);
    fileInput.files = null;
    fileInput.click();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.fileManagerStore
      .uploadFile({
        ...this.form.getRawValue().file!,
        tags: this.form.controls.tags.getRawValue(),
      })
      .subscribe((file) => {
        this.onClose(file);
      });
  }

  onClose(data: File | undefined = undefined) {
    this.#dialogRef.close(data);
  }
}
