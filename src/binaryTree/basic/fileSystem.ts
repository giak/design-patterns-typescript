class FileNode {
  constructor(
    public name: string,
    public isDirectory: boolean,
    public left: FileNode | null = null, // Represents a subdirectory
    public right: FileNode | null = null // Represents a file or the next sibling
  ) {}
}

class FileSystem implements Iterable<FileNode> {
  constructor(public readonly root: FileNode | null) {}

  *[Symbol.iterator](): Iterator<FileNode> {
    function* depthFirstTraversal(node: FileNode | null): Generator<FileNode> {
      if (node) {
        yield node;
        if (node.left) yield* depthFirstTraversal(node.left);
        if (node.right) yield* depthFirstTraversal(node.right);
      }
    }

    yield* depthFirstTraversal(this.root);
  }

  findFile(fileName: string): FileNode | null {
    for (const node of this) {
      if (node.name === fileName) return node;
    }
    return null;
  }
}

function printFileSystem(node: FileNode | null, indent = ""): void {
  if (node === null) return;

  console.log(`${indent}${node.isDirectory ? "📁" : "📄"} ${node.name}`);
  printFileSystem(node.left, `${indent}  `); // Subdirectory or next file
  printFileSystem(node.right, indent); // Sibling directory/file
}

const fileSystem = new FileSystem(
  new FileNode(
    "root",
    true,
    new FileNode(
      "src",
      true,
      new FileNode("index.ts", false),
      new FileNode(
        "components",
        true,
        new FileNode("Button.tsx", false),
        new FileNode("Header.tsx", false)
      )
    ),
    new FileNode("package.json", false)
  )
);

// Parcourir l'arborescence des fichiers
for (const node of fileSystem) {
  console.log(node.name);
}

// Afficher la structure du système de fichiers
printFileSystem(fileSystem.root);

// Rechercher un fichier spécifique
const file = fileSystem.findFile("Header.tsx");
if (file) {
  console.log(`Found file: ${file.name}`);
} else {
  console.log("File not found");
}

export type {};
