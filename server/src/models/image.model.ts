import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.model';

/**
 * Image Database Model.
 */
@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.images)
  post: Post;

  @Column()
  imageUrl: string;
}
