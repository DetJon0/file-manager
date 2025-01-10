import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../pages/account/services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthService);
  const router = inject(Router);
  if (!authStore.isAuthenticated() && !authStore.autoLogin()) {
    return true;
  }

  return router.createUrlTree(['/']);
};
