// Use Case: Transparent Logging

// Interface describing a service with critical functions
interface CriticalServiceInterface {
  performOperation(): void;
}

// Implementation of the critical service
class CriticalService implements CriticalServiceInterface {
  performOperation() {
    console.log('Critical operation performed.');
  }
}

// Proxy for transparent logging
class TransparentLoggingProxy implements CriticalServiceInterface {
  private target: CriticalService = new CriticalService();

  performOperation() {
    // Additional logging logic
    console.log('Calling performOperation.');

    this.target.performOperation();

    console.log('performOperation completed.');
  }
}

// Using the TransparentLoggingProxy
const transparentLoggingProxy = new TransparentLoggingProxy();

// Performing operation with transparent logging
transparentLoggingProxy.performOperation();
// Output: Calling performOperation.
// Output: Critical operation performed.
// Output: performOperation completed.


export {}
