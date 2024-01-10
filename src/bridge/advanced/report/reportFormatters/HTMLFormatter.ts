import {
  ReportFormatterInterface,
  ReportDataInterface,
  FormatOptionsInterface,
  FinancialReportDataInterface,
  SalesReportDataInterface,
} from '../Interface';

export class HTMLFormatter implements ReportFormatterInterface {
  formatReport(data: ReportDataInterface, options?: FormatOptionsInterface): string {
    let htmlContent = `<h1>${data.title}</h1>`;

    if (options?.header) {
      htmlContent += '<header>Report Header</header>';
    }

    if ('financialDetails' in data) {
      htmlContent += this.formatFinancialData(data as FinancialReportDataInterface);
    } else if ('salesDetails' in data) {
      htmlContent += this.formatSalesData(data as SalesReportDataInterface);
    } else {
      htmlContent += `<p>${JSON.stringify(data.content)}</p>`;
    }

    if (options?.footer) {
      htmlContent += '<footer>Report Footer</footer>';
    }

    return `<html><body>${htmlContent}</body></html>`;
  }

  private formatSalesData({ salesDetails }: SalesReportDataInterface): string {
    return `
      <div>
        <h2>Sales Report</h2>
        <p>Total Sales: ${salesDetails.totalSales}</p>
        <ul>
          ${salesDetails.topPerformingProducts
            .map((product) => `<li>Product: ${product.name}, Sales: ${product.salesFigures}</li>`)
            .join('')}
        </ul>
      </div>
    `;
  }

  private formatFinancialData({ financialDetails }: FinancialReportDataInterface): string {
    return `
    <p>
      Sales Report:
      Total Sales: ${financialDetails.revenue} - ${financialDetails.expenses}
    </p>
  `;
  }
}
