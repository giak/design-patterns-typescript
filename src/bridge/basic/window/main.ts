import { ModalWindow } from './windowImplementations/ModalWindow';
import { PopupWindow } from './windowImplementations/PopupWindow';
import { Window } from './windowAbstractions/Window';

class ApplicationWindow extends Window {
  render(): void {
    this.windowImpl.renderWindow();
  }

  close(): void {
    this.windowImpl.closeWindow();
  }
}

// Utilisation du système de fenêtre
const modalWindow = new ApplicationWindow(new ModalWindow());
const popupWindow = new ApplicationWindow(new PopupWindow());

modalWindow.render(); // Affiche une fenêtre modale
popupWindow.render(); // Affiche une fenêtre contextuelle

popupWindow.close(); // Ferme la fenêtre contextuelle
