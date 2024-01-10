import { ReportDelivererInterface, DeliveryMetaDataInterface } from '../Interface';

export class FTPDeliverer implements ReportDelivererInterface {
  deliverReport(reportContent: string, metaData: DeliveryMetaDataInterface): void {
    const { recipient, deliveryMethod } = metaData;
    // Ici, nous simulons l'envoi d'un rapport via FTP.
    // Dans une application réelle, vous implémenteriez l'envoi FTP en utilisant une bibliothèque FTP ou une API.

    console.log(`Envoi du rapport via FTP à l'adresse: ${recipient}`);
    console.log(`Méthode de livraison: ${deliveryMethod}`);
    console.log(`Contenu du rapport: \n${reportContent}`);

    // Implémenter la logique d'envoi FTP ici...
  }
}
