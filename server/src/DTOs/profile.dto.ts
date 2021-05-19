import { IsNotEmpty, IsUrl } from 'class-validator';

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
