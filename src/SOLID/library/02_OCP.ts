/**
 * Represents a student in the library system.
 * @interface StudentInterface
 */
interface StudentInterface {
  /** Unique identifier for the student */
  id: number;
  /** Full name of the student */
  name: string;
}

/**
 * Base interface for all library items
 * @interface LibraryItemInterface
 */
interface LibraryItemInterface {
  /** Unique identifier for the item */
  id: number;
  /** Title of the item */
  title: string;
  /** Author of the item */
  author: string;
  /** Indicates whether the item is currently checked out */
  isCheckedOut: boolean;
  /** Get item details for display */
  getDisplayInfo(): string;
  /** Check if item can be checked out */
  canCheckout(): boolean;
  /** Process checkout */
  checkout(): void;
  /** Process return */
  return(): void;
}

/**
 * Physical book implementation
 */
class PhysicalBook implements LibraryItemInterface {
  constructor(
    public id: number,
    public title: string,
    public author: string,
    public isCheckedOut = false,
    private condition = 'good',
  ) {}

  getDisplayInfo(): string {
    return `📚 ${this.title} by ${this.author} (Physical Book) - Condition: ${this.condition}`;
  }

  canCheckout(): boolean {
    return !this.isCheckedOut && this.condition !== 'damaged';
  }

  checkout(): void {
    this.isCheckedOut = true;
  }

  return(): void {
    this.isCheckedOut = false;
  }
}

/**
 * E-book implementation
 */
class EBook implements LibraryItemInterface {
  constructor(
    public id: number,
    public title: string,
    public author: string,
    public isCheckedOut = false,
    private maxLicenses = 3,
    private currentLicenses = 0,
  ) {}

  getDisplayInfo(): string {
    return `📱 ${this.title} by ${this.author} (E-Book) - Available Licenses: ${this.maxLicenses - this.currentLicenses}`;
  }

  canCheckout(): boolean {
    return this.currentLicenses < this.maxLicenses;
  }

  checkout(): void {
    if (this.canCheckout()) {
      this.currentLicenses++;
      this.isCheckedOut = this.currentLicenses >= this.maxLicenses;
    }
  }

  return(): void {
    if (this.currentLicenses > 0) {
      this.currentLicenses--;
      this.isCheckedOut = this.currentLicenses >= this.maxLicenses;
    }
  }
}

/**
 * Audio book implementation
 */
class AudioBook implements LibraryItemInterface {
  constructor(
    public id: number,
    public title: string,
    public author: string,
    public isCheckedOut = false,
    private duration = 0,
  ) {}

  getDisplayInfo(): string {
    return `🎧 ${this.title} by ${this.author} (Audio Book) - Duration: ${this.duration}min`;
  }

  canCheckout(): boolean {
    return !this.isCheckedOut;
  }

  checkout(): void {
    this.isCheckedOut = true;
  }

  return(): void {
    this.isCheckedOut = false;
  }
}

/**
 * Interface for report generation strategies
 */
interface ReportStrategyInterface {
  generateReport(students: StudentInterface[], items: LibraryItemInterface[]): void;
}

/**
 * Simple text report implementation
 */
class SimpleTextReport implements ReportStrategyInterface {
  generateReport(students: StudentInterface[], items: LibraryItemInterface[]): void {
    console.log('=== Simple Library Report ===');
    console.log('Students:');
    for (const s of students) {
      console.log(`- ${s.name}`);
    }
    console.log('\nItems:');
    for (const i of items) {
      console.log(`- ${i.getDisplayInfo()}`);
    }
  }
}

/**
 * Detailed report implementation
 */
class DetailedReport implements ReportStrategyInterface {
  generateReport(students: StudentInterface[], items: LibraryItemInterface[]): void {
    console.log('=== Detailed Library Report ===');
    console.log('\nStudents Summary:');
    console.log(`Total Students: ${students.length}`);
    for (const s of students) {
      console.log(`- ID: ${s.id}, Name: ${s.name}`);
    }

    console.log('\nItems Summary:');
    const checkedOut = items.filter((i) => i.isCheckedOut).length;
    console.log(`Total Items: ${items.length}`);
    console.log(`Checked Out: ${checkedOut}`);
    console.log(`Available: ${items.length - checkedOut}`);

    console.log('\nDetailed Items List:');
    for (const i of items) {
      console.log(`- ${i.getDisplayInfo()}`);
    }
  }
}

/**
 * Manages student-related operations
 */
class StudentManager {
  private students: StudentInterface[] = [];

  /**
   * Registers a new student in the library system.
   * @param {StudentInterface} student - The student to be added
   */
  addStudent(student: StudentInterface): void {
    this.students.push(student);
  }

