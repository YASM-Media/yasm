import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Email Address Update API Body
 */
export class EmailUpdateDto {
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
