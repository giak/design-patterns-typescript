import Chart from 'chart.js/auto';
import type { MarketBloc } from '../blocs/MarketBloc';
import type { StockQuoteModel } from '../models/StockQuoteModel';

export class ChartView {
  private marketBloc: MarketBloc;
  private container: HTMLElement | null;
  private canvas: HTMLCanvasElement | null = null;
  private chartInstance?: Chart;

  constructor(marketBloc: MarketBloc) {
    this.marketBloc = marketBloc;
    this.container = document.getElementById('chart-container');
    if (this.container) {
      this.initialize();
    } else {
      console.error('Chart container not found');
    }
  }

  private initialize(): void {
    this.createCanvas();
    this.marketBloc.historicalData$.subscribe((data) => this.renderChart(data));
  }

  private createCanvas(): void {
    if (this.container) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'priceChart';
      this.container.innerHTML = ''; // Clear any existing content
      this.container.appendChild(this.canvas);
    }
  }

  private renderChart(data: StockQuoteModel[]): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    if (data.length === 0) {
      if (this.container) {
        this.container.innerHTML = '<p>Sélectionnez un symbole pour afficher le graphique.</p>';
      }
      return;
    }

    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.canvas.getContext('2d');

    if (!ctx) {
      console.error('Unable to get 2D context from canvas');
      return;
    }

    const labels = data.map((d) => d.timestamp.toLocaleDateString());
    const prices = data.map((d) => d.price);

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Prix de ${data[0].symbol}`,
            data: prices,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
