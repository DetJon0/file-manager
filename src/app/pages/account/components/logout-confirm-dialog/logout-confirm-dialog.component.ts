import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './logout-confirm-dialog.component.html',
  styleUrl: './logout-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutConfirmDialogComponent {}
