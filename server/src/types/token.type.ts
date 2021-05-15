import { User } from 'src/models/user.model';

export type Token = {
  accessToken: string;
  user: User;
};
