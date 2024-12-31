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
 * Represents a document that can be checked out from the library.
 * @interface DocumentInterface
 */
interface DocumentInterface {
  /** Unique identifier for the document */
  id: number;
  /** Title of the document */
  title: string;
  /** Author of the document */
  author: string;
  /** Indicates whether the document is currently checked out */
  isCheckedOut: boolean;
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
 * Manages document-related operations
 */
class DocumentManager {
  private documents: DocumentInterface[] = [];

  /**
   * Adds a new document to the library's collection.
   * @param {DocumentInterface} document - The document to be added
   */
  addDocument(document: DocumentInterface): void {
    this.documents.push(document);
  }

  /**
   * Finds a document by its ID
   * @param {number} documentId - The ID of the document to find
   * @returns {DocumentInterface | undefined} The found document or undefined
   */
  findDocument(documentId: number): DocumentInterface | undefined {
    return this.documents.find((d) => d.id === documentId);
  }

  /**
   * Gets all documents in the library
   * @returns {DocumentInterface[]} Array of all documents
   */
  getAllDocuments(): DocumentInterface[] {
    return [...this.documents];
  }
}

/**
 * Manages lending operations (checkouts and returns)
 */
class LendingManager {
  constructor(
    private studentManager: StudentManager,
    private documentManager: DocumentManager,
  ) {}

  /**
   * Processes a document checkout request for a student.
   * @param {number} studentId - The ID of the student checking out the document
   * @param {number} documentId - The ID of the document to be checked out
   */
  checkoutDocument(studentId: number, documentId: number): void {
    const student = this.studentManager.findStudent(studentId);
    const document = this.documentManager.findDocument(documentId);

    if (student && document && !document.isCheckedOut) {
      document.isCheckedOut = true;
      console.log(`${student.name} checked out ${document.title}`);
    } else {
      console.log('Checkout failed');
    }
  }

  /**
   * Processes the return of a checked-out document.
   * @param {number} documentId - The ID of the document being returned
   */
  returnDocument(documentId: number): void {
    const document = this.documentManager.findDocument(documentId);

    if (document?.isCheckedOut) {
      document.isCheckedOut = false;
      console.log(`${document.title} has been returned`);
    } else {
      console.log('Return failed');
    }
  }
}

/**
 * Generates various reports about the library system
 */
class ReportGenerator {
  constructor(
    private studentManager: StudentManager,
    private documentManager: DocumentManager,
  ) {}

  /**
   * Generates and displays a report of all students and documents in the library.
   * Shows the status of each document (checked out or available).
   */
  generateReport(): void {
    console.log('Library Report');
    console.log('Students:');
    for (const s of this.studentManager.getAllStudents()) {
      console.log(`- ${s.name}`);
    }
    console.log('Documents:');
    for (const d of this.documentManager.getAllDocuments()) {
      console.log(`- ${d.title} (${d.isCheckedOut ? 'checked out' : 'available'})`);
    }
  }
}

/**
 * Main Library class that coordinates between different managers
 */
class Library {
  private studentManager: StudentManager;
  private documentManager: DocumentManager;
  private lendingManager: LendingManager;
  private reportGenerator: ReportGenerator;

  constructor() {
    this.studentManager = new StudentManager();
    this.documentManager = new DocumentManager();
    this.lendingManager = new LendingManager(this.studentManager, this.documentManager);
    this.reportGenerator = new ReportGenerator(this.studentManager, this.documentManager);
  }

  addStudent(student: StudentInterface): void {
    this.studentManager.addStudent(student);
  }

  addDocument(document: DocumentInterface): void {
    this.documentManager.addDocument(document);
  }

  checkoutDocument(studentId: number, documentId: number): void {
    this.lendingManager.checkoutDocument(studentId, documentId);
  }

  returnDocument(documentId: number): void {
    this.lendingManager.returnDocument(documentId);
  }

  generateReport(): void {
    this.reportGenerator.generateReport();
  }
}

// Usage example
const library = new Library();
library.addStudent({ id: 1, name: 'John Doe' });
library.addDocument({ id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isCheckedOut: false });
library.checkoutDocument(1, 1);
library.generateReport();

export {};
