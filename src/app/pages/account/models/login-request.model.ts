import { User } from './user.model';

export type LoginRequest = {
  email: User['email'];
  password: User['password'];
};
