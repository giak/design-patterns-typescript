interface GameEntityInterface {
  id: number;
  update(): void;
}

class GameLoop implements Iterable<GameEntityInterface> {
  private entities: GameEntityInterface[] = [];

  addEntity(entity: GameEntityInterface): void {
    this.entities.push(entity);
  }

  *[Symbol.iterator](): Iterator<GameEntityInterface> {
    yield* this.entities;
  }

  run(): void {
    for (const entity of this) {
      entity.update();
    }
  }
}

// Utilisation
const gameLoop = new GameLoop();
gameLoop.addEntity({ id: 1, update: () => console.log('Updating entity 1') });
gameLoop.addEntity({ id: 2, update: () => console.log('Updating entity 2') });

gameLoop.run(); // Mettre à jour toutes les entités
