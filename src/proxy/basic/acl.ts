// Use Case: Custom Access Control

// Interface describing a sensitive resource
interface SensitiveResourceInterface {
  access(): void;
}

// Implementation of the sensitive resource
class SensitiveResource implements SensitiveResourceInterface {
  access() {
    console.log('Authorized access to the sensitive resource.');
  }
}

// Proxy to control access
class AccessControlProxy implements SensitiveResourceInterface {
  private userAuthorized = false;
  private resource: SensitiveResource = new SensitiveResource();

  access() {
    if (this.userAuthorized) {
      this.resource.access();
    } else {
      console.log('Access denied. Authorization required.');
    }
  }

  // Method to grant authorization
  grantAuthorization() {
    this.userAuthorized = true;
    console.log('Authorization granted.');
  }
}

// Using the AccessControlProxy
const accessControlProxy = new AccessControlProxy();

// Attempting access without authorization
accessControlProxy.access();
// Expected output: "Access denied. Authorization required."

// Granting authorization
accessControlProxy.grantAuthorization();

// Attempting access with authorization
accessControlProxy.access();
// Expected output: "Authorized access to the sensitive resource."
