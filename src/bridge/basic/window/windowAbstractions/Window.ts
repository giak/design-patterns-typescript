export interface WindowImplementation {
  renderWindow(): void;
  closeWindow(): void;
}

export abstract class Window {
  constructor(protected windowImpl: WindowImplementation) {}

  abstract render(): void;
  abstract close(): void;
}
