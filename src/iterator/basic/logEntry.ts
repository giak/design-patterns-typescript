interface LogEntryInterface {
  timestamp: Date;
  message: string;
}

class LogIterator implements Iterator<LogEntryInterface> {
  private currentIndex = 0;

  constructor(private logEntries: LogEntryInterface[]) {}

  next(): IteratorResult<LogEntryInterface> {
    if (this.currentIndex < this.logEntries.length) {
      return {
        done: false,
        value: this.logEntries[this.currentIndex++],
      };
    }
    return { done: true, value: undefined };
  }
}

class LogAnalyzer implements Iterable<LogEntryInterface> {
  constructor(private logEntries: LogEntryInterface[]) {}

  [Symbol.iterator](): Iterator<LogEntryInterface> {
    return new LogIterator(this.logEntries);
  }
}

// Utilisation
const logs = new LogAnalyzer([
  { timestamp: new Date(), message: 'Server started' },
  { timestamp: new Date(), message: 'Request received' },
  { timestamp: new Date(), message: 'Processing complete' },
]);

for (const log of logs) {
  console.log(`${log.timestamp.toISOString()}: ${log.message}`);
}
