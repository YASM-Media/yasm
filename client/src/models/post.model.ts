import { Image } from './image.model';
import { Like } from './like.model';
import { User } from './user.model';

export class Post {
  constructor(
    public id: string,
    public text: string,
    public createdAt: Date,
    public user: User,
    public images: Image[],
    public likes: Like[]
  ) {}
}
