interface WizardStateInterface {
  next(): void;
  previous(): void;
}

class Step1 implements WizardStateInterface {
  next() {
    console.log('Moving to step 2');
  }
  previous() {
    console.log('Already at first step');
  }
}

class Step2 implements WizardStateInterface {
  next() {
    console.log('Moving to step 3');
  }
  previous() {
    console.log('Moving back to step 1');
  }
}
export {};
