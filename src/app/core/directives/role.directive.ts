import { Directive, OnInit, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';
import { UserRole } from '../../pages/account/models/role.model';
import { AuthService } from '../../pages/account/services/auth.service';

@Directive({
  selector: '[appRole]',
})
export class RoleDirective implements OnInit {
  appRole = input<UserRole[]>([]);
  appRoleCondition = input<'include' | 'except'>('include');

  readonly #viewContainerRef = inject(ViewContainerRef);
  readonly #templateRef = inject(TemplateRef<any>);
  readonly #authStore = inject(AuthService);
  constructor() {}

  ngOnInit(): void {
    const userRole = this.#authStore.user()?.role;
    const condition = this.appRoleCondition();
    const directiveRoles = this.appRole();
    (
      condition === 'include'
        ? directiveRoles.every((role) => userRole !== role) //if all don't have the role the role
        : directiveRoles.some((role) => userRole === role)
    )
      ? // if one has the role
        this.#viewContainerRef.clear()
      : this.#viewContainerRef.createEmbeddedView(this.#templateRef);
  }
}
