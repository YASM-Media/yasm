import { IsNotEmpty } from 'class-validator';

export class ChatNotificationDto {
  @IsNotEmpty()
  public threadId: string;

  @IsNotEmpty()
  public message: string;
}
