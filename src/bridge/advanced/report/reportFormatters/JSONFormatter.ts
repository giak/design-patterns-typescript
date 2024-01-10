import {
  ReportFormatterInterface,
  ReportDataInterface,
  FinancialReportDataInterface,
  SalesReportDataInterface,
} from '../Interface';

export class JSONFormatter implements ReportFormatterInterface {
  formatReport(data: ReportDataInterface): string {
    const { title, content, financialDetails, salesDetails } = data;

    const reportObject: ReportDataInterface = {
      title,
      content: content as string,
    };

    if (financialDetails) {
      reportObject.financialDetails = this.formatFinancialData(data as FinancialReportDataInterface);
    } else if (salesDetails) {
      reportObject.salesDetails = this.formatSalesData(data as SalesReportDataInterface);
    }

    return JSON.stringify(reportObject, null, 2);
  }

  private formatFinancialData({ financialDetails }: FinancialReportDataInterface): object {
    const { revenue, expenses } = financialDetails;
    return { revenue, expenses };
  }

  private formatSalesData({ salesDetails }: SalesReportDataInterface): object {
    const { totalSales, topPerformingProducts } = salesDetails;
    return { totalSales, topPerformingProducts };
  }
}
