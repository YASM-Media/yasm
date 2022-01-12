import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.model';

@Entity()
export class Story {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'character varying', nullable: false })
  public storyUrl: string;

  @ManyToOne(() => User, (user) => user.stories, { onDelete: 'CASCADE' })
  public user: User;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
