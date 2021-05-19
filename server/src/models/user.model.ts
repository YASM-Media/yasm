import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
