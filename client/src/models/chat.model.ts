import { Timestamp } from 'firebase/firestore';

export class Chat {
  public id: string = '';
  public userId: string = '';
  public message: string = '';
  public createdAt: Date = new Date(Date.now());

  static fromJson(json: any): Chat {
    const chat = new Chat();

    chat.id = json.id ?? '';
    chat.userId = json.userId ?? '';
    chat.message = json.message ?? '';
    chat.createdAt = json.createdAt
      ? json.createdAt.toDate()
      : new Date(Date.now());

    return chat;
  }

  toJson(): {
    id: string;
    userId: string;
    message: string;
    createdAt: Timestamp;
  } {
    return {
      id: this.id,
      userId: this.userId,
      message: this.message,
      createdAt: Timestamp.fromDate(this.createdAt),
    };
  }
}
