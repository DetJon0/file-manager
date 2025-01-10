import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/account/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthService);
  const router = inject(Router);

  if (!authStore.isAuthenticated() && !authStore.autoLogin()) {
    return router.createUrlTree(['/', 'login']);
  }
  return true;
};
