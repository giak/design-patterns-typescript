interface FileNodeInterface {
  name: string;
  isDirectory: boolean;
  left: FileNodeInterface | null;
  right: FileNodeInterface | null;
}

function assertNotNull<T>(value: T | null, errorMessage: string): T {
  if (value === null) {
    throw new Error(errorMessage);
  }
  return value;
}

class FileNode implements FileNodeInterface {
  constructor(
    public name: string,
    public isDirectory: boolean,
    public left: FileNode | null = null, // Represents a subdirectory
    public right: FileNode | null = null, // Represents a file or the next sibling
  ) {}
}

class FileSystem implements Iterable<FileNodeInterface> {
  constructor(public root: FileNodeInterface | null) {
    assertNotNull(root, 'Root node cannot be null');
  }

  private *depthFirstTraversal(node: FileNodeInterface | null): Generator<FileNodeInterface> {
    const currentNode = assertNotNull(node, 'Node cannot be null during traversal');
    yield currentNode;
    if (currentNode.left) yield* this.depthFirstTraversal(currentNode.left);
    if (currentNode.right) yield* this.depthFirstTraversal(currentNode.right);
  }

  *[Symbol.iterator](): Iterator<FileNodeInterface> {
    yield* this.depthFirstTraversal(this.root);
  }

  findFile(fileName: string): FileNodeInterface | null {
    assertNotNull(this.root, 'Root node cannot be null when searching for a file');
    for (const node of this) {
      if (node.name === fileName) return node;
    }
    return null;
  }
}

function printFileSystem(node: FileNodeInterface | null, indent = ''): void {
  if (node === null) return;

  console.log(`${indent}${node.isDirectory ? '📁' : '📄'} ${node.name}`);
  printFileSystem(node.left, `${indent}  `); // Subdirectory or next file
  printFileSystem(node.right, indent); // Sibling directory/file
}

const fileSystem = new FileSystem(
  new FileNode(
    'root',
    true,
    new FileNode(
      'src',
      true,
      new FileNode('index.ts', false),
      new FileNode('components', true, new FileNode('Button.tsx', false), new FileNode('Header.tsx', false)),
    ),
    new FileNode('package.json', false),
  ),
);

// Parcourir l'arborescence des fichiers
for (const node of fileSystem) {
  console.log(node.name);
}

// Afficher la structure du système de fichiers
printFileSystem(fileSystem.root);

// Rechercher un fichier spécifique
const file = fileSystem.findFile('Header.tsx');
if (file) {
  console.log(`Found file: ${file.name}`);
} else {
  console.log('File not found');
}

export type {};
