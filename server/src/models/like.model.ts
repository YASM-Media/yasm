import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.model';
import { User } from './user.model';

/**
 * Like Database Model.
 */
@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}
