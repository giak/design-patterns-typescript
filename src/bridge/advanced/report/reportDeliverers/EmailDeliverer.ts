import { ReportDelivererInterface, DeliveryMetaDataInterface } from '../Interface';

export class EmailDeliverer implements ReportDelivererInterface {
  deliverReport(reportContent: string, metaData: DeliveryMetaDataInterface): void {
    const { recipient, deliveryMethod } = metaData;
    // Ici, nous simulons l'envoi d'un email.
    // Dans une application réelle, vous implémenteriez l'envoi d'email en utilisant une bibliothèque ou un service d'emailing.

    console.log(`Envoi du rapport par email à ${recipient}`);
    console.log(`Méthode de livraison: ${deliveryMethod}`);
    console.log(`Contenu du rapport: \n${reportContent}`);

    // Implémenter la logique d'envoi d'email ici...
  }
}
