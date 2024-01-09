export class ClickEventHandler {
  handleEvent(elementId: string, callback: () => void) {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('click', callback);
    }
  }
}
