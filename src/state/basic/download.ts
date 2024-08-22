interface DownloadStateInterface {
  start(): void;
  pause(): void;
  resume(): void;
  cancel(): void;
}

class IdleState implements DownloadStateInterface {
  start() {
    console.log('Starting download...');
  }
  pause() {
    console.log('Download not started');
  }
  resume() {
    console.log('Download not started');
  }
  cancel() {
    console.log('Nothing to cancel');
  }
}

class DownloadingState implements DownloadStateInterface {
  start() {
    console.log('Already downloading');
  }
  pause() {
    console.log('Pausing download...');
  }
  resume() {
    console.log('Already downloading');
  }
  cancel() {
    console.log('Cancelling download...');
  }
}
