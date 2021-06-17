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

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}