  /**
   * Finds a student by their ID
   * @param {number} studentId - The ID of the student to find
   * @returns {StudentInterface | undefined} The found student or undefined
   */
  findStudent(studentId: number): StudentInterface | undefined {
    return this.students.find((s) => s.id === studentId);
  }

  /**
   * Gets all registered students
   * @returns {StudentInterface[]} Array of all students
   */
  getAllStudents(): StudentInterface[] {
    return [...this.students];
  }
}

/**
 * Manages library items
 */
class LibraryItemManager {
  private items: LibraryItemInterface[] = [];

  /**
   * Adds a new item to the library's collection.
   * @param {LibraryItemInterface} item - The item to be added
   */
  addItem(item: LibraryItemInterface): void {
    this.items.push(item);
  }

  /**
   * Finds an item by its ID
   * @param {number} itemId - The ID of the item to find
   * @returns {LibraryItemInterface | undefined} The found item or undefined
   */
  findItem(itemId: number): LibraryItemInterface | undefined {
    return this.items.find((d) => d.id === itemId);
  }

  /**
   * Gets all items in the library
   * @returns {LibraryItemInterface[]} Array of all items
   */
  getAllItems(): LibraryItemInterface[] {
    return [...this.items];
  }
}

/**
 * Manages lending operations
 */
class LendingManager {
  constructor(
    private studentManager: StudentManager,
    private itemManager: LibraryItemManager,
  ) {}

  /**
   * Processes a document checkout request for a student.
   * @param {number} studentId - The ID of the student checking out the document
   * @param {number} documentId - The ID of the document to be checked out
   */
  checkoutItem(studentId: number, itemId: number): void {
    const student = this.studentManager.findStudent(studentId);
    const item = this.itemManager.findItem(itemId);

    if (student && item && item.canCheckout()) {
      item.checkout();
      console.log(`${student.name} checked out ${item.title}`);
    } else {
      console.log('Checkout failed');
    }
  }

  /**
   * Processes the return of a checked-out document.
   * @param {number} documentId - The ID of the document being returned
   */
  returnItem(itemId: number): void {
    const item = this.itemManager.findItem(itemId);

    if (item?.isCheckedOut) {
      item.return();
      console.log(`${item.title} has been returned`);
    } else {
      console.log('Return failed');
    }
  }
}

/**
 * Generates reports about the library system
 */
class ReportGenerator {
  constructor(
    private studentManager: StudentManager,
    private itemManager: LibraryItemManager,
    private reportStrategy: ReportStrategyInterface,
  ) {}

  /**
   * Generates and displays a report of all students and documents in the library.
   * Shows the status of each document (checked out or available).
   */
  generateReport(): void {
    this.reportStrategy.generateReport(this.studentManager.getAllStudents(), this.itemManager.getAllItems());
  }

  /**
   * Sets the report generation strategy
   * @param {ReportStrategyInterface} strategy - The new report generation strategy
   */
  setReportStrategy(strategy: ReportStrategyInterface): void {
    this.reportStrategy = strategy;
  }
}

/**
 * Main Library class that coordinates between different managers
 */
class Library {
  private studentManager: StudentManager;
  private itemManager: LibraryItemManager;
  private lendingManager: LendingManager;
  private reportGenerator: ReportGenerator;

  constructor(reportStrategy: ReportStrategyInterface = new SimpleTextReport()) {
    this.studentManager = new StudentManager();
    this.itemManager = new LibraryItemManager();
    this.lendingManager = new LendingManager(this.studentManager, this.itemManager);
    this.reportGenerator = new ReportGenerator(this.studentManager, this.itemManager, reportStrategy);
  }

  addStudent(student: StudentInterface): void {
    this.studentManager.addStudent(student);
  }

  addItem(item: LibraryItemInterface): void {
    this.itemManager.addItem(item);
  }

  checkoutItem(studentId: number, itemId: number): void {
    this.lendingManager.checkoutItem(studentId, itemId);
  }

  returnItem(itemId: number): void {
    this.lendingManager.returnItem(itemId);
  }

  generateReport(): void {
    this.reportGenerator.generateReport();
  }

  setReportStrategy(strategy: ReportStrategyInterface): void {
    this.reportGenerator.setReportStrategy(strategy);
  }
}

// Usage example
const library = new Library();
library.addStudent({ id: 1, name: 'John Doe' });
library.addItem(new PhysicalBook(1, 'The Great Gatsby', 'F. Scott Fitzgerald'));
library.addItem(new EBook(2, 'Digital Marketing', 'John Smith', false, 3));
library.addItem(new AudioBook(3, 'The Art of War', 'Sun Tzu', false, 180));
library.checkoutItem(1, 1);
library.generateReport();

export {};
