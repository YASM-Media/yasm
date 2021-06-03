import { IsUUID } from 'class-validator';

/**
 * DTO for comment deletion.
 */
export class DeleteCommentDto {
  @IsUUID()
  postId: string;

  @IsUUID()
  commentId: string;
}
