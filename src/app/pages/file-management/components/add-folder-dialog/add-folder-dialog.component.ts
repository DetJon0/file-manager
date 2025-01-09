import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Folder } from '../../models/folder.model';
import { FileManagerContainerStoreService } from '../../services/file-manager-container-store.service';

@Component({
  selector: 'app-add-folder-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIcon,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-folder-dialog.component.html',
  styleUrl: './add-folder-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFolderDialogComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<AddFolderDialogComponent>);
  readonly #fb = inject(FormBuilder);
  readonly fileManagerStore = inject(FileManagerContainerStoreService);
  readonly data = inject<Folder>(MAT_DIALOG_DATA);

  form = this.#fb.nonNullable.group({
    name: ['', [Validators.required]],
    tags: [[] as string[]],
  });

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    }
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

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let sub;
    if (this.data) {
      sub = this.fileManagerStore.updateFolder(this.data, this.form.getRawValue());
    } else {
      sub = this.fileManagerStore.addNewFolder(this.form.getRawValue());
    }

    sub.subscribe((folder) => {
      this.onClose(folder);
    });
  }

  onClose(data: Folder | undefined = undefined) {
    this.#dialogRef.close(data);
  }
}
