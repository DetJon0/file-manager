import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  readonly #userKey = 'userData';

  constructor() {}

  saveLoggedInUser(user: User) {
    localStorage.setItem(this.#userKey, JSON.stringify(user));
  }
  getUserFromLocalStorage() {
    const user = localStorage.getItem(this.#userKey);

    return user ? (JSON.parse(user) as User) : null;
  }
  removeLoggedInUser() {
    localStorage.removeItem(this.#userKey);
  }
}
