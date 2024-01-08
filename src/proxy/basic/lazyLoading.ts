// Use Case: Efficient Lazy Loading

// Interface describing a resource to be lazily loaded
interface HeavyResourceInterface {
  loadData(): void;
}

// Implementation of the heavy resource
class HeavyResource implements HeavyResourceInterface {
  loadData() {
    console.log('Loading heavy resource data.');
  }
}

// Proxy for efficient lazy loading
class EfficientLazyLoadingProxy implements HeavyResourceInterface {
  private target: HeavyResource | null = null;

  loadData() {
    if (!this.target) {
      this.target = new HeavyResource();
      console.log('Lazy loading heavy resource.');
    }

    this.target.loadData();
  }
}

// Using the EfficientLazyLoadingProxy
const efficientLazyLoadingProxy = new EfficientLazyLoadingProxy();

// Loading data with efficient lazy loading
efficientLazyLoadingProxy.loadData(); // Output: Lazy loading heavy resource.
efficientLazyLoadingProxy.loadData(); // No output (resource already loaded)
