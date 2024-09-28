const ITEMS_PER_PAGE = 2;

function iterable<T>() {
  return (target: new (...args: any[]) => any) => {
    target.prototype[Symbol.iterator] = function* () {
      const keys = Object.keys(this);
      for (const key of keys) {
        yield this[key];
      }
    };
  };
}

type BookType = {
  id: number;
  title: string;
  author: string;
};

type PaginationInfoType = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
};

type PaginatedIteratorResultType<T> = [T, PaginationInfoType];

class PaginatedBookIterator implements Iterator<PaginatedIteratorResultType<BookType>> {
  private currentIndex = 0;
  private itemsPerPage: number;

  constructor(
    private books: BookType[],
    itemsPerPage = ITEMS_PER_PAGE,
  ) {
    this.itemsPerPage = itemsPerPage;
  }

  next(): IteratorResult<PaginatedIteratorResultType<BookType>> {
    if (this.currentIndex >= this.books.length) {
      return { done: true, value: undefined };
    }

    const book = this.books[this.currentIndex];
    const currentPage = Math.floor(this.currentIndex / this.itemsPerPage) + 1;
    const totalPages = Math.ceil(this.books.length / this.itemsPerPage);

    const paginationInfo: PaginationInfoType = {
      currentPage,
      totalPages,
      itemsPerPage: this.itemsPerPage,
    };

    this.currentIndex++;

    return {
      done: false,
      value: [book, paginationInfo],
    };
  }
}

@iterable<BookType>()
class BookCollection {
  private books: BookType[] = [];

  addBook(book: BookType): void {
    this.books.push(book);
  }

  [Symbol.iterator](): Iterator<BookType> {
    return this.books[Symbol.iterator]();
  }

  getPaginatedIterator(itemsPerPage = 2): PaginatedBookIterator {
    return new PaginatedBookIterator(this.books, itemsPerPage);
  }
}

import * as readline from 'node:readline';

function main() {
  const bookCollection = new BookCollection();

  // Add more books for a better pagination example
  bookCollection.addBook({ id: 1, title: '1984', author: 'George Orwell' });
  bookCollection.addBook({ id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' });
  bookCollection.addBook({ id: 3, title: 'Pride and Prejudice', author: 'Jane Austen' });
  bookCollection.addBook({ id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' });
  bookCollection.addBook({ id: 5, title: 'Moby Dick', author: 'Herman Melville' });
  bookCollection.addBook({ id: 6, title: 'The Catcher in the Rye', author: 'J.D. Salinger' });
  bookCollection.addBook({ id: 7, title: 'Lord of the Flies', author: 'William Golding' });
  bookCollection.addBook({ id: 8, title: 'Animal Farm', author: 'George Orwell' });

  console.log('Iterating through all books:');
  for (const book of bookCollection) {
    console.log(`${book.title} by ${book.author}`);
  }

  console.log('\nUsing paginated iterator:');
  const itemsPerPage = 3;
  let paginatedIterator = bookCollection.getPaginatedIterator(itemsPerPage);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function displayPage() {
    console.clear();
    console.log('=== Paginated Book List ===\n');
    let result = paginatedIterator.next();
    let count = 0;

    while (!result.done && count < itemsPerPage) {
      const [book, paginationInfo] = result.value;
      console.log(`${book.id}. ${book.title} by ${book.author}`);

      if (count === 0) {
        console.log(`\nPage ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`);
      }

      count++;
      result = paginatedIterator.next();
    }

    console.log('\n(n) Next page | (p) Previous page | (q) Quit');
    rl.question('Enter your choice: ', handleUserInput);
  }

  function handleUserInput(choice: string) {
    switch (choice.toLowerCase()) {
      case 'n':
        {
          // Move to the next page
          displayPage();
        }
        break;
      case 'p':
        {
          // Move to the previous page (reset iterator and move to the desired page)
          paginatedIterator = bookCollection.getPaginatedIterator(itemsPerPage);
          const currentPage = Math.floor(paginatedIterator['currentIndex'] / itemsPerPage);
          for (let i = 0; i < (currentPage - 1) * itemsPerPage; i++) {
            paginatedIterator.next();
          }
          displayPage();
        }
        break;
      case 'q':
        console.log('Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        rl.question('Enter your choice: ', handleUserInput);
    }
  }

  displayPage();
}

main();
