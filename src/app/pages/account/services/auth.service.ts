import { computed, inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';
import { AuthApiService } from './auth-api.service';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #authApiService = inject(AuthApiService);
  readonly #authStorageService = inject(AuthStorageService);
  readonly #snackBar = inject(MatSnackBar);
  readonly #router = inject(Router);

  user = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.user());

  constructor() {}

  login(value: LoginRequest) {
    return this.#authApiService.login(value).pipe(
      tap({
        next: (user) => this.onLoginSuccess(user),
        error: (error) => {
          this.#snackBar.open(error.message || 'Invalid credentials', 'Close');
        },
      }),
    );
  }

  autoLogin() {
    let user = this.#authStorageService.getUserFromLocalStorage();
    if (!user) {
      return false;
    }

    this.user.set(user);
    return true;
  }

  onLoginSuccess(user: User) {
    this.user.set(user);
    this.#authStorageService.saveLoggedInUser(user);
    this.#router.navigateByUrl('/');
  }

  logout() {
    this.user.set(null);
    this.#authStorageService.removeLoggedInUser();
  }
  redirectToLogin() {
    return this.#router.navigateByUrl('/login');
  }
}
