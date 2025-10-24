export type UserMode = 'anonymous' | 'registered';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  mode: UserMode;
}
