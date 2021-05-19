import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * User Registration API Body
 */
export class RegisterUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
