// Use Case: Performance Monitoring

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

// Proxy for performance monitoring
class PerformanceMonitoringProxy implements CriticalServiceInterface {
  private target: CriticalService = new CriticalService();

  performOperation() {
    const startTime = Date.now();

    this.target.performOperation();

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    console.log(`performOperation executed in ${executionTime} milliseconds.`);
  }
}

// Using the PerformanceMonitoringProxy
const performanceMonitoringProxy = new PerformanceMonitoringProxy();

// Performing operation with performance monitoring
performanceMonitoringProxy.performOperation();
// Output: Critical operation performed.
// Output: performOperation executed in X milliseconds.

export {};
