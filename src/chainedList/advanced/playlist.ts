// Type pour la durée des chansons
type DurationType = number;

// Interface pour les chansons
interface SongInterface {
    readonly title: string; // Titre de la chanson
    readonly artist: string; // Artiste de la chanson
    readonly duration: DurationType; // Durée de la chanson
}

// Classe pour les noeuds de la playlist
class SongNode {
    next: SongNode | null = null; // Prochain noeud
    prev: SongNode | null = null; // Noeud précédent

    // Constructeur de la classe
    constructor(public readonly song: SongInterface) {}
}

// Interface pour les opérations de la playlist
interface PlaylistOperationsInterface {
    addSong(song: SongInterface): void; // Ajouter une chanson à la playlist
    removeSong(title: string): boolean; // Supprimer une chanson de la playlist
    playNext(): void; // Passer à la chanson suivante
    playPrevious(): void; // Passer à la chanson précédente
    displayPlaylist(): void;
    getSize(): number;
}

// Interface pour l'état de la playlist
interface PlaylistStateInterface {
    readonly head: SongNode | null; // Premier noeud de la playlist
    readonly tail: SongNode | null; // Dernier noeud de la playlist
    readonly currentlyPlaying: SongNode | null; // Noeud actuellement en cours de lecture
    readonly size: number; // Taille de la playlist
}

// Interface pour les observateurs de la playlist
interface PlaylistObserverInterface {
    update(event: string, data?: any): void; // Méthode pour mettre à jour l'observateur
}

// Classe implémentant les opérations et l'état de la playlist
class MusicPlaylist implements PlaylistOperationsInterface, PlaylistStateInterface {
    private _head: SongNode | null = null; // Premier noeud de la playlist
    private _tail: SongNode | null = null; // Dernier noeud de la playlist
    private _currentlyPlaying: SongNode | null = null; // Noeud actuellement en cours de lecture
    private _size: number = 0; // Taille de la playlist
    private observers: Set<PlaylistObserverInterface> = new Set(); // Ensemble des observateurs de la playlist

    // Getters pour les propriétés de la playlist
    get head(): SongNode | null {
        return this._head;
    } // Premier noeud de la playlist
    get tail(): SongNode | null {
        return this._tail;
    } // Dernier noeud de la playlist
    get currentlyPlaying(): SongNode | null {
        return this._currentlyPlaying;
    }
    get size(): number {
        return this._size;
    }

    // Méthode pour ajouter un observateur à la playlist
    addObserver(observer: PlaylistObserverInterface): void {
        this.observers.add(observer); // Ajouter l'observateur à la playlist
    }

    // Méthode pour supprimer un observateur de la playlist
    removeObserver(observer: PlaylistObserverInterface): void {
        this.observers.delete(observer); // Supprimer l'observateur de la playlist
    }

    // Méthode pour notifier les observateurs d'un événement
    private notifyObservers(event: string, data?: any): void {
        this.observers.forEach((observer) => observer.update(event, data));
    }

    // Méthode pour ajouter une chanson à la playlist
    addSong(song: SongInterface): void {
        const newNode = new SongNode(song); // Créer un nouveau noeud pour la chanson
        if (!this._head) {
            this._head = this._tail = newNode;
        } else {
            newNode.prev = this._tail; // Définir le noeud précédent
            this._tail!.next = newNode; // Définir le noeud suivant
            this._tail = newNode; // Définir le dernier noeud
        }
        this._size++;
        this.notifyObservers('songAdded', song);
    }

    // Méthode pour supprimer une chanson de la playlist
    removeSong(title: string): boolean {
        if (!title || typeof title !== 'string') {
            throw new Error('Invalid title: must be a non-empty string');
        }

        const nodeToRemove = this.findSongByTitle(title); // Trouver le noeud à supprimer
        if (nodeToRemove) {
            this.unlinkNode(nodeToRemove); // Délier le noeud
            this._size--;
            this.notifyObservers('songRemoved', title); // Notifier les observateurs de la suppression de la chanson
            return true; // Retourner true si la chanson a été supprimée
        }

        return false; // Retourner false si la chanson n'existe pas
    }

    // Méthode pour trouver une chanson par son titre
    private findSongByTitle(title: string): SongNode | null {
        let current = this._head; // Parcourir la playlist
        while (current) {
            if (current.song.title === title) {
                return current; // Retourner le noeud si le titre est trouvé
            }
            current = current.next; // Parcourir la playlist
        }
        return null; // Retourner null si le titre n'est pas trouvé
    }

    // Méthode pour délier un noeud de la playlist
    private unlinkNode(node: SongNode): void {
        if (node.prev) node.prev.next = node.next; // Délier le noeud précédent
        if (node.next) node.next.prev = node.prev; // Délier le noeud suivant
        if (node === this._head) this._head = node.next; // Définir le nouveau premier noeud
        if (node === this._tail) this._tail = node.prev; // Définir le nouveau dernier noeud
        if (node === this._currentlyPlaying) this._currentlyPlaying = node.next || this._head; // Définir le nouveau noeud en cours de lecture
    }

    // Méthode pour passer à la chanson suivante
    playNext(): void {
        this._currentlyPlaying = this._currentlyPlaying?.next ?? this._head; // Passer à la chanson suivante
        this.notifyObservers('playNext', this._currentlyPlaying?.song); // Notifier les observateurs de la lecture de la chanson
    }

    // Méthode pour passer à la chanson précédente
    playPrevious(): void {
        this._currentlyPlaying = this._currentlyPlaying?.prev ?? this._tail; // Passer à la chanson précédente
        this.notifyObservers('playPrevious', this._currentlyPlaying?.song); // Notifier les observateurs de la lecture de la chanson
    }

    // Méthode pour afficher la playlist
    displayPlaylist(): void {
        let current = this._head; // Parcourir la playlist
        const playlistContent: string[] = []; // Tableau pour stocker le contenu de la playlist
        while (current) {
            const { title, artist, duration } = current.song; // Récupérer les informations de la chanson
            playlistContent.push(`- "${title}" by ${artist} (${duration}s)`);
            current = current.next;
        }
        this.notifyObservers('displayPlaylist', playlistContent.join('\n')); // Notifier les observateurs de l'affichage de la playlist
    }

    // Méthode pour obtenir la taille de la playlist
    getSize(): number {
        return this._size; // Retourner la taille de la playlist
    }
}

// Exemple d'utilisation avec async/await
async function runPlaylistExample() {
    const playlist = new MusicPlaylist(); // Créer une nouvelle playlist

    // Ajout d'un observateur pour la journalisation
    const playlistLogger: PlaylistObserverInterface = {
        update(event: string, data?: any) {
            console.log(`Event: ${event}`, data); // Afficher l'événement et les données
        },
    };
    playlist.addObserver(playlistLogger); // Ajouter l'observateur à la playlist

    // Simulation d'ajout de chansons de manière asynchrone
    await Promise.all([
        playlist.addSong({ title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354 }),
        playlist.addSong({ title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482 }),
        playlist.addSong({ title: 'Imagine', artist: 'John Lennon', duration: 183 }),
    ]);

    console.log('Taille de la playlist:', playlist.getSize());

    playlist.displayPlaylist();
    playlist.playNext();
    playlist.playNext();

    await playlist.removeSong('Stairway to Heaven');
    console.log('Taille de la playlist:', playlist.getSize());

    playlist.displayPlaylist();
    playlist.playPrevious();
}

runPlaylistExample().catch(console.error);
