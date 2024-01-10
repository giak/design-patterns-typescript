import {
  ReportFormatterInterface,
  ReportDataInterface,
  FormatOptionsInterface,
  FinancialReportDataInterface,
  SalesReportDataInterface,
} from '../Interface';

export class PDFFormatter implements ReportFormatterInterface {
  formatReport(data: ReportDataInterface, options?: FormatOptionsInterface): string {
    // Commencer avec une structure de base pour le rapport PDF
    let pdfContent = `Title: ${data.title}\n`;

    // Ajouter un en-tête si nécessaire
    if (options?.header) {
      pdfContent += '--- Header ---\n';
    }

    // Traiter différents types de données de rapport
    if ('financialDetails' in data) {
      // Formatage spécifique pour les données financières
      pdfContent += this.formatFinancialData(data as FinancialReportDataInterface);
    } else if ('salesDetails' in data) {
      // Formatage spécifique pour les données de vente
      pdfContent += this.formatSalesData(data as SalesReportDataInterface);
    } else {
      // Formatage générique pour d'autres types de données
      pdfContent += `Content: ${JSON.stringify(data.content)}\n`;
    }

    // Ajouter un pied de page si nécessaire
    if (options?.footer) {
      pdfContent += '--- Footer ---\n';
    }

    // Simuler la création d'un PDF (dans un cas réel, utiliser une bibliothèque de génération de PDF)
    return `PDF: \n${pdfContent}`;
  }

  private formatSalesData(data: SalesReportDataInterface): string {
    const salesDetails = data.salesDetails;
    let salesContent = `Sales Report:\n Total Sales: ${salesDetails.totalSales}\n`;
    salesContent = salesDetails.topPerformingProducts
      .map((product) => ` Product: ${product.name}, Sales: ${product.salesFigures}`)
      .join('\n');
    return salesContent;
  }

  private formatFinancialData(data: FinancialReportDataInterface): string {
    const financialDetails = data.financialDetails;
    return `Sales Report:\n Total Sales: ${financialDetails.revenue} - ${financialDetails.expenses}\n`;
  }
}
