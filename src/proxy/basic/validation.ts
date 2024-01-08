// Use Case: Dynamic Data Validation

// Interface describing a data validator
interface DataValidatorInterface {
  validate(data: string): boolean;
}

// Implementation of the data validator
class DataValidator implements DataValidatorInterface {
  validate(data: string): boolean {
    // Simulating a validation process
    console.log(`Validating data: ${data}`);
    return data.length > 8; // Simple length-based validation for demonstration
  }
}

// Proxy for dynamic data validation
class DynamicDataValidationProxy implements DataValidatorInterface {
  private target: DataValidator = new DataValidator();

  validate(data: string): boolean {
    // Additional dynamic validation logic
    if (!data.includes('@')) {
      console.log("Invalid data format. Missing '@'.");
      return false;
    }

    return this.target.validate(data);
  }
}

// Using the DynamicDataValidationProxy
const dynamicDataValidationProxy = new DynamicDataValidationProxy();

// Validating data dynamically
console.log(dynamicDataValidationProxy.validate('example@domain.com')); // Output: Validating data: example@domain.com, true
console.log(dynamicDataValidationProxy.validate('e@d.fr')); // Output: Validating data: e@d.fr, false
console.log(dynamicDataValidationProxy.validate('short')); // Output: Invalid data format. Missing '@'. false
