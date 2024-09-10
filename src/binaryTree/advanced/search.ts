// Basic example of a search engine using a binary search tree.
// ⚠️ Beware : purpose is about using Typescript and "basic binary search tree", not about performance or efficiency.

type DocumentIdType = number;

/**
 * Interface representing a document.
 */
interface DocumentInterface {
  id: DocumentIdType; // Unique identifier for the document
  content: string; // Content of the document
}

/**
 * Class representing a node in the binary search tree.
 */
class TreeNode<T> {
  /**
   * Creates a TreeNode.
   * @param key - The key of the node.
   * @param value - The value associated with the key.
   * @param left - The left child node.
   * @param right - The right child node.
   */
  constructor(
    public key: string,
    public value: Set<T>,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

/**
 * Class representing a binary search tree.
 */
class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null; // Root node of the tree

  /**
   * Inserts a new key-value pair into the tree.
   * @param key - The key to insert.
   * @param value - The value associated with the key.
   */
  insert(key: string, value: T): void {
    this.root = this.insertNode(this.root, key, value);
  }

  /**
   * Helper function to insert a node.
   * @param node - The current node.
   * @param key - The key to insert.
   * @param value - The value associated with the key.
   * @returns The inserted node.
   */
  private insertNode(
    node: TreeNode<T> | null,
    key: string,
    value: T
  ): TreeNode<T> {
    if (node === null) {
      return new TreeNode(key, new Set([value]));
    }

    // Traverse left or right based on key comparison
    if (key < node.key) {
      node.left = this.insertNode(node.left, key, value);
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key, value);
    } else {
      // If key already exists, add the value to the set
      node.value.add(value);
    }

    return node;
  }

  /**
   * Searches for a key and returns the associated values.
   * @param key - The key to search for.
   * @returns A set of values associated with the key or null if not found.
   */
  search(key: string): Set<T> | null {
    return this.searchNode(this.root, key);
  }

  /**
   * Helper function to search for a key.
   * @param node - The current node.
   * @param key - The key to search for.
   * @returns A set of values associated with the key or null if not found.
   */
  private searchNode(node: TreeNode<T> | null, key: string): Set<T> | null {
    if (node === null) {
      return null;
    }

    if (key === node.key) {
      return node.value;
    }
    // Continue searching left or right
    if (key < node.key) {
      return this.searchNode(node.left, key);
    }
    return this.searchNode(node.right, key);
  }
}

/**
 * Class representing a search engine for documents.
 */
class SearchEngine {
  private indexBinaryTree: BinarySearchTree<DocumentIdType>; // Index of documents
  private documents: Map<DocumentIdType, DocumentInterface>; // Collection of documents

  constructor() {
    this.indexBinaryTree = new BinarySearchTree<DocumentIdType>();
    this.documents = new Map<DocumentIdType, DocumentInterface>();
  }

  /**
   * Adds a document to the index and stores it in the document collection.
   * @param doc - The document to add.
   * @example
   * const doc = { id: 1, content: "Le chat mange une souris" };
   * searchEngine.addDocument(doc);
   */
  addDocument(doc: DocumentInterface): void {
    this.documents.set(doc.id, doc);
    const words = this.tokenize(doc.content);
    for (const word of words) {
      this.indexBinaryTree.insert(word, doc.id);
    }
  }

  /**
   * Tokenizes the input text into words.
   * @param text - The text to tokenize.
   * @returns A generator of words.
   */
  *tokenize(text: string): Generator<string> {
    const regex = /\b\w+\b/g;
    let match: RegExpExecArray | null;
    while (true) {
      match = regex.exec(text.toLowerCase());
      if (match === null) break;
      yield match[0];
    }
  }

  /**
   * Searches for documents matching the query.
   * @param query - The search query.
   * @returns An array of documents matching the query.
   */
  search(query: string): DocumentInterface[] {
    const words = Array.from(this.tokenize(query));
    if (words.length === 0) return [];

    const resultSets = words.map(
      (word) => this.indexBinaryTree.search(word) ?? new Set<DocumentIdType>()
    );

    // Calculate intersection of document IDs
    const intersection = resultSets.reduce((acc, b) => {
      const newAcc = new Set<DocumentIdType>();
      for (const x of b) {
        if (acc.has(x)) {
          newAcc.add(x);
        }
      }
      return newAcc;
    }, resultSets[0]);

    return Array.from(intersection)
      .map((id) => this.documents.get(id))
      .filter((doc): doc is DocumentInterface => doc !== undefined);
  }

  /**
   * Returns statistics about the documents.
   * @returns An object containing the document count and word count.
   */
  getStats(): { documentCount: number; wordCount: number } {
    return {
      documentCount: this.documents.size,
      wordCount: this.countWords(this.indexBinaryTree.search.bind(this.indexBinaryTree)),
    };
  }

  /**
   * Counts unique words in the index.
   * @param searchFn - The function to search for words.
   * @returns The count of unique words.
   */
  private countWords(
    searchFn: (key: string) => Set<DocumentIdType> | null
  ): number {
    let count = 0;
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i);
      if (searchFn(letter) !== null) count++;
    }
    return count;
  }
}

// Example usage of the SearchEngine
const searchEngine = new SearchEngine();

const documents = [
  { id: 1, content: "Le chat mange une souris" },
  { id: 2, content: "Le chien aboie après le chat" },
  { id: 3, content: "La souris se cache du chat" },
  { id: 4, content: "Le chien aboie après la souris" },
  { id: 6, content: "La souris mange du fromage" },
  { id: 7, content: "Le chat miaule" },
  { id: 8, content: "Le chat dort" },
  { id: 9, content: "Le chat joue" },
  { id: 10, content: "Le chat mange" },
  { id: 11, content: "Le chat boit" },
  { id: 12, content: "Le chat respire" },
  { id: 13, content: "Le chat pense" },
  { id: 14, content: "Le chat rêve" },
  { id: 15, content: "Le chat réfléchit" },
  { id: 16, content: "Le chat mange des croquettes" },
];

for (const document of documents) {
  searchEngine.addDocument(document);
}

console.log(searchEngine.search("chat souris"));
console.log(searchEngine.search("chien aboie"));
console.log(searchEngine.search("chat mange"));
console.log(searchEngine.search("chat"));
console.log(searchEngine.getStats());

export type {};
