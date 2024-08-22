type StateType = 'idle' | 'loading' | 'success' | 'error';

interface StateMachineInterface {
  state: StateType;
  transition(to: StateType): void;
  performAction(): void;
}

abstract class State {
  protected machine: StateMachine;

  constructor(machine: StateMachine) {
    this.machine = machine;
  }

  abstract performAction(): void;
}

class IdleState extends State {
  performAction(): void {
    console.log("Action en état d'inactivité");
  }
}

class LoadingState extends State {
  performAction(): void {
    console.log("Action en cours de chargement");
  }
}

class SuccessState extends State {
  performAction(): void {
    console.log("Action réussie");
  }
}

class ErrorState extends State {
  performAction(): void {
    console.log("Action en erreur");
  }
}

class StateMachine implements StateMachineInterface {
  state: StateType;
  private currentState: State;

  constructor() {
    this.state = 'idle';
    this.currentState = new IdleState(this);
  }

  transition(to: StateType): void {
    console.log(`Transition de l'état ${this.state} à ${to}`);
    this.state = to;
    
    switch (to) {
      case 'idle':
        this.currentState = new IdleState(this);
        break;
      case 'loading':
        this.currentState = new LoadingState(this);
        break;
      case 'success':
        this.currentState = new SuccessState(this);
        break;
      case 'error':
        this.currentState = new ErrorState(this);
        break;
    }
  }

  performAction(): void {
    this.currentState.performAction();
  }
}

export {};
