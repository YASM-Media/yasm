import { userIndex } from './../utils/algolia';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
} from 'typeorm';
import { Like } from './like.model';
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

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @AfterInsert()
  @AfterUpdate()
  private createOrUpdateAlgoliaRecord() {
    const userRecord = {
      objectID: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
    };

    userIndex
      .saveObject(userRecord)
      .then((data) => console.log(`Syncing User ${data.objectID} To Algolia`))
      .catch((error) => console.log(error));
  }

  @BeforeRemove()
  private removeAlgoliaRecord() {
    userIndex
      .deleteObject(this.id)
      .then(() => `Removing User ${this.id} From Algolia`)
      .catch((error) => console.log(error));
  }
}
