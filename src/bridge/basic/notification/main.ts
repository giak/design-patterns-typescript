import {
  DesktopNotificationImplementor,
  MobileNotificationImplementor,
  TextContentType,
  AttachmentContentType,
  UrgentContentType,
} from './NotificationImplementor';
import { Message } from './Message';

const desktopNotif = new DesktopNotificationImplementor();
const mobileNotif = new MobileNotificationImplementor();

// Créer différents types de messages
const textMessage = new Message<TextContentType>('text', 'Hello, this is a text message!', desktopNotif);
const attachmentMessage = new Message<AttachmentContentType>(
  'attachment',
  { fileName: 'file.pdf', fileSize: 1024 },
  mobileNotif,
);
const urgentMessage = new Message<UrgentContentType>('urgent', 'This is an urgent message!', desktopNotif);

// Envoyer les messages
textMessage.send();
attachmentMessage.send();
urgentMessage.send();
