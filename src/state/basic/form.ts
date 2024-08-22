interface FormStateInterface {
  submit(): void;
  cancel(): void;
}

class EditingState implements FormStateInterface {
  submit() {
    console.log('Validating form...');
    // Transition to SubmittingState if valid
  }
  cancel() {
    console.log('Discarding changes...');
    // Transition to InitialState
  }
}

class SubmittingState implements FormStateInterface {
  submit() {
    console.log('Form already submitting...');
  }
  cancel() {
    console.log('Cancelling submission...');
    // Transition to EditingState
  }
}

export {};
