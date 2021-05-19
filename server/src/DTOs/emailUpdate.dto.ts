import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailUpdateDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
