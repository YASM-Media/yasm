import { IsNotEmpty, IsUrl } from 'class-validator';

/**
 * User Profile Update API Body
 */
export class ProfileDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  biography: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;
}
