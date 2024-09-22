// Interface pour les commentaires
interface CommentInterface {
    id: number; // Identifiant du commentaire
    content: string; // Contenu du commentaire
    replies: CommentInterface | null; // Réponses au commentaire
    next: CommentInterface | null; // Commentaire suivant
}

// Interface pour le fil de commentaires
interface CommentThreadInterface {
    addComment(id: number, content: string, parentId?: number): void; // Ajouter un commentaire
    displayComments(): void; // Afficher les commentaires
}

// Type pour les identifiants des commentaires
type CommentIdType = number;
// Type pour le contenu des commentaires
type CommentContentType = string;

// Fonctions utilitaires
const createComment = (id: CommentIdType, content: CommentContentType): CommentInterface => ({
    id, // Identifiant du commentaire
    content, // Contenu du commentaire
    replies: null, // Réponses au commentaire
    next: null, // Commentaire suivant
});

// Fonction pour trouver le dernier commentaire
const findLastComment = (comment: CommentInterface): CommentInterface => {
    let current = comment;
    while (current.next) {
        current = current.next; // Parcourir la liste chaînée pour trouver le dernier commentaire
    }
    return current; // Retourner le dernier commentaire
};

// Classe pour représenter le fil de commentaires
class CommentThread implements CommentThreadInterface {
    private head: CommentInterface | null = null; // Premier commentaire

    // Ajouter un commentaire
    addComment(id: CommentIdType, content: CommentContentType, parentId?: CommentIdType): void {
        const newComment = createComment(id, content); // Créer un nouveau commentaire

        if (!this.head) {
            this.head = newComment; // Si le fil de commentaires est vide, définir le nouveau commentaire comme premier
            return;
        }

        if (!parentId) {
            findLastComment(this.head).next = newComment; // Si le commentaire n'a pas de parent, ajouter le nouveau commentaire à la fin du fil
        } else {
            const parentComment = this.findComment(parentId); // Trouver le commentaire parent
            if (parentComment) {
                // Si le commentaire parent existe
                if (!parentComment.replies) {
                    parentComment.replies = newComment; // Si le commentaire parent n'a pas de réponses, définir le nouveau commentaire comme réponse
                } else {
                    findLastComment(parentComment.replies).next = newComment; // Si le commentaire parent a des réponses, ajouter le nouveau commentaire à la fin des réponses
                }
            }
        }
    }

    // Rechercher un commentaire par identifiant
    private findComment(id: CommentIdType): CommentInterface | null {
        const search = (comment: CommentInterface | null): CommentInterface | null => {
            if (!comment) return null; // Si le commentaire est null, retourner null
            if (comment.id === id) return comment; // Si l'identifiant du commentaire est égal à l'identifiant recherché, retourner le commentaire

            return search(comment.replies) || search(comment.next); // Rechercher le commentaire dans les réponses ou dans le fil suivant
        };

        return search(this.head); // Retourner le commentaire trouvé
    }

    // Afficher les commentaires
    displayComments(): void {
        const display = (comment: CommentInterface | null, depth: number = 0): void => {
            if (!comment) return; // Si le commentaire est null, retourner

            console.log(`${'  '.repeat(depth)}${comment.id}: ${comment.content}`); // Afficher le commentaire
            display(comment.replies, depth + 1); // Afficher les réponses
            display(comment.next, depth); // Afficher le fil suivant
        };

        display(this.head); // Afficher les commentaires
    }
}

// Exemple d'utilisation
const thread = new CommentThread();

thread.addComment(1, 'Premier commentaire');
thread.addComment(2, 'Deuxième commentaire');
thread.addComment(3, 'Réponse au premier commentaire', 1);
thread.addComment(4, 'Réponse à la réponse', 3);
thread.addComment(5, 'Troisième commentaire');
thread.addComment(6, 'Autre réponse au premier', 1);

thread.displayComments();

export type { };

