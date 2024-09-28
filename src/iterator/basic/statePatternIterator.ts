interface StateInterface {
  name: string;
  onEnter(): void;
  onExit(): void;
}

class StateMachine implements Iterable<StateInterface> {
  private states: StateInterface[] = [];
  private currentStateIndex = -1;

  addState(state: StateInterface): void {
    this.states.push(state);
  }

  start(): void {
    if (this.states.length > 0) {
      this.currentStateIndex = 0;
      this.states[this.currentStateIndex].onEnter();
    }
  }

  next(): void {
    if (this.currentStateIndex >= 0) {
      this.states[this.currentStateIndex].onExit();
      this.currentStateIndex = (this.currentStateIndex + 1) % this.states.length;
      this.states[this.currentStateIndex].onEnter();
    }
  }

  *[Symbol.iterator](): Iterator<StateInterface> {
    while (true) {
      yield this.states[this.currentStateIndex];
      this.next();
    }
  }
}

// Utilisation
const stateMachine = new StateMachine();
stateMachine.addState({
  name: 'Idle',
  onEnter: () => console.log('Entering Idle state'),
  onExit: () => console.log('Exiting Idle state'),
});
stateMachine.addState({
  name: 'Active',
  onEnter: () => console.log('Entering Active state'),
  onExit: () => console.log('Exiting Active state'),
});

stateMachine.start();

const iterator = stateMachine[Symbol.iterator]();
for (let i = 0; i < 5; i++) {
  console.log(iterator.next().value.name);
}
