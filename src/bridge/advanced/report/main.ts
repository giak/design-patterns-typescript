import { PDFFormatter } from './reportFormatters/PDFFormatter';
import { HTMLFormatter } from './reportFormatters/HTMLFormatter';
import { JSONFormatter } from './reportFormatters/JSONFormatter';
import { EmailDeliverer } from './reportDeliverers/EmailDeliverer';
import { FTPDeliverer } from './reportDeliverers/FTPDeliverer';
import { CloudDeliverer } from './reportDeliverers/CloudDeliverer';
import { ReportBridge } from './Report';
import { ReportDataInterface, FormatOptionsInterface, DeliveryMetaDataInterface } from './Interface';

// Exemple de données de rapport
const reportData: ReportDataInterface = {
  title: 'Annual Sales Report',
  content: { totalSales: 100000, region: 'North America' },
};

// Options de formatage pour le rapport
const formatOptions: FormatOptionsInterface = { header: true, footer: true };

// Métadonnées pour la livraison du rapport
const deliveryMetaData: DeliveryMetaDataInterface = { recipient: 'manager@example.com', deliveryMethod: 'email' };

// Création des instances de formatteurs de rapport
const pdfFormatter = new PDFFormatter();
const htmlFormatter = new HTMLFormatter();
const jsonFormatter = new JSONFormatter();

// Création des instances de livreurs de rapport
const emailDeliverer = new EmailDeliverer();
const ftpDeliverer = new FTPDeliverer();
const cloudDeliverer = new CloudDeliverer();

// Création et livraison d'un rapport en format PDF par email
const pdfReport = new ReportBridge(pdfFormatter, [emailDeliverer], reportData, formatOptions, deliveryMetaData);
pdfReport.generateAndDeliverReport();

// Création et livraison d'un rapport en format HTML par FTP
const htmlReport = new ReportBridge(htmlFormatter, [ftpDeliverer], reportData, formatOptions, deliveryMetaData);
htmlReport.generateAndDeliverReport();

// Création et livraison d'un rapport en format JSON dans le cloud
const jsonReport = new ReportBridge(jsonFormatter, [cloudDeliverer], reportData, formatOptions, deliveryMetaData);
jsonReport.generateAndDeliverReport();
