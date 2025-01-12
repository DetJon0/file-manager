import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { LogoutConfirmDialogComponent } from '../../../../pages/account/components/logout-confirm-dialog/logout-confirm-dialog.component';
import { AuthService } from '../../../../pages/account/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  readonly #authService = inject(AuthService);
  readonly #dialog = inject(MatDialog);
  readonly activeUser = this.#authService.user;

  menuItems: {
    label: string;
    icon: string;
    link: string;
  }[] = [];

  onLogout() {
    const deleteRef = this.#dialog.open(LogoutConfirmDialogComponent, {
      disableClose: true,
      width: '400px',
    });

    deleteRef.afterClosed().subscribe((isConfirmed: boolean) => {
      if (!isConfirmed) return;

      this.#authService.logout();
      this.#authService.redirectToLogin();
    });
  }
}
