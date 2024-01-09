import { ClickEventHandler } from './ClickEventHandler';
import { LoadEventHandler } from './LoadEventHandler';
import { SubmitEventHandler } from './SubmitEventHandler';

export class EventFacade {
  private clickHandler: ClickEventHandler = new ClickEventHandler();
  private loadHandler: LoadEventHandler = new LoadEventHandler();
  private submitHandler: SubmitEventHandler = new SubmitEventHandler();

  onElementClicked(elementId: string, callback: () => void) {
    this.clickHandler.handleEvent(elementId, callback);
  }

  onPageLoad(callback: () => void) {
    this.loadHandler.handleEvent(callback);
  }

  onFormSubmit(formId: string, callback: (event: Event) => void) {
    this.submitHandler.handleEvent(formId, callback);
  }
}
