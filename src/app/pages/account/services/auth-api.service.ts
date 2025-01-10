import { Injectable } from '@angular/core';
import { of, switchMap } from 'rxjs';
import { BaseApiService } from '../../../core/services/base-api.service';
import { LoginRequest } from '../models/login-request.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService extends BaseApiService {
  constructor() {
    super();
  }

  login(credentials: LoginRequest) {
    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      switchMap((users: User[]) => {
        const user = users.find(
          (user) =>
            user.email.toLowerCase() === credentials.email.toLowerCase() &&
            user.password === credentials.password,
        );

        if (!user) {
          throw new Error('Invalid credentials');
        }
        return of(user);
      }),
    );
  }
}
