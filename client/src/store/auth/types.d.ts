import { User } from '../../models/user.model';

export type AuthState = {
  loggedInUser: User;
  isLoggedIn: boolean;
};

export type AuthAction = {
  type: string;
  user: User;
};
