class BinaryTreeNode<T> {
    constructor(
        public value: T,
        public left: BinaryTreeNode<T> | null = null,
        public right: BinaryTreeNode<T> | null = null
    ) {}

    *[Symbol.iterator](): Iterator<T> {
        yield this.value;
        if (this.left) yield* this.left;
        if (this.right) yield* this.right;
    }
}

function printTree<T>(node: BinaryTreeNode<T> | null, prefix = '', isLeft = true): string {
    if (!node) return '';

    let result = prefix;
    result += isLeft ? '├── ' : '└── ';
    result += `${node.value}\n`;

    const newPrefix = prefix + (isLeft ? '│   ' : '    ');
    result += printTree(node.left, newPrefix, true);
    result += printTree(node.right, newPrefix, false);

    return result;
}

// Exemple d'utilisation
const tree = new BinaryTreeNode(1,
    new BinaryTreeNode(2,
        new BinaryTreeNode(4),
        new BinaryTreeNode(5)
    ),
    new BinaryTreeNode(3,
        new BinaryTreeNode(6),
        new BinaryTreeNode(7)
    )
);

console.log("Parcours de l'arbre :");
for (const value of tree) {
    console.log(value);
}

console.log("\nAffichage de l'arbre :");
console.log(printTree(tree));