
// Classe pour les noeuds de la liste chaînée
class Node {
    data: number;// Valeur du noeud
    next: Node | null;// Prochain noeud
    constructor(data: number) {
        this.data = data; // Initialiser la valeur du noeud
        this.next = null; // Initialiser le prochain noeud
    }
}

// Classe pour la liste chaînée
class LinkedList {
    head: Node | null; // Premier noeud
    constructor() {
        this.head = null; // Initialiser le premier noeud
    }

    append(data: number) {
        const newNode = new Node(data); // Créer un nouveau noeud
        if (!this.head) {
            this.head = newNode; // Si la liste est vide, le nouveau noeud est le premier
            return; 
        }
        let current = this.head; // Parcourir la liste
        while (current.next) {
            current = current.next; // Parcourir la liste
        }
        current.next = newNode;// Ajouter le nouveau noeud à la fin de la liste
    }
}

// Utilisation de la liste chaînée
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.append(4);
list.append(5);

console.log(JSON.stringify(list, null, 2));

export type { };

