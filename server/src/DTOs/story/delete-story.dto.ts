import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStoryDto {
  @IsNotEmpty()
  @IsUUID()
  public storyId: string;
}
