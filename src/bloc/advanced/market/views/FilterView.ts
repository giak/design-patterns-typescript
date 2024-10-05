import type { MarketBloc } from '../blocs/MarketBloc';

export class FilterView {
  private marketBloc: MarketBloc;
  private container: HTMLElement | null;

  constructor(marketBloc: MarketBloc) {
    this.marketBloc = marketBloc;
    this.container = document.getElementById('filter');
    if (this.container) {
      this.initialize();
    } else {
      console.error('Filter container not found');
    }
  }

  private initialize(): void {
    if (!this.container) {
      console.error('Cannot initialize FilterView: container is null');
      return;
    }

    const symbols = ['ALL', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    this.container.innerHTML = `
      <label for="symbolSelect">Sélectionnez un symbole :</label>
      <select id="symbolSelect">
        ${symbols.map((symbol) => `<option value="${symbol}">${symbol}</option>`).join('')}
      </select>
    `;
    const selectElement = document.getElementById('symbolSelect');
    if (selectElement instanceof HTMLSelectElement) {
      selectElement.addEventListener('change', this.onSymbolChange.bind(this));
    } else {
      console.error('Symbol select element not found');
    }
  }

  private onSymbolChange(event: Event): void {
    const selectElement = event.target;
    if (selectElement instanceof HTMLSelectElement) {
      this.marketBloc.setSelectedSymbol(selectElement.value);
    } else {
      console.error('Invalid event target');
    }
  }
}
