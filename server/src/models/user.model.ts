import { Story } from './story.model';
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
@Entity({ name: 'yasm_user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'character varying', nullable: false })
  firstName: string;

  @Column({ type: 'character varying', nullable: false })
  lastName: string;

  @Column({ type: 'text', default: '', nullable: false })
  biography: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'character varying',
    nullable: false,
  })
  emailAddress: string;

  @ManyToMany(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinTable()
  following: User[];

  @OneToMany(() => Post, (post) => post.user, { cascade: true })
  posts: Post[];

  @OneToMany(() => Story, (story) => story.user, { cascade: true })
  stories: Story[];

  @OneToMany(() => Like, (like) => like.user, { cascade: true })
  likes: Like[];

  @AfterInsert()
  @AfterUpdate()
  private createOrUpdateAlgoliaRecord() {
    const userRecord = {
      objectID: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      biography: this.biography,
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
