import { UserRole } from './role.model';

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  token: string;
};
