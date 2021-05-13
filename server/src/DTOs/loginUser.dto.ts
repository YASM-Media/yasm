import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
