// Classe pour les noeuds de la liste chaînée
class Node<T> {
    value: T; // Valeur du noeud
    next: Node<T> | null = null; // Prochain noeud

    constructor(value: T) {
        this.value = value; // Initialiser la valeur du noeud
    }
}

// Classe pour la liste chaînée
class LinkedList<T> {
    head: Node<T> | null = null; // Premier noeud

    add(value: T): void {
        const newNode = new Node(value); // Créer un nouveau noeud
        if (!this.head) {
            this.head = newNode; // Si la liste est vide, le nouveau noeud est le premier
        } else {
            let current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = newNode; // Ajouter le nouveau noeud à la fin de la liste
        }
    }
}

// Utilisation de la liste chaînée
const list = new LinkedList<number>();
list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.add(5);

console.log(JSON.stringify(list, null, 2));

export type { };

