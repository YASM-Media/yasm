import { ActivityType } from 'src/enum/activity-type.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.model';
import { User } from './user.model';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  public id: string;

  @ManyToOne(() => User)
  public mainUser: User;

  @ManyToOne(() => User)
  public triggeredByUser: User;

  @Column()
  public activityType: ActivityType;

  @ManyToOne(() => Post)
  public post: Post;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
