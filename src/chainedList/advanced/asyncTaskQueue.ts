const crypto = require('crypto');

// Type pour les tâches asynchrones
type AsyncTaskType<T = void> = () => Promise<T>;
// Type pour les statuts des tâches
type TaskStatusType = 'pending' | 'running' | 'completed' | 'failed';

// Interface pour les tâches
interface TaskInterface<T> {
    id: string; // Identifiant de la tâche
    execute: AsyncTaskType<T>; // Fonction à exécuter
    status: TaskStatusType; // Statut de la tâche
    result?: T; // Résultat de la tâche
    error?: Error; // Erreur de la tâche
}

// Interface pour les files de tâches
interface TaskQueueInterface<T> {
    enqueue(task: AsyncTaskType<T>): void; // Méthode pour ajouter une tâche à la file
    dequeue(): TaskInterface<T> | undefined; // Méthode pour retirer une tâche de la file
    isEmpty(): boolean; // Méthode pour vérifier si la file est vide
    size(): number; // Méthode pour obtenir la taille de la file
}

// Classe pour les noeuds de la file
class TaskNode<T> {
    constructor(
        public task: TaskInterface<T>, // Tâche stockée dans le noeud
        public next: TaskNode<T> | null = null, // Prochain noeud
    ) {}
}

// Classe pour les files de tâches
class TaskQueue<T> implements TaskQueueInterface<T> {
    private head: TaskNode<T> | null = null;
    private tail: TaskNode<T> | null = null;
    private count = 0; // Nombre de tâches dans la file

    // Méthode pour ajouter une tâche à la file
    enqueue(task: AsyncTaskType<T>): void {
        const newTask: TaskInterface<T> = {
            id: crypto.randomUUID(), // Génération d'un identifiant unique pour la tâche
            execute: task, // Fonction à exécuter
            status: 'pending', // Statut initial de la tâche
        };
        const newNode = new TaskNode(newTask); // Création d'un nouveau noeud pour la tâche

        if (!this.head) {
            this.head = this.tail = newNode; // Si la file est vide, le nouveau noeud est à la fois le premier et le dernier
        } else {
            this.tail!.next = newNode; // Ajout du nouveau noeud à la fin de la file
            this.tail = newNode; // Mettre à jour le dernier noeud
        }
        this.count++; // Incrémenter le nombre de tâches dans la file
    }

    // Méthode pour retirer une tâche de la file
    dequeue(): TaskInterface<T> | undefined {
        if (!this.head) return undefined; // Si la file est vide, retourner undefined

        const task = this.head.task; // Récupérer la tâche du premier noeud
        this.head = this.head.next;
        if (!this.head) this.tail = null; // Si la file est vide, mettre à jour le dernier noeud
        this.count--; // Décrémenter le nombre de tâches dans la file

        return task; // Retourner la tâche retirée
    }

    // Méthode pour vérifier si la file est vide
    isEmpty(): boolean {
        return this.count === 0; // Retourner true si la file est vide, false sinon
    }

    // Méthode pour obtenir la taille de la file
    size(): number {
        return this.count; // Retourner le nombre de tâches dans la file
    }
}

// Classe pour les files de tâches asynchrones
class AsyncTaskQueue<T> {
    private queue: TaskQueueInterface<T>; // File de tâches
    private isProcessing = false; // Indicateur de traitement
    private concurrency: number; // Nombre de tâches en cours de traitement

    // Constructeur de la file de tâches asynchrones
    constructor(queueStrategy: TaskQueueInterface<T> = new TaskQueue<T>(), concurrency = 1) {
        this.queue = queueStrategy; // Initialisation de la file de tâches
        this.concurrency = concurrency; // Initialisation du nombre de tâches en cours de traitement
    }

    // Méthode pour ajouter une tâche à la file
    enqueue(task: AsyncTaskType<T>): void {
        this.queue.enqueue(task); // Ajouter la tâche à la file
        this.processQueue(); // Traiter la file
    }

    // Méthode pour traiter la file
    private async processQueue(): Promise<void> {
        if (this.isProcessing || this.queue.isEmpty()) return; // Si le traitement est en cours ou la file est vide, retourner

        this.isProcessing = true; // Démarrer le traitement

        try {
            const processingTasks: Promise<void>[] = []; // Tableau pour stocker les promesses de traitement

            while (!this.queue.isEmpty() && processingTasks.length < this.concurrency) {
                const task = this.queue.dequeue(); // Récupérer la tâche à traiter
                if (task) {
                    processingTasks.push(this.executeTask(task)); // Ajouter la tâche à la liste des tâches en cours de traitement
                }
            }

            await Promise.all(processingTasks);
        } finally {
            this.isProcessing = false; // Fin du traitement
            if (!this.queue.isEmpty()) {
                this.processQueue(); // Traiter la file
            }
        }
    }

    // Méthode pour exécuter une tâche
    private async executeTask(task: TaskInterface<T>): Promise<void> {
        task.status = 'running'; // Démarrer la tâche
        try {
            task.result = await task.execute(); // Exécuter la tâche et stocker le résultat
            task.status = 'completed'; // Mettre à jour le statut de la tâche
        } catch (error) {
            task.status = 'failed';
            task.error = error instanceof Error ? error : new Error(String(error));
        }
    }

    // Méthode pour vérifier si la file est vide
    isEmpty(): boolean {
        return this.queue.isEmpty(); // Retourner true si la file est vide, false sinon
    }

    // Méthode pour obtenir la taille de la file
    size(): number {
        return this.queue.size(); // Retourner le nombre de tâches dans la file
    }
}

// Exemple d'utilisation
// Création d'une file de tâches asynchrones avec une capacité de 2 tâches en cours de traitement
const taskQueue = new AsyncTaskQueue<void>(new TaskQueue<void>(), 2);

// Fonction pour créer une tâche asynchrone
function createAsyncTask(id: number, delay: number): AsyncTaskType<void> {
    return async () => {
        console.log(`Starting task ${id}`); // Démarrer la tâche
        await new Promise((resolve) => setTimeout(resolve, delay)); // Attendre le délai spécifié
        console.log(`Completed task ${id}`); // Terminer la tâche
    };
}

// Ajout de tâches à la file
taskQueue.enqueue(createAsyncTask(1, 2000));
taskQueue.enqueue(createAsyncTask(2, 1000));
taskQueue.enqueue(createAsyncTask(3, 3000));

// Ajout d'une tâche qui provoque une erreur
taskQueue.enqueue(async () => {
    throw new Error('This task fails intentionally');
});

taskQueue.enqueue(createAsyncTask(4, 1500));

setTimeout(() => {
    console.log('Is queue empty?', taskQueue.isEmpty());
    console.log('Queue size:', taskQueue.size());
}, 10000);

export type { };

