// Exemple d'implémentation d'un arbre binaire de recherche
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  insert(value: T): void {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return;
    }
    this.insertNode(this.root, newNode);
  }

  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value: T): boolean {
    return this.searchNode(this.root, value);
  }

  private searchNode(node: TreeNode<T> | null, value: T): boolean {
    if (node === null) {
      return false;
    }
    if (value < node.value) {
      return this.searchNode(node.left, value);
    }
    if (value > node.value) {
      return this.searchNode(node.right, value);
    }
    return true;
  }

  inorderTraversal(): T[] {
    const result: T[] = [];
    this.inorderTraversalNode(this.root, result);
    return result;
  }

  private inorderTraversalNode(node: TreeNode<T> | null, result: T[]): void {
    if (node !== null) {
      this.inorderTraversalNode(node.left, result);
      result.push(node.value);
      this.inorderTraversalNode(node.right, result);
    }
  }

  // Autres méthodes comme delete, preorderTraversal, postorderTraversal, etc.
}

// Utilisation de l'arbre binaire de recherche
const bst = new BinarySearchTree();
bst.insert(5);
bst.insert(3);
bst.insert(7);
bst.insert(1);
bst.insert(9);

console.log(bst.search(7)); // true
console.log(bst.search(6)); // false
console.log(bst.inorderTraversal()); // [1, 3, 5, 7, 9]

export { BinarySearchTree };
