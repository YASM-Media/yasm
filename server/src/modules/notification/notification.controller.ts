import { User } from './../../models/user.model';
import { ChatNotificationDto } from './../../DTOs/notification/chat-notification.dto';
import { FirebaseAuthGuard } from 'src/guards/firebase-auth.guard';
import { NotificationService } from './notification.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoggedInUser } from 'src/decorators/logged-in-user.decorator';

@Controller('notification')
@UseGuards(FirebaseAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('chat')
  public async sendChatNotification(
    @Body() chatNotificationDto: ChatNotificationDto,
    @LoggedInUser() user: User,
  ): Promise<void> {
    await this.notificationService.handleChatNotifications(
      user,
      chatNotificationDto,
    );
  }
}
