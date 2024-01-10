import {
  ReportFormatterInterface,
  ReportDelivererInterface,
  ReportDataInterface,
  FormatOptionsInterface,
  DeliveryMetaDataInterface,
} from './Interface';

export class ReportBridge {
  constructor(
    private formatter: ReportFormatterInterface,
    private deliverers: ReportDelivererInterface[],
    private data: ReportDataInterface,
    private formatOptions: FormatOptionsInterface,
    private deliveryMetaData: DeliveryMetaDataInterface,
  ) {}

  generateAndDeliverReport(): void {
    try {
      // Utilise le formatteur pour transfromer les données du rapport
      const formattedReport = this.formatter.formatReport(this.data, this.formatOptions);

      // Utilise chaque livreur pour livrer le rapport
      for (const deliverer of this.deliverers) {
        deliverer.deliverReport(formattedReport, this.deliveryMetaData);
      }
    } catch (error) {
      console.error('Failed to generate or deliver the report:', error);
    }
  }
}
