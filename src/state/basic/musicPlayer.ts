interface MusicPlayerStateInterface {
  play(): void;
  pause(): void;
  next(): void;
}

class PlayingState implements MusicPlayerStateInterface {
  play() {
    console.log('Already playing');
  }
  pause() {
    console.log('Pausing music');
  }
  next() {
    console.log('Playing next track');
  }
}

class PausedState implements MusicPlayerStateInterface {
  play() {
    console.log('Resuming playback');
  }
  pause() {
    console.log('Already paused');
  }
  next() {
    console.log('Moving to next track');
  }
}

export {};
