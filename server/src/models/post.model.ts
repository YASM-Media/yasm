import { postIndex } from 'src/utils/algolia';
import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Image } from './image.model';
import { Like } from './like.model';
import { User } from './user.model';

/**
 * Post Type Enum Definition
 */
export enum PostType {
  Post = 'Post',
  Comment = 'Comment',
}

/**
 * Post Database Model.
 */
@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { default: PostType.Post })
  postType: PostType;

  @OneToMany(() => Image, (image) => image.post)
  images: Image[];

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Post, (post) => post.post)
  comments: Post[];

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterInsert()
  @AfterUpdate()
  private createOrUpdateAlgoliaRecord() {
    if (this.postType === PostType.Comment) {
      return;
    }

    const postRecord = {
      objectID: this.id,
      text: this.text,
    };

    postIndex
      .saveObject(postRecord)
      .then((data) => console.log(`Syncing Post ${data.objectID} To Algolia`))
      .catch((error) => console.log(error));
  }

  @BeforeRemove()
  private removeAlgoliaRecord() {
    postIndex
      .deleteObject(this.id)
      .then(() => `Removing Post ${this.id} From Algolia`)
      .catch((error) => console.log(error));
  }
}
