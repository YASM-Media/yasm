import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.model';

const getSevenDaysLater = (): Date => {
  const date = new Date();
  date.setDate(date.getDate() + 7);

  return date;
};

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refreshToken: string;

  @Column({ type: 'timestamptz', default: getSevenDaysLater() })
  validUntil: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
