import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * User Login API Body
 */
export class LoginUserDto {
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
