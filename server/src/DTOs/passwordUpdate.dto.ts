import { IsNotEmpty } from 'class-validator';

export class PasswordUpdateDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
