import { IsEmpty, IsNotEmpty, MinLength } from 'class-validator';

/**
 * Create Comment DTO
 */
export class CreateCommentDto {
  @MinLength(0, { each: true })
  images: string[];

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  postId: string;
}
