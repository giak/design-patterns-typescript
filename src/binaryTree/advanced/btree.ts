/**
 * BTreeNode is a class that represents a node in a B-Tree.
 * @template K - The type of the keys in the node.
 * @template V - The type of the values in the node.
 */
class BTreeNode<K, V> {
    keys: K[];
    values: V[];
    children: BTreeNode<K, V>[];
    leaf: boolean;

    /**
     * Constructor for BTreeNode.
     * @param leaf - Whether the node is a leaf node.
     */
    constructor(leaf: boolean = true) {
        this.keys = [];
        this.values = [];
        this.children = [];
        this.leaf = leaf;
    }
}

/**
 * BTree is a class that represents a B-Tree.
 * @template K - The type of the keys in the tree.
 * @template V - The type of the values in the tree.
 */
class BTree<K, V> {
    private root: BTreeNode<K, V>;
    private t: number; // Degré minimum

    /**
     * Constructor for BTree.
     * @param t - The minimum degree of the B-Tree.
     */
    constructor(t: number) {
        this.root = new BTreeNode<K, V>();
        this.t = t;
    }

    /**
     * Inserts a key-value pair into the B-Tree.
     * @param key - The key to insert.
     * @param value - The value to insert.
     */
    insert(key: K, value: V): void {
        let r = this.root;
        if (r.keys.length === 2 * this.t - 1) {
            let s = new BTreeNode<K, V>(false);
            this.root = s;
            s.children.push(r);
            this.splitChild(s, 0);
            this.insertNonFull(s, key, value);
        } else {
            this.insertNonFull(r, key, value);
        }
    }

    /**
     * Inserts a key-value pair into the B-Tree when the root is not full.
     * @param x - The current node.
     * @param key - The key to insert.
     * @param value - The value to insert.
     */
    private insertNonFull(x: BTreeNode<K, V>, key: K, value: V): void {
        let i = x.keys.length - 1;

        if (x.leaf) {
            x.keys.push(key);
            x.values.push(value);
            while (i >= 0 && this.compare(key, x.keys[i]) < 0) {
                x.keys[i + 1] = x.keys[i];
                x.values[i + 1] = x.values[i];
                i--;
            }
            x.keys[i + 1] = key;
            x.values[i + 1] = value;
        } else {
            while (i >= 0 && this.compare(key, x.keys[i]) < 0) {
                i--;
            }
            i++;
            if (x.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(x, i);
                if (this.compare(key, x.keys[i]) > 0) {
                    i++;
                }
            }
            this.insertNonFull(x.children[i], key, value);
        }
    }

    /**
     * Splits a child node of the current node.
     * @param x - The current node.
     * @param i - The index of the child node to split.
     */
    private splitChild(x: BTreeNode<K, V>, i: number): void {
        let t = this.t;
        let y = x.children[i];
        let z = new BTreeNode<K, V>(y.leaf);

        x.children.splice(i + 1, 0, z);
        x.keys.splice(i, 0, y.keys[t - 1]);
        x.values.splice(i, 0, y.values[t - 1]);

        z.keys = y.keys.splice(t, t - 1);
        z.values = y.values.splice(t, t - 1);

        if (!y.leaf) {
            z.children = y.children.splice(t, t);
        }
    }

    /**
     * Searches for a value in the B-Tree.
     * @param key - The key to search for.
     * @returns The value associated with the key, or null if the key is not found.
     */
    search(key: K): V | null {
        return this.searchNode(this.root, key);
    }

    /**
     * Searches for a value in the B-Tree.
     * @param x - The current node.
     * @param key - The key to search for.
     * @returns The value associated with the key, or null if the key is not found.
     */
    private searchNode(x: BTreeNode<K, V>, key: K): V | null {
        let i = 0;
        while (i < x.keys.length && this.compare(key, x.keys[i]) > 0) {
            i++;
        }
        if (i < x.keys.length && this.compare(key, x.keys[i]) === 0) {
            return x.values[i];
        }
        if (x.leaf) {
            return null;
        }
        return this.searchNode(x.children[i], key);
    }

    /**
     * Compares two keys.
     * @param a - The first key.
     * @param b - The second key.
     * @returns -1 if a < b, 1 if a > b, 0 if a === b.
     */
    private compare(a: K, b: K): number {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
}

// Example usage
const index = new BTree<number, string>(3);
index.insert(10, 'Données pour 10');
index.insert(20, 'Données pour 20');
index.insert(5, 'Données pour 5');
index.insert(15, 'Données pour 15');
index.insert(12, 'Données pour 12');
index.insert(13, 'Données pour 13');
index.insert(14, 'Données pour 14');
index.insert(16, 'Données pour 16');
index.insert(17, 'Données pour 17');
index.insert(18, 'Données pour 18');
index.insert(19, 'Données pour 19');
index.insert(21, 'Données pour 21');
index.insert(22, 'Données pour 22');

console.log(index.search(15)); // Output: "Données pour 15"
console.log(index.search(7)); // Output: null
console.log(index.search(22));
