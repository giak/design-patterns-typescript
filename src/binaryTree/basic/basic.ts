class TreeNode<T> {
  constructor(
    public value: T,
    public left: TreeNode<T> | null = null,
    public right: TreeNode<T> | null = null
  ) {}
}

class BinaryTree<T> implements Iterable<T> {
  constructor(public readonly root: TreeNode<T> | null) {}

  *[Symbol.iterator](): Iterator<T> {
    function* inOrderTraversal(node: TreeNode<T> | null): Generator<T> {
      if (node) {
        if (node.left) yield* inOrderTraversal(node.left);
        yield node.value;
        if (node.right) yield* inOrderTraversal(node.right);
      }
    }

    yield* inOrderTraversal(this.root);
  }
}

function printIndentedTree<T>(node: TreeNode<T> | null, indent = ""): void {
  if (node === null) {
    console.log(`${indent}null`);
    return;
  }

  console.log(`${indent}${node.value}`);
  printIndentedTree(node.left, `${indent}  `);
  printIndentedTree(node.right, `${indent}  `);
}

// utilisation
// Création d'un arbre binaire
const tree = new BinaryTree<number>(
  new TreeNode(
    1,
    new TreeNode(2, new TreeNode(4), new TreeNode(5)),
    new TreeNode(3, null, new TreeNode(6))
  )
);

// Parcours de l'arbre avec l'itérateur
for (const value of tree) {
  console.log(value);
}

// Affichage de l'arbre avec indentation
printIndentedTree(tree.root);

export type {};
