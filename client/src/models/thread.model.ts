import { Chat } from './chat.model';
import { Timestamp } from 'firebase/firestore';

export class Thread {
  public id: string = '';
  public participants: string[] = [];
  public messages: Chat[] = [];
  public seen: string[] = [];

  static newThread(id: string, participants: string[]): Thread {
    const thread = new Thread();
    thread.id = id;
    thread.participants = participants;
    thread.messages = [];
    thread.seen = participants;

    return thread;
  }

  static fromJson(json: any): Thread {
    const thread = new Thread();

    thread.id = json.id ?? '';
    thread.participants = json.participants ?? '';
    thread.messages = json.messages
      ? json.messages.map((message: any) => Chat.fromJson(message))
      : [];
    thread.seen = json.seen ?? [];

    return thread;
  }

  toJson(): {
    id: string;
    participants: string[];
    messages: {
      id: string;
      userId: string;
      message: string;
      createdAt: Timestamp;
    }[];
    seen: string[];
  } {
    return {
      id: this.id,
      participants: this.participants,
      messages: this.messages.map((message) => message.toJson()),
      seen: this.seen,
    };
  }
}
