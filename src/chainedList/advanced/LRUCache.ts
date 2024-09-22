// Interface pour la cache LRU
export interface LRUCacheInterface<K, V> {
    get(key: K): V | undefined; // Méthode pour obtenir une valeur de la cache
    put(key: K, value: V): void; // Méthode pour ajouter une valeur à la cache
    printCache(): void; // Méthode pour afficher l'état de la cache
}

// Interface pour les noeuds de la cache LRU
export interface LRUCacheNodeInterface<K, V> {
    key: K; // Clé du noeud
    value: V; // Valeur du noeud
    prev: LRUCacheNodeInterface<K, V> | null; // Lien précédent
    next: LRUCacheNodeInterface<K, V> | null; // Lien suivant
}

// Type pour les noeuds de la cache LRU
export type LRUCacheNodeType<K, V> = {
    key: K; // Clé du noeud
    value: V; // Valeur du noeud
    prev: LRUCacheNodeType<K, V> | null; // Lien précédent
    next: LRUCacheNodeType<K, V> | null; // Lien suivant
};

// Classe pour les noeuds de la cache LRU
export class LRUCacheNode<K, V> implements LRUCacheNodeInterface<K, V> {
    public prev: LRUCacheNode<K, V> | null = null; // Lien précédent
    public next: LRUCacheNode<K, V> | null = null; // Lien suivant

    // Constructeur de la classe
    constructor(public key: K, public value: V) {}
}

// Interface pour la configuration de la cache LRU
export interface LRUCacheConfigInterface {
    capacity: number;
}

// Classe pour la cache LRU
export class LRUCache<K, V> implements LRUCacheInterface<K, V> {
    private cache: Map<K, LRUCacheNode<K, V>>; // Map pour stocker les noeuds de la cache
    private head: LRUCacheNode<K, V> | null = null; // Premier noeud de la liste
    private tail: LRUCacheNode<K, V> | null = null; // Dernier noeud de la liste

    constructor(private config: LRUCacheConfigInterface) {
        this.cache = new Map<K, LRUCacheNode<K, V>>(); // Initialisation de la map
    }

    // Méthode pour obtenir une valeur de la cache
    public get(key: K): V | undefined {
        const node = this.cache.get(key); // On récupère le noeud
        if (node) {
            this.moveToTail(node); // On déplace le noeud à la fin de la liste
            return node.value; // On retourne la valeur
        }
        return undefined; // On retourne undefined si la clé n'existe pas
    }

    // Méthode pour ajouter une valeur à la cache
    public put(key: K, value: V): void {
        if (this.cache.has(key)) {
            // Si la clé existe déjà
            const existingNode = this.cache.get(key)!; // On récupère le noeud
            existingNode.value = value; // On met à jour la valeur
            this.moveToTail(existingNode);
        } else {
            const newNode = new LRUCacheNode(key, value);
            if (this.cache.size >= this.config.capacity) {
                // Si la taille de la cache est supérieure à la capacité
                this.removeLeastUsed(); // On supprime le noeud le moins utilisé
            }
            this.addToTail(newNode); // On ajoute le nouveau noeud à la fin de la liste
            this.cache.set(key, newNode); // On ajoute le nouveau noeud à la map
        }
    }

    // Méthode pour afficher l'état de la cache
    public printCache(): void {
        const elements: string[] = []; // Tableau pour stocker les éléments de la cache
        let current = this.head; // Premier noeud de la liste
        while (current) {
            elements.push(`${String(current.key)}:${String(current.value)}`); // On ajoute l'élément à la liste
            current = current.next; // On déplace le noeud
        }
        console.log(`Cache (least -> most used): ${elements.join(' -> ')}`);
    }

    // Méthode pour déplacer un noeud à la fin de la liste
    private moveToTail(node: LRUCacheNode<K, V>): void {
        if (node === this.tail) return; // Si le noeud est déjà à la fin, on ne fait rien

        if (node === this.head) {
            // Si le noeud est le premier de la liste
            this.head = node.next; // On déplace le premier noeud
            this.head!.prev = null; // On met à jour le lien précédent
        } else {
            node.prev!.next = node.next; // On déplace le noeud dans la liste
            if (node.next) node.next.prev = node.prev; // On met à jour le lien précédent
        }

        this.tail!.next = node; // On déplace le noeud à la fin de la liste
        node.prev = this.tail; // On met en place le lien précédent
        node.next = null; // On met en place le lien suivant
        this.tail = node; // On met à jour le dernier noeud
    }

    // Méthode pour ajouter un noeud à la fin de la liste
    private addToTail(node: LRUCacheNode<K, V>): void {
        if (!this.head) {
            // Si la liste est vide
            this.head = node; // On met en place le premier noeud
            this.tail = node; // On met en place le dernier noeud
        } else {
            this.tail!.next = node;
            node.prev = this.tail; // On met en place le lien précédent
            this.tail = node; // On met à jour le dernier noeud
        }
    }

    // Méthode pour supprimer le noeud le moins utilisé
    private removeLeastUsed(): void {
        if (!this.head) return; // Si la liste est vide, on ne fait rien

        const leastUsed = this.head; // On récupère le premier noeud
        this.head = this.head.next; // On déplace le premier noeud
        if (this.head) {
            this.head.prev = null; // On met à jour le lien précédent
        } else {
            this.tail = null; // On met à jour le dernier noeud
        }

        this.cache.delete(leastUsed.key); // On supprime le noeud de la map
    }
}

// Exemple d'utilisation
const cache = new LRUCache<string, number>({ capacity: 3 });

console.log('Adding initial values to the cache:');
cache.put('A', 1);
cache.put('B', 2);
cache.put('C', 3);
cache.printCache(); // Expected: Cache (least -> most used): A:1 -> B:2 -> C:3

console.log('\nAccessing existing value:');
console.log("Value of 'B':", cache.get('B')); // Expected: 2
cache.printCache(); // Expected: Cache (least -> most used): A:1 -> C:3 -> B:2

console.log('\nAdding a new value when cache is full:');
cache.put('D', 4);
cache.printCache(); // Expected: Cache (least -> most used): C:3 -> B:2 -> D:4

console.log('\nTrying to access an evicted value:');
console.log("Value of 'A':", cache.get('A')); // Expected: undefined

console.log('\nUpdating an existing value:');
cache.put('C', 30);
cache.printCache(); // Expected: Cache (least -> most used): B:2 -> D:4 -> C:30

console.log('\nAdding a value that already exists:');
cache.put('D', 40);
cache.printCache(); // Expected: Cache (least -> most used): B:2 -> C:30 -> D:40

console.log('\nAdding a new value, causing eviction:');
cache.put('E', 5);
cache.printCache(); // Expected: Cache (least -> most used): C:30 -> D:40 -> E:5

console.log('\nFinal cache state:');
cache.printCache(); // Expected: Cache (least -> most used): C:30 -> D:40 -> E:5

export type {};
