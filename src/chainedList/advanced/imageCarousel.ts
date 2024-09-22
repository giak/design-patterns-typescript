// Définition des types et interfaces
interface ImageInterface {
    readonly id: number; // Identifiant de l'image  
    readonly url: string; // URL de l'image
    readonly description: string; // Description de l'image
}

// Type pour les noeuds de l'image
type ImageNodeType = {
    image: ImageInterface; // Image du noeud
    next: ImageNodeType | null; // Prochain noeud
    prev: ImageNodeType | null; // Noeud précédent
};

// Interface pour le carrousel d'images
interface CarouselInterface {
    addImage(image: ImageInterface): void; // Ajouter une image
    displayCurrentImage(): void; // Afficher l'image courante
    nextImage(): void; // Passer à l'image suivante
    previousImage(): void; // Passer à l'image précédente
    removeCurrentImage(): void;
    getSize(): number;
}

// Classe pour gérer le carrousel d'images
class ImageCarousel implements CarouselInterface {
    private currentImage: ImageNodeType | null = null; // Image courante
    private size: number = 0; // Taille du carrousel

    constructor(private readonly logger: LoggerInterface) {}

    // Ajouter une image
    public addImage(image: ImageInterface): void {
        const newNode: ImageNodeType = {
            image, // Image du noeud
            next: null, // Prochain noeud
            prev: null, // Noeud précédent
        };

        if (!this.currentImage) {
            newNode.next = newNode; // Définir le prochain noeud
            newNode.prev = newNode; // Définir le noeud précédent
            this.currentImage = newNode; // Définir l'image courante
        } else {
            this.insertNodeAfterCurrent(newNode); // Insérer le noeud après l'image courante
        }

        this.size++;
        this.logger.log(`Added image: ${image.description}`); // Log l'ajout de l'image
    }

    // Afficher l'image courante
    public displayCurrentImage(): void {
        if (!this.currentImage) {
            this.logger.log('Carousel is empty'); // Log si le carrousel est vide
            return;
        }

        const { id, url, description } = this.currentImage.image; // Récupérer les informations de l'image
        this.logger.log(`Current image: [ID: ${id}] ${description} (${url})`);
    }

    // Passer à l'image suivante
    public nextImage(): void {
        this.moveToImage('next'); // Passer à l'image suivante
    }

    // Passer à l'image précédente
    public previousImage(): void {
        this.moveToImage('prev');
    }

    // Supprimer l'image courante
    public removeCurrentImage(): void {
        if (!this.currentImage) {
            this.logger.log('Carousel is empty');
            return;
        }

        if (this.size === 1) {
            this.currentImage = null; // Définir l'image courante à null
        } else {
            const nextImage = this.currentImage.next!; // Récupérer le prochain noeud
            const prevImage = this.currentImage.prev!; // Récupérer le noeud précédent

            prevImage.next = nextImage; // Définir le prochain noeud du noeud précédent
            nextImage.prev = prevImage; // Définir le noeud précédent du prochain noeud
            this.currentImage = nextImage; // Définir le prochain noeud comme image courante
        }

        this.size--;
        this.logger.log('Current image removed'); // Log la suppression de l'image
        this.displayCurrentImage(); // Afficher l'image courante
    }

    public getSize(): number {
        return this.size; // Retourner la taille du carrousel
    }

    private insertNodeAfterCurrent(newNode: ImageNodeType): void {
        if (!this.currentImage) return; // Si le carrousel est vide, retourner

        newNode.next = this.currentImage.next; // Définir le prochain noeud du nouveau noeud
        newNode.prev = this.currentImage; // Définir le noeud précédent du nouveau noeud
        this.currentImage.next!.prev = newNode; // Définir le noeud précédent du prochain noeud
        this.currentImage.next = newNode; // Définir le prochain noeud du noeud précédent
    }

    private moveToImage(direction: 'next' | 'prev'): void {
        if (this.currentImage) {
            this.currentImage = this.currentImage[direction]; // Définir le noeud suivant ou précédent comme image courante
            this.displayCurrentImage(); // Afficher l'image courante
        }
    }
}

// Interface pour le logger
interface LoggerInterface {
    log(message: string): void;
}

// Implémentation simple du logger
class ConsoleLogger implements LoggerInterface {
    public log(message: string): void {
        console.log(message);
    }
}

// Factory pour créer un carrousel d'images
class ImageCarouselFactory {
    public static create(logger: LoggerInterface = new ConsoleLogger()): CarouselInterface {
        return new ImageCarousel(logger); // Créer un carrousel d'images avec le logger
    }
}

// Exemple d'utilisation
const carousel = ImageCarouselFactory.create();

// Ajouter des images
carousel.addImage({ id: 1, url: 'https://example.com/image1.jpg', description: 'Mountain landscape' });
carousel.addImage({ id: 2, url: 'https://example.com/image2.jpg', description: 'Beach sunset' });
carousel.addImage({ id: 3, url: 'https://example.com/image3.jpg', description: 'City skyline' });

// Afficher l'image courante
carousel.displayCurrentImage();

// Naviguer dans le carrousel
carousel.nextImage();
carousel.nextImage();
carousel.previousImage();

// Supprimer l'image courante
carousel.removeCurrentImage();

// Afficher la taille du carrousel
console.log(`Carousel size: ${carousel.getSize()}`);

// Parcourir toutes les images restantes
for (let i = 0; i < carousel.getSize(); i++) {
    carousel.displayCurrentImage();
    carousel.nextImage();
}

export type { };

