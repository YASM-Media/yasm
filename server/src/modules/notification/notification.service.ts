import { ChatNotificationDto } from './../../DTOs/notification/chat-notification.dto';
import { FirebaseService } from './../firebase/firebase.service';
import { Injectable } from '@nestjs/common';
import { User } from 'src/models/user.model';

@Injectable()
export class NotificationService {
  constructor(private readonly firebaseService: FirebaseService) {}

  public async handleChatNotifications(
    user: User,
    chatNotificationDto: ChatNotificationDto,
  ): Promise<void> {
    const filteredParticipants = await this.fetchParticipantsByThreads(
      chatNotificationDto.threadId,
      user,
    );

    const fcmTokens = await this.fetchFcmTokensByUserIds(filteredParticipants);

    if (fcmTokens.length === 0) {
      return;
    }

    await this.sendNotification(
      fcmTokens,
      {
        thread: chatNotificationDto.threadId,
        user: user.id,
        type: 'chat',
      },
      {
        title: `${user.firstName} ${user.lastName} sent you a message!`,
        body: chatNotificationDto.message,
      },
    );
  }

  private async fetchParticipantsByThreads(
    threadId: string,
    user: User,
  ): Promise<string[]> {
    const thread = await this.fetchChatThread(threadId);

    const participants = thread['participants'];
    const filteredParticipants = participants.filter(
      (participant) => participant !== user.id,
    );

    return filteredParticipants;
  }

  private async fetchFcmTokensByUserIds(userIds: string[]): Promise<string[]> {
    const fcmTokens = [];

    const fcmTokensDocs = await this.firebaseService.firebaseFirestore
      .collection('tokens')
      .where('id', 'in', userIds)
      .get();

    fcmTokensDocs.forEach((document) => {
      fcmTokens.push(document.data()['token']);
    });

    return fcmTokens;
  }

  private async sendNotification(
    recipientIds: string[],
    data: any,
    notification: { title: string; body: string },
  ): Promise<void> {
    const fcmTokens = await this.fetchFcmTokensByUserIds(recipientIds);

    await this.firebaseService.firebaseMessaging.sendToDevice(
      fcmTokens,
      {
        data: data,
        notification: notification,
      },
      {
        contentAvailable: true,
        priority: 'high',
      },
    );
  }

  private async fetchChatThread(
    threadId: string,
  ): Promise<FirebaseFirestore.DocumentData> {
    return (
      await this.firebaseService.firebaseFirestore
        .collection('threads')
        .doc(threadId)
        .get()
    ).data();
  }
}
