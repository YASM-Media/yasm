import { User } from './user.model';

export class Like {
  constructor(public id: string, public user: User) {}
}
