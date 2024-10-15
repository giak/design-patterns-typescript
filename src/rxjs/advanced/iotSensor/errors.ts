/**
 * Erreur spécifique aux capteurs.
 */
export class SensorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SensorError';
  }
}

/**
 * Erreur spécifique à la simulation.
 */
export class SimulationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SimulationError';
  }
}

/**
 * Erreur spécifique au traitement des données.
 */
export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessingError';
  }
}
