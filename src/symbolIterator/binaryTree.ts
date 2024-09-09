class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class BinaryTree<T> implements Iterable<T> {
  root: TreeNode<T> | null = null;

  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    const queue: TreeNode<T>[] = [this.root];
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (!current.left) {
        current.left = newNode;
        return;
      }
      if (!current.right) {
        current.right = newNode;
        return;
      }
      queue.push(current.left, current.right);
    }
  }

  *inOrderTraversal(node: TreeNode<T> | null): Generator<T> {
    if (node) {
      yield* this.inOrderTraversal(node.left);
      yield node.value;
      yield* this.inOrderTraversal(node.right);
    }
  }

  [Symbol.iterator](): Iterator<T> {
    return this.inOrderTraversal(this.root);
  }
}

// Exemple d'utilisation
const tree = new BinaryTree<number>();
[5, 3, 7, 1, 4, 6, 8].forEach((value) => tree.insert(value));

console.log("Parcours en ordre de l'arbre binaire :");
for (const value of tree) {
  console.log(value);
}

export type {};
