import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

/**
 * Post Updating DTO
 */
export class UpdatePostDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @MinLength(1, { each: true })
  images: string[];

  @IsNotEmpty()
  text: string;
}
