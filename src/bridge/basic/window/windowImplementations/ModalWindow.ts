import { WindowImplementation } from '../windowAbstractions/Window';

export class ModalWindow implements WindowImplementation {
  renderWindow(): void {
    console.log('Rendering a modal window.');
    // Logique spécifique pour rendre une fenêtre modale
  }

  closeWindow(): void {
    console.log('Closing a modal window.');
    // Logique spécifique pour fermer une fenêtre modale
  }
}
