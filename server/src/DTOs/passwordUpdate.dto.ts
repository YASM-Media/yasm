import { IsNotEmpty } from 'class-validator';

/**
 * Password Update API Body
 */
export class PasswordUpdateDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
