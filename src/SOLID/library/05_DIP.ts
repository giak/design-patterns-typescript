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
 * Base interface for identifiable items
 */
interface IdentifiableInterface {
  /** Unique identifier for the item */
  id: number;
}

/**
 * Base interface for items with metadata
 */
interface ItemMetadataInterface {
  /** Title of the item */
  title: string;
  /** Author of the item */
  author: string;
}

/**
 * Interface for items that can display their information
 */
interface DisplayableInterface {
  /** Get item details for display */
  getDisplayInfo(): string;
}

/**
 * Interface for items that can be checked out
 */
interface CheckoutableInterface {
  /** Check if item can be checked out */
  canCheckout(): boolean;
  /** Process checkout */
  checkout(): void;
  /** Process return */
  return(): void;
  /** Check if item is currently checked out */
  isCheckedOut(): boolean;
}

/**
 * Combined interface for library items
 */
interface LibraryItemInterface
  extends IdentifiableInterface,
    ItemMetadataInterface,
    DisplayableInterface,
    CheckoutableInterface {}

/**
 * Abstract base class for all library items
 * Implements common behavior and enforces LSP
 */
abstract class LibraryItemBase implements LibraryItemInterface {
  private _isCheckedOut = false;

  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly author: string,
  ) {}

  abstract getDisplayInfo(): string;

  canCheckout(): boolean {
    return !this._isCheckedOut;
  }

  checkout(): void {
    if (!this.canCheckout()) {
      throw new Error('Item cannot be checked out');
    }
    this._isCheckedOut = true;
  }

  return(): void {
    this._isCheckedOut = false;
  }

  isCheckedOut(): boolean {
    return this._isCheckedOut;
  }

  protected get checkedOutStatus(): boolean {
    return this._isCheckedOut;
  }

  protected set checkedOutStatus(value: boolean) {
    this._isCheckedOut = value;
  }
}

/**
 * Physical book implementation
 */
class PhysicalBook extends LibraryItemBase {
  constructor(
    id: number,
    title: string,
    author: string,
    private condition: 'good' | 'damaged' = 'good',
  ) {
    super(id, title, author);
  }

  getDisplayInfo(): string {
    return `📚 ${this.title} by ${this.author} (Physical Book) - Condition: ${this.condition}`;
  }

  override canCheckout(): boolean {
    return super.canCheckout() && this.condition !== 'damaged';
  }
}

/**
 * E-book implementation with multiple license management
 */
class EBook extends LibraryItemBase {
  private currentLicenses = 0;

  constructor(
    id: number,
    title: string,
    author: string,
    private maxLicenses = 3,
  ) {
    super(id, title, author);
  }

  getDisplayInfo(): string {
    return `📱 ${this.title} by ${this.author} (E-Book) - Available Licenses: ${
      this.maxLicenses - this.currentLicenses
    }`;
  }

  override canCheckout(): boolean {
    return this.currentLicenses < this.maxLicenses;
  }

  override checkout(): void {
    if (!this.canCheckout()) {
      throw new Error('No available licenses');
    }
    this.currentLicenses++;
    this.checkedOutStatus = this.currentLicenses >= this.maxLicenses;
  }

  override return(): void {
    if (this.currentLicenses > 0) {
      this.currentLicenses--;
      this.checkedOutStatus = this.currentLicenses >= this.maxLicenses;
    }
  }

  override isCheckedOut(): boolean {
    return this.currentLicenses >= this.maxLicenses;
  }
}

/**
 * Audio book implementation
 */
class AudioBook extends LibraryItemBase {
  constructor(
    id: number,
    title: string,
    author: string,
    private duration = 0,
  ) {
    super(id, title, author);
  }

  getDisplayInfo(): string {
    return `🎧 ${this.title} by ${this.author} (Audio Book) - Duration: ${this.duration}min`;
  }
}

/**
 * Interface for report generation strategies
 */
interface ReportStrategyInterface {
  generateReport(students: StudentInterface[], items: DisplayableInterface[]): void;
}

/**
 * Simple text report implementation
 */
