/**
 * Basic example of a file system using a binary tree.
 * ⚠️ Beware: purpose is about using Typescript and "basic binary search tree", not about performance or efficiency.
 */

/**
 * Interface representing a file system item.
 */
interface FileSystemItemInterface {
  /** The name of the item. */
  name: string;
  /** The path of the item. */
  path: string;
  /** The parent directory of the item. */
  parent: Directory | null;
  /** Checks if the item is a directory. */
  isDirectory(): boolean;
  /** Returns the size of the item. */
  size(): number;
}

/**
 * Class representing a file.
 */
class File implements FileSystemItemInterface {
  /** The name of the file. */
  name: string;
  /** The path of the file. */
  path: string;
  /** The parent directory of the file. */
  parent: Directory | null;
  /** The content of the file. */
  private content: string;

  /**
   * Creates a new file.
   * @param name - The name of the file.
   * @param parent - The parent directory.
   * @param content - The initial content of the file.
   */
  constructor(name: string, parent: Directory | null, content = "") {
    this.name = name;
    this.parent = parent;
    this.content = content;
    this.path = parent ? `${parent.path}/${name}` : name;
  }

  /** @returns false, as this is not a directory. */
  isDirectory(): boolean {
    return false;
  }

  /** @returns The size of the file content. */
  size(): number {
    return this.content.length;
  }

  /** @returns The content of the file. */
  getContent(): string {
    return this.content;
  }

  /**
   * Sets the content of the file.
   * @param content - The new content of the file.
   */
  setContent(content: string): void {
    this.content = content;
  }
}

/**
 * Class representing a directory.
 */
class Directory implements FileSystemItemInterface {
  /** The name of the directory. */
  name: string;
  /** The path of the directory. */
  path: string;
  /** The parent directory of this directory. */
  parent: Directory | null;
  /** The children items in the directory. */
  children: Map<string, FileSystemItemInterface>;

  /**
   * Creates a new directory.
   * @param name - The name of the directory.
   * @param parent - The parent directory.
   */
  constructor(name: string, parent: Directory | null) {
    this.name = name;
    this.parent = parent;
    this.children = new Map();
    this.path = parent ? `${parent.path}/${name}` : name;
  }

  /** @returns true, as this is a directory. */
  isDirectory(): boolean {
    return true;
  }

  /** @returns The total size of all items in the directory. */
  size(): number {
    let totalSize = 0;
    for (const item of this.children.values()) {
      totalSize += item.size();
    }
    return totalSize;
  }

  /**
   * Adds an item to the directory.
   * @param item - The item to add.
   */
  addItem(item: FileSystemItemInterface): void {
    this.children.set(item.name, item);
  }

  /**
   * Retrieves an item by name.
   * @param name - The name of the item.
   * @returns The item if found, otherwise undefined.
   */
  getItem(name: string): FileSystemItemInterface | undefined {
    return this.children.get(name);
  }

  /**
   * Removes an item by name.
   * @param name - The name of the item to remove.
   * @returns true if the item was removed, otherwise false.
   */
  removeItem(name: string): boolean {
    return this.children.delete(name);
  }

  /** @returns A list of names of items in the directory. */
  list(): string[] {
    return Array.from(this.children.keys());
  }
}

/**
 * Class representing the file system.
 */
class FileSystem {
  /** The root directory of the file system. */
  private root: Directory;

  /** Initializes the file system with a root directory. */
  constructor() {
    this.root = new Directory("", null);
  }

  /**
   * Retrieves a directory from a given path.
   * @param path - The path to the directory.
   * @returns The directory if found, otherwise null.
   */
  private getDirectoryFromPath(path: string): Directory | null {
    const parts = path.split("/").filter((part) => part.length > 0);
    let current: Directory = this.root;

    for (const part of parts) {
      const next = current.getItem(part);
      if (!next || !next.isDirectory()) {
        return null;
      }
      current = next as Directory;
    }

    return current;
  }

  /**
   * Creates a new directory at the specified path.
   * @param path - The path where the directory should be created.
   * @returns true if the directory was created, otherwise false.
   */
  mkdir(path: string): boolean {
    const parts = path.split("/").filter((part) => part.length > 0);
    let current: Directory = this.root;

    for (const part of parts) {
      let next = current.getItem(part);
      if (!next) {
        next = new Directory(part, current);
        current.addItem(next);
      } else if (!next.isDirectory()) {
        return false;
      }
      current = next as Directory;
    }

    return true;
  }

  /**
   * Writes a file at the specified path with the given content.
   * @param path - The path where the file should be written.
   * @param content - The content of the file.
   * @returns true if the file was written, otherwise false.
   */
  writeFile(path: string, content: string): boolean {
    const parts = path.split("/");
    const fileName = parts.pop() || "";
    const dirPath = parts.join("/");
    const dir = this.getDirectoryFromPath(dirPath);

    if (!dir) {
      return false;
    }

    const existingItem = dir.getItem(fileName);
    if (existingItem?.isDirectory()) {
      return false;
    }

    const file = new File(fileName, dir, content);
    dir.addItem(file);
    return true;
  }

  /**
   * Reads the content of a file at the specified path.
   * @param path - The path of the file to read.
   * @returns The content of the file if found, otherwise null.
   */
  readFile(path: string): string | null {
    const parts = path.split("/");
    const fileName = parts.pop() || "";
    const dirPath = parts.join("/");
    const dir = this.getDirectoryFromPath(dirPath);

    if (!dir) {
      return null;
    }

    const item = dir.getItem(fileName);
    if (!item || item.isDirectory()) {
      return null;
    }

    return (item as File).getContent();
  }

  /**
   * Lists the contents of a directory at the specified path.
   * @param path - The path of the directory to list.
   * @returns An array of item names if found, otherwise null.
   */
  ls(path: string): string[] | null {
    const dir = this.getDirectoryFromPath(path);
    return dir ? dir.list() : null;
  }

  /**
   * Removes an item at the specified path.
   * @param path - The path of the item to remove.
   * @returns true if the item was removed, otherwise false.
   */
  rm(path: string): boolean {
    const parts = path.split("/");
    const itemName = parts.pop() || "";
    const dirPath = parts.join("/");
    const dir = this.getDirectoryFromPath(dirPath);

    if (!dir) {
      return false;
    }

    return dir.removeItem(itemName);
  }

  /**
   * Calculates the size of a directory or file at the specified path.
   * @param path - The path of the item to calculate size.
   * @returns The size if found, otherwise null.
   */
  du(path: string): number | null {
    const item = this.getDirectoryFromPath(path);
    return item ? item.size() : null;
  }
}

/**
 * Example usage of the FileSystem class.
 */
const fs = new FileSystem();

fs.mkdir("/home/user/documents");
fs.mkdir("/home/user/images");
fs.writeFile("/home/user/documents/rapport.txt", "Contenu du rapport");
fs.writeFile("/home/user/images/photo.jpg", "Données binaires de l'image");
fs.mkdir("/home/user/documents/projets");
fs.writeFile("/home/user/documents/projets/projet1.txt", "Détails du projet 1");

console.log("Contenu de /home/user:", fs.ls("/home/user"));
console.log("Contenu de /home/user/documents:", fs.ls("/home/user/documents"));
console.log(
  "Lecture de /home/user/documents/rapport.txt:",
  fs.readFile("/home/user/documents/rapport.txt")
);
console.log("Taille de /home/user/documents:", fs.du("/home/user/documents"));

fs.rm("/home/user/documents/rapport.txt");
console.log(
  "Contenu de /home/user/documents après suppression:",
  fs.ls("/home/user/documents")
);

export type {};
