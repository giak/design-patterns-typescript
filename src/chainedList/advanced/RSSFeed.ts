// Interface pour les éléments du flux RSS
interface RSSItemInterface {
    title: string; // Titre de l'article
    description: string; // Description de l'article
    pubDate: Date; // Date de publication de l'article
    link: string; // URL de l'article
}

// Interface pour le flux RSS
interface RSSFeedInterface {
    addItem(item: RSSItemInterface): void; // Ajouter un élément au flux RSS
    getItems(): RSSItemInterface[]; // Obtenir tous les éléments du flux RSS
    updateItem(title: string, newDescription: string): void; // Mettre à jour un élément du flux RSS
    removeItem(title: string): void; // Supprimer un élément du flux RSS
}

// Type pour les éléments du flux RSS
type RSSItemNodeType = RSSItemInterface & { next: RSSItemNodeType | null }; // Type pour les noeuds d'éléments de flux RSS

// Fonction pour créer un noeud d'élément de flux RSS
const createRSSItemNode = (item: RSSItemInterface): RSSItemNodeType => ({
    ...item, // Copier les propriétés de l'élément
    next: null, // Initialiser le prochain noeud à null
});

// Classe pour représenter un élément de flux RSS
class RSSItem implements RSSItemInterface {
    constructor(
        public readonly title: string, // Titre de l'article
        public description: string, // Description de l'article
        public readonly pubDate: Date, // Date de publication de l'article
        public readonly link: string, // URL de l'article
    ) {}
}

// Classe pour représenter le flux RSS
class RSSFeed implements RSSFeedInterface {
    private head: RSSItemNodeType | null = null; // Premier noeud du flux RSS

    public addItem(item: RSSItemInterface): void {
        const newNode = createRSSItemNode(item); // Créer un nouveau noeud pour l'élément
        if (!this.head) {
            this.head = newNode; // Si le flux RSS est vide, définir le nouveau noeud comme premier
            return;
        }
        let current = this.head; // Parcourir la liste chaînée pour trouver le dernier noeud
        while (current.next) {
            current = current.next; // Parcourir la liste chaînée pour trouver le dernier noeud
        }
        current.next = newNode; // Ajouter le nouveau noeud à la fin de la liste
    }

    public getItems(): RSSItemInterface[] {
        const items: RSSItemInterface[] = [];
        let current = this.head; // Parcourir la liste chaînée pour obtenir tous les éléments
        while (current) {
            items.push(current); // Ajouter l'élément actuel à la liste des éléments
            current = current.next; // Parcourir la liste chaînée pour obtenir tous les éléments
        }
        return items;
    }

    public updateItem(title: string, newDescription: string): void {
        const item = this.findItem(title);
        if (item) {
            item.description = newDescription; // Mettre à jour la description de l'élément
        }
    }

    public removeItem(title: string): void {
        if (!this.head) return; // Si le flux RSS est vide, retourner

        if (this.head.title === title) {
            this.head = this.head.next; // Si le premier élément est celui à supprimer, définir le second élément comme premier
            return;
        }

        let current = this.head; // Parcourir la liste chaînée pour trouver l'élément à supprimer
        while (current.next) {
            if (current.next.title === title) {
                current.next = current.next.next; // Supprimer l'élément de la liste
                return;
            }
            current = current.next; // Parcourir la liste chaînée pour trouver l'élément à supprimer
        }
    }

    private findItem(title: string): RSSItemNodeType | null {
        let current = this.head; // Parcourir la liste chaînée pour trouver l'élément
        while (current) {
            if (current.title === title) {
                return current; // Retourner l'élément trouvé
            }
            current = current.next; // Parcourir la liste chaînée pour trouver l'élément    
        }
        return null;
    }
}

// Fonction pour créer un flux RSS
const createRSSFeed = (): RSSFeedInterface => new RSSFeed();

// Exemple d'utilisation
const rssFeed = createRSSFeed();

rssFeed.addItem(new RSSItem('Article 1', 'Description 1', new Date(), 'http://example.com/1'));
rssFeed.addItem(new RSSItem('Article 2', 'Description 2', new Date(), 'http://example.com/2'));
rssFeed.addItem(new RSSItem('Article 3', 'Description 3', new Date(), 'http://example.com/3'));

console.log(rssFeed.getItems());

rssFeed.updateItem('Article 2', "Nouvelle description pour l'article 2");
rssFeed.removeItem('Article 1');

console.log(rssFeed.getItems());

export type { };