class SimpleTextReport implements ReportStrategyInterface {
  generateReport(students: StudentInterface[], items: DisplayableInterface[]): void {
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
    const checkedOut = items.filter((i) => i.isCheckedOut()).length;
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
 * Repository interface for students
 */
interface StudentRepositoryInterface {
  add(student: StudentInterface): void;
  findById(id: number): StudentInterface | undefined;
  getAll(): StudentInterface[];
}

/**
 * Repository interface for library items
 */
interface LibraryItemRepositoryInterface {
  add(item: LibraryItemInterface): void;
  findById(id: number): LibraryItemInterface | undefined;
  getAll(): LibraryItemInterface[];
}

/**
 * In-memory implementation of student repository
 */
class InMemoryStudentRepository implements StudentRepositoryInterface {
  private students: StudentInterface[] = [];

  add(student: StudentInterface): void {
    this.students.push(student);
  }

  findById(id: number): StudentInterface | undefined {
    return this.students.find((s) => s.id === id);
  }

  getAll(): StudentInterface[] {
    return [...this.students];
  }
}

/**
 * In-memory implementation of library item repository
 */
class InMemoryLibraryItemRepository implements LibraryItemRepositoryInterface {
  private items: LibraryItemInterface[] = [];

  add(item: LibraryItemInterface): void {
    this.items.push(item);
  }

  findById(id: number): LibraryItemInterface | undefined {
    return this.items.find((d) => d.id === id);
  }

  getAll(): LibraryItemInterface[] {
    return [...this.items];
  }
}

/**
 * Logger interface for dependency inversion
 */
interface LoggerInterface {
  log(message: string): void;
}

/**
 * Console implementation of logger
 */
class ConsoleLogger implements LoggerInterface {
  log(message: string): void {
    console.log(message);
  }
}

/**
 * Manages student-related operations
 */
class StudentManager {
  constructor(private studentRepository: StudentRepositoryInterface) {}

  addStudent(student: StudentInterface): void {
    this.studentRepository.add(student);
  }

  findStudent(studentId: number): StudentInterface | undefined {
    return this.studentRepository.findById(studentId);
  }

  getAllStudents(): StudentInterface[] {
    return this.studentRepository.getAll();
  }
}

/**
 * Manages library items
 */
class LibraryItemManager {
  constructor(private itemRepository: LibraryItemRepositoryInterface) {}

  addItem(item: LibraryItemInterface): void {
    this.itemRepository.add(item);
  }

  findItem(itemId: number): LibraryItemInterface | undefined {
    return this.itemRepository.findById(itemId);
  }

  getAllItems(): LibraryItemInterface[] {
    return this.itemRepository.getAll();
  }
}

/**
 * Manages lending operations
 */
class LendingManager {
  constructor(
    private studentManager: StudentManager,
    private itemManager: LibraryItemManager,
    private logger: LoggerInterface,
  ) {}

  checkoutItem(studentId: number, itemId: number): void {
    const student = this.studentManager.findStudent(studentId);
    const item = this.itemManager.findItem(itemId);

    if (student && item && item.canCheckout()) {
      item.checkout();
      this.logger.log(`${student.name} checked out ${item.title}`);
    } else {
      this.logger.log('Checkout failed');
    }
  }

  returnItem(itemId: number): void {
    const item = this.itemManager.findItem(itemId);

    if (item?.isCheckedOut()) {
      item.return();
      this.logger.log(`${item.title} has been returned`);
    } else {
      this.logger.log('Return failed');
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
    private logger: LoggerInterface,
  ) {}

  generateReport(): void {
    this.reportStrategy.generateReport(this.studentManager.getAllStudents(), this.itemManager.getAllItems());
  }

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

  constructor(
    studentRepository: StudentRepositoryInterface = new InMemoryStudentRepository(),
    itemRepository: LibraryItemRepositoryInterface = new InMemoryLibraryItemRepository(),
    reportStrategy: ReportStrategyInterface = new SimpleTextReport(),
    logger: LoggerInterface = new ConsoleLogger(),
  ) {
    this.studentManager = new StudentManager(studentRepository);
    this.itemManager = new LibraryItemManager(itemRepository);
    this.lendingManager = new LendingManager(this.studentManager, this.itemManager, logger);
    this.reportGenerator = new ReportGenerator(this.studentManager, this.itemManager, reportStrategy, logger);
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

// Add a student
library.addStudent({ id: 1, name: 'John Doe' });

// Create different types of items
const physicalBook = new PhysicalBook(1, 'The Great Gatsby', 'F. Scott Fitzgerald');
const damagedBook = new PhysicalBook(2, 'Damaged Book', 'Some Author', 'damaged');
const eBook = new EBook(3, 'Digital Marketing', 'John Smith', 3);
const audioBook = new AudioBook(4, 'The Art of War', 'Sun Tzu', 180);

// Add items to library
library.addItem(physicalBook);
library.addItem(damagedBook);
library.addItem(eBook);
library.addItem(audioBook);

// Try checking out items
library.checkoutItem(1, 1); // Should succeed
library.checkoutItem(1, 2); // Should fail (damaged book)
library.checkoutItem(1, 3); // Should succeed (eBook with available license)

// Generate reports
library.generateReport();
library.setReportStrategy(new DetailedReport());
library.generateReport();

export {};
