export class SubmitEventHandler {
  handleEvent(formId: string, callback: (event: Event) => void) {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (form) {
      form.addEventListener('submit', callback);
    }
  }
}
