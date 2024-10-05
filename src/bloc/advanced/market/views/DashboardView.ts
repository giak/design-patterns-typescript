import { combineLatest } from 'rxjs';
import type { MarketBloc } from '../blocs/MarketBloc';
import type { StockQuoteModel } from '../models/StockQuoteModel';

export class DashboardView {
  private marketBloc: MarketBloc;
  private container: HTMLElement | null;
  private paginationContainer: HTMLElement | null;
  private tableBody: HTMLTableSectionElement | null = null;

  constructor(marketBloc: MarketBloc) {
    this.marketBloc = marketBloc;
    this.container = document.getElementById('dashboard-container');
    this.paginationContainer = document.getElementById('pagination');
    if (this.container && this.paginationContainer) {
      this.initialize();
    } else {
      console.error('Dashboard or pagination container not found');
    }
  }

  private initialize(): void {
    this.createTable();
    
    this.marketBloc.quotes$.subscribe((quotes) => {
      this.updateQuotes(quotes);
    });

    this.marketBloc.loading$.subscribe((isLoading) => this.toggleLoading(isLoading));
    this.marketBloc.error$.subscribe((error) => this.showError(error));

    combineLatest([this.marketBloc.currentPage$, this.marketBloc.totalPages$]).subscribe(
      ([currentPage, totalPages]) => {
        this.updatePagination(currentPage, totalPages);
      },
    );
  }

  private createTable(): void {
    if (this.container) {
      const tableHTML = `
        <table class="stock-table">
          <thead>
            <tr>
              <th>Symbole</th>
              <th>Prix (€)</th>
              <th>Variation</th>
              <th>Volume</th>
              <th>Heure</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      `;
      this.container.innerHTML = tableHTML;
      this.tableBody = this.container.querySelector('tbody');
      if (!this.tableBody) {
        console.error('Failed to create table body');
      }
    } else {
      console.error('Container is null, cannot create table');
    }
  }

  private updateQuotes(quotes: StockQuoteModel[]): void {
    if (!this.tableBody) {
      console.error('Table body is null');
      return;
    }

    quotes.forEach((quote, index) => {
      let row = this.tableBody?.children[index] as HTMLTableRowElement | undefined;
      if (!row) {
        row = document.createElement('tr');
        row.classList.add('fade-in');
        if (this.tableBody) {
          this.tableBody.appendChild(row);
        }
      }
      this.updateRow(row, quote);
    });

    // Remove extra rows if necessary
    while (this.tableBody.children.length > quotes.length) {
      const lastChild = this.tableBody.lastChild as HTMLTableRowElement;
      if (lastChild) {
        lastChild.classList.add('fade-out');
        lastChild.addEventListener('animationend', () => {
          if (this.tableBody?.contains(lastChild)) {
            this.tableBody.removeChild(lastChild);
          }
        });
      }
    }
  }

  private updateRow(row: HTMLTableRowElement, quote: StockQuoteModel): void {
    const changeClass = quote.change >= 0 ? 'positive-change' : 'negative-change';
    const changeIcon = quote.change >= 0 ? '▲' : '▼';
    
    const newContent = `
      <td class="symbol">${quote.symbol}</td>
      <td class="price">${quote.price.toFixed(2)} €</td>
      <td class="change ${changeClass}">
        ${changeIcon} ${Math.abs(quote.change).toFixed(2)} (${(quote.change / quote.price * 100).toFixed(2)}%)
      </td>
      <td class="volume">${quote.volume.toLocaleString()}</td>
      <td class="timestamp">${quote.timestamp.toLocaleTimeString()}</td>
    `;

    if (row.innerHTML !== newContent) {
      row.innerHTML = newContent;
      row.classList.add('fade-in');
      row.addEventListener('animationend', () => {
        row.classList.remove('fade-in');
      }, { once: true });
    }
  }

  private updatePagination(currentPage: number, totalPages: number): void {
    if (!this.paginationContainer) return;

    this.paginationContainer.innerHTML = `
      <button id="prevPage" ${currentPage <= 1 ? 'disabled' : ''}>Précédent</button>
      <span>Page ${currentPage} sur ${totalPages}</span>
      <button id="nextPage" ${currentPage >= totalPages ? 'disabled' : ''}>Suivant</button>
    `;

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton?.addEventListener('click', () => this.marketBloc.previousPage());
    nextButton?.addEventListener('click', () => this.marketBloc.nextPage());
  }

  private toggleLoading(isLoading: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      if (isLoading) {
        loader.style.display = 'block';
        loader.classList.add('fade-in');
      } else {
        loader.classList.add('fade-out');
        loader.addEventListener('animationend', () => {
          loader.style.display = 'none';
          loader.classList.remove('fade-out');
        }, { once: true });
      }
    }
  }

  private showError(error: string | null): void {
    const errorContainer = document.getElementById('error');
    if (errorContainer) {
      if (error) {
        errorContainer.textContent = error;
        errorContainer.style.display = 'block';
      } else {
        errorContainer.style.display = 'none';
      }
    }
  }
}
