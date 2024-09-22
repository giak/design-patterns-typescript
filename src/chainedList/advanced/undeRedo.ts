// Type pour les fonctions d'action
type ActionFunctionType<T = void> = () => T;

// Interface pour les actions
interface ActionInterface<T = void> {
    do: ActionFunctionType<T>; // Fonction pour exécuter l'action
    undo: ActionFunctionType; // Fonction pour annuler l'action
    description: string; // Description de l'action
}

// Classe pour les noeuds d'action
class ActionNode<T = void> {
    constructor(
        public readonly action: ActionInterface<T>, // Action à exécuter
        public next: ActionNode<T> | null = null, // Prochain noeud
        public prev: ActionNode<T> | null = null // Noeud précédent
    ) {}
}

// Classe pour le système undo/redo
class UndoRedoSystem<T = void> {
    private current: ActionNode<T> | null = null; // Noeud actuel
    private head: ActionNode<T> | null = null; // Premier noeud

    // Méthode pour exécuter une action
    public execute(action: ActionInterface<T>): T {
        const newNode = new ActionNode(action); // Créer un nouveau noeud d'action
        
        if (this.current) {
            this.current.next = newNode; // Définir le prochain noeud
            newNode.prev = this.current; // Définir le noeud précédent
        } else {
            this.head = newNode; // Définir le premier noeud
        }
        
        this.current = newNode;
        const result = action.do(); // Exécuter l'action
        console.log(`Executed: ${action.description}`); // Afficher la description de l'action
        return result; // Retourner le résultat
    }

    // Méthode pour annuler la dernière action
    public undo(): void {
        if (!this.current) {
            console.log("Nothing to undo"); // Afficher un message si rien à annuler
            return;
        }

        this.current.action.undo(); // Annuler l'action
        console.log(`Undone: ${this.current.action.description}`); // Afficher la description de l'action annulée
        this.current = this.current.prev; // Définir le noeud précédent
    }

    // Méthode pour réexécuter la dernière action annulée
    public redo(): void {
        if (!this.current?.next) {
            console.log("Nothing to redo"); // Afficher un message si rien à réexécuter
            return;
        }

        this.current = this.current.next; // Définir le prochain noeud
        this.current.action.do(); // Exécuter l'action
        console.log(`Redone: ${this.current.action.description}`); // Afficher la description de l'action réexécutée
    }

    // Méthode pour afficher l'historique des actions
    public printHistory(): void {
        let node = this.head; // Définir le premier noeud
        console.log("Action History:");
        while (node) {
            console.log(`- ${node.action.description}${node === this.current ? " (current)" : ""}`); // Afficher la description de l'action et indiquer si elle est en cours
            node = node.next; // Passer au prochain noeud
        }
    }

    // Méthode pour effacer l'historique des actions
    public clearHistory(): void {
        this.head = null; // Effacer le premier noeud
        this.current = null; // Effacer le noeud actuel
        console.log("History cleared"); // Afficher un message de confirmation
    }

    // Méthode pour obtenir l'action en cours
    public getCurrentAction(): ActionInterface<T> | null {
        return this.current?.action ?? null; // Retourner l'action en cours ou null si aucune action
    }
}

// Exemple d'utilisation avec un type générique
const undoRedoSystem = new UndoRedoSystem<void>();

// Définition d'actions typées
const addShape: ActionInterface = {
    do: () => console.log("Adding a shape"),
    undo: () => console.log("Removing the added shape"),
    description: "Add shape"
};

const changeColor: ActionInterface = {
    do: () => console.log("Changing color to red"),
    undo: () => console.log("Reverting color change"),
    description: "Change color"
};

const resizeShape: ActionInterface = {
    do: () => console.log("Resizing to 200x200"),
    undo: () => console.log("Reverting size change"),
    description: "Resize shape"
};

// Exécution des actions
undoRedoSystem.execute(addShape);
undoRedoSystem.execute(changeColor);
undoRedoSystem.execute(resizeShape);

undoRedoSystem.printHistory();

// Test des fonctionnalités undo/redo
undoRedoSystem.undo();
undoRedoSystem.undo();
undoRedoSystem.redo();
undoRedoSystem.execute(resizeShape);

undoRedoSystem.printHistory();