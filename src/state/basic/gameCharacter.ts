interface CharacterStateInterface {
  move(): void;
  attack(): void;
}

class NormalState implements CharacterStateInterface {
  move() {
    console.log('Walking normally');
  }
  attack() {
    console.log('Normal attack');
  }
}

class StunnedState implements CharacterStateInterface {
  move() {
    console.log('Cannot move while stunned');
  }
  attack() {
    console.log('Cannot attack while stunned');
  }
}

class Character {
  private state: CharacterStateInterface = new NormalState();

  setState(state: CharacterStateInterface) {
    this.state = state;
  }

  move() {
    this.state.move();
  }
  attack() {
    this.state.attack();
  }
}
