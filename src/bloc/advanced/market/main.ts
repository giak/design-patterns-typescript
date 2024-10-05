import { MarketBloc } from './blocs/MarketBloc';
import { ChartView } from './views/ChartView';
import { DashboardView } from './views/DashboardView';
import { FilterView } from './views/FilterView';

const marketBloc = new MarketBloc();

new FilterView(marketBloc);
new DashboardView(marketBloc);
new ChartView(marketBloc);

// Gestion du cycle de vie
window.addEventListener('beforeunload', () => {
  marketBloc.dispose();
});
