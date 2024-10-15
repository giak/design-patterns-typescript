import type { AggregatedReadingInterface, DataFormatterInterface } from './types';

/**
 * Classe pour formater les données agrégées avec des emojis.
 */
export class EmojiDataFormatter implements DataFormatterInterface<AggregatedReadingInterface> {
  formatWithEmojis(aggregatedData: AggregatedReadingInterface[]): string {
    return aggregatedData
      .map((data) => {
        let emoji = '';
        switch (data.type) {
          case 'temperature':
            emoji = data.average > 30 ? '🔥' : data.average < 10 ? '❄️' : '🌡️';
            break;
          case 'humidity':
            emoji = data.average > 70 ? '💧' : data.average < 30 ? '🏜️' : '💦';
            break;
          case 'pressure':
            emoji = data.average > 1013 ? '🔺' : data.average < 1013 ? '🔻' : '➡️';
            break;
        }
        return `${emoji} ${data.type}: avg ${data.average.toFixed(2)}, min ${data.min.toFixed(2)}, max ${data.max.toFixed(2)}`;
      })
      .join('\n');
  }
}
