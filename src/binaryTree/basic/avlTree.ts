import AVLTree from "avl";

// Création d'un arbre AVL
const avlTree = new AVLTree();

// Insertion de valeurs
avlTree.load([3, 2, -10, 20], ["C", "B", "A", "D"], true);
console.log(avlTree.keys()); // [-10, 2, 3, 20]
console.log(avlTree.values()); // ['A', 'B', 'C', 'D']

// Vérification de l'équilibre
console.log(avlTree.isBalanced()); // true

// Recherche
console.log(avlTree.find(2)); // TreeNode { key: 7, ... }
console.log(avlTree.find(10)); // null

// Suppression
avlTree.remove(3);
console.log(avlTree.keys()); // [-10, 2, 3, 20]
console.log(avlTree.values()); // ['A', 'B', 'C', 'D']
