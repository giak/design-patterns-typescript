// Classe pour les noeuds de l'arbre binaire
class TreeNode<T> {
    value: T; // Valeur du noeud
    left: TreeNode<T> | null; // Lien gauche
    right: TreeNode<T> | null;

    constructor(value: T) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Classe pour l'arbre binaire
class BinaryTree<T> {
    root: TreeNode<T> | null; // Racine de l'arbre

    constructor() {
        this.root = null; // Initialiser la racine
    }

    insert(value: T): void {
        this.root = this.insertNode(this.root, value);
    }

    // Méthode pour insérer un noeud dans l'arbre
    private insertNode(node: TreeNode<T> | null, value: T): TreeNode<T> {
        if (node === null) {
            return new TreeNode(value); // Si le noeud est vide, créer un nouveau noeud
        }

        if (value < node.value) {
            node.left = this.insertNode(node.left, value); // Si la valeur est inférieure à la valeur du noeud, insérer à gauche
        } else {
            node.right = this.insertNode(node.right, value); // Si la valeur est supérieure à la valeur du noeud, insérer à droite
        }

        return node;
    }
}

// Utilisation de l'arbre binaire
const binaryTree = new BinaryTree<number>();
binaryTree.insert(5);
binaryTree.insert(3);
binaryTree.insert(7);

console.log(binaryTree);

export type {};
