import { NotificationImplementorInterface } from './NotificationImplementor';

// Types discriminants pour différents types de messages
export enum MessageType {
  text = 'text',
  attachment = 'attachment',
  urgent = 'urgent',
}

export class Message<T> {
  constructor(
    private type: keyof typeof MessageType,
    private content: T,
    private notification: NotificationImplementorInterface<T>,
  ) {
    if (!content) {
      throw new Error('Content cannot be empty');
    }

    this.type = type;
    this.content = content;
    this.notification = notification;
  }

  send(): void {
    this.notification.sendNotification(this.content);
  }
}
