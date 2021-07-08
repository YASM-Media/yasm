import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Google User Registration API Body
 */
export class RegisterGoogleUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  emailAddress: string;
}
