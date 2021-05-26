import { IsNotEmpty, MinLength } from 'class-validator';

/**
 * Post Creation DTO
 */
export class CreatePostDto {
  @MinLength(1, { each: true })
  images: string[];

  @IsNotEmpty()
  text: string;
}
