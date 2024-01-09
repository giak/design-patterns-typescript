export class LoadEventHandler {
  handleEvent(callback: () => void) {
    window.addEventListener('load', callback);
  }
}
