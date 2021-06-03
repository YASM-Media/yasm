import { IsNotEmpty } from 'class-validator';

/**
 * Create Comment DTO
 */
export class CreateCommentDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  postId: string;
}
