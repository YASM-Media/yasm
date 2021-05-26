import { IsUUID, IsNotEmpty } from 'class-validator';

/**
 * DTO for Post Deletion.
 */
export class DeletePostDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
