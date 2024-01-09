import { EventFacade } from './EventFacade';

function setupEventListeners() {
  const facade = new EventFacade();

  facade.onElementClicked('myButton', () => {
    console.log('Button clicked!');
  });

  facade.onPageLoad(() => {
    console.log('Page loaded!');
  });

  facade.onFormSubmit('myForm', (event: Event) => {
    event.preventDefault();
    console.log('Form submitted!');
  });
}

setupEventListeners();
