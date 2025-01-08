import { UserRole } from './role.model';

export type Root = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
