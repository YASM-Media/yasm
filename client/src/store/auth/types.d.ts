import { User } from '../../models/user.model';

export type AuthState = {
  loggedInUser: User;
};

export type AuthAction = {
  type: string;
  user: User;
};

export type DispatchType = (args: AuthAction) => AuthAction;
