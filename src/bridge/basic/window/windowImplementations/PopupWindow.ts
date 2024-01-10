import { WindowImplementation } from '../windowAbstractions/Window';

export class PopupWindow implements WindowImplementation {
  renderWindow(): void {
    console.log('Rendering a popup window.');
    // Logique spécifique pour rendre une fenêtre contextuelle
  }

  closeWindow(): void {
    console.log('Closing a popup window.');
    // Logique spécifique pour fermer une fenêtre contextuelle
  }
}
