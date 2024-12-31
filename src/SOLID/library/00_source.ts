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
 * Library management system that handles students and documents.
 * Provides functionality for checking out documents, returning them,
 * and generating reports.
 */
class Library {
  /** Array to store registered students */
  private students: StudentInterface[] = [];
  /** Array to store library documents */
  private documents: DocumentInterface[] = [];

  /**
   * Registers a new student in the library system.
   * @param {StudentInterface} student - The student to be added
   */
  addStudent(student: StudentInterface): void {
    this.students.push(student);
  }

  /**
   * Adds a new document to the library's collection.
   * @param {DocumentInterface} document - The document to be added
   */
  addDocument(document: DocumentInterface): void {
    this.documents.push(document);
  }

  /**
   * Processes a document checkout request for a student.
   * @param {number} studentId - The ID of the student checking out the document
   * @param {number} documentId - The ID of the document to be checked out
   */
  checkoutDocument(studentId: number, documentId: number): void {
    const student = this.students.find((s) => s.id === studentId);
    const document = this.documents.find((d) => d.id === documentId);

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
    const document = this.documents.find((d) => d.id === documentId);

    if (document?.isCheckedOut) {
      document.isCheckedOut = false;
      console.log(`${document.title} has been returned`);
    } else {
      console.log('Return failed');
    }
  }

  /**
   * Generates and displays a report of all students and documents in the library.
   * Shows the status of each document (checked out or available).
   */
  generateReport(): void {
    console.log('Library Report');
    console.log('Students:');
    for (const s of this.students) {
      console.log(`- ${s.name}`);
    }
    console.log('Documents:');
    for (const d of this.documents) {
      console.log(`- ${d.title} (${d.isCheckedOut ? 'checked out' : 'available'})`);
    }
  }
}

// Usage example
const library = new Library();
library.addStudent({ id: 1, name: 'John Doe' });
library.addDocument({ id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isCheckedOut: false });
library.checkoutDocument(1, 1);
library.generateReport();

export {};
