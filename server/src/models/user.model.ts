import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Post } from './post.model';

/**
 * User Database model
 */
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: '' })
  biography: string;

  @Column({
    default: 'https://dummyimage.com/600x600/000/fff.jpg&text=Your+Image+Here',
  })
  imageUrl: string;

  @Column()
  emailAddress: string;

  @Column()
  password: string;

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  following: User[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
