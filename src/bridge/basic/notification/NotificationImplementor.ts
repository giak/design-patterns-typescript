// Utilisation des génériques pour une plus grande flexibilité
export interface NotificationImplementorInterface<T> {
  sendNotification(message: T): void;
}

// Types de messages spécifiques
export type TextContentType = string;
export type AttachmentContentType = { fileName: string; fileSize: number };
export type UrgentContentType = string;
export type ContentType = TextContentType | AttachmentContentType | UrgentContentType;

export abstract class NotificationImplementorBase implements NotificationImplementorInterface<ContentType> {
  protected abstract getPlatformName(): string;

  sendNotification(message: ContentType): void {
    switch (typeof message) {
      case 'string':
        console.log(`${this.getPlatformName()} Notification: ${message}`);
        break;
      case 'object':
        if ('fileName' in message) {
          console.log(
            `${this.getPlatformName()} Notification with Attachment: ${message.fileName}, Size: ${message.fileSize}`,
          );
        } else {
          throw new Error(`Unsupported message type: ${typeof message}`);
        }
        break;
      default:
        throw new Error(`Unsupported message type: ${typeof message}`);
    }
  }
}

export class DesktopNotificationImplementor extends NotificationImplementorBase {
  protected getPlatformName(): string {
    return 'Desktop';
  }
}

export class MobileNotificationImplementor extends NotificationImplementorBase {
  protected getPlatformName(): string {
    return 'Mobile';
  }
}
