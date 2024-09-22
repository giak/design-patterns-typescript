// Interface pour les étapes de formulaire
interface FormStepInterface {
    id: string; // Identifiant de l'étape
    title: string; // Titre de l'étape
    fields: string[]; // Champs de l'étape
    validate: () => boolean; // Fonction pour valider les champs
}

// Type pour les données du formulaire
interface FormDataType {
    [key: string]: unknown; // Objet pour stocker les données du formulaire
}

// Classe pour représenter un nœud dans la liste chaînée
class FormStepNode {
    constructor(
        public step: FormStepInterface, // Étape de formulaire
        public next: FormStepNode | null = null, // Prochain noeud
        public prev: FormStepNode | null = null, // Noeud précédent
    ) {}
}

// Classe principale pour gérer le formulaire multi-pages
class MultiStepForm {
    private head: FormStepNode | null = null; // Premier noeud
    private currentStep: FormStepNode | null = null; // Noeud actuel
    private formData: FormDataType = {}; // Données du formulaire

    // Ajouter une étape au formulaire
    public addStep(step: FormStepInterface): void {
        const newNode = new FormStepNode(step); // Créer un nouveau noeud pour l'étape

        if (!this.head) {
            this.head = this.currentStep = newNode; // Si le formulaire est vide, définir le nouveau noeud comme premier et actuel
        } else {
            let current = this.head; // Parcourir la liste chaînée pour trouver le dernier noeud
            while (current.next) {
                current = current.next; // Parcourir la liste chaînée pour trouver le dernier noeud
            }
            current.next = newNode; // Ajouter le nouveau noeud à la fin de la liste
            newNode.prev = current; // Définir le noeud précédent du nouveau noeud
        }

        console.log(`Added step: ${step.title}`); // Afficher le titre de l'étape ajoutée
    }

    // Afficher l'étape courante
    public displayCurrentStep(): void {
        if (!this.currentStep) {
            console.log('No steps in the form'); // Afficher un message si le formulaire est vide
            return;
        }

        const { id, title, fields } = this.currentStep.step; // Obtenir les données de l'étape actuelle
        console.log(`Current step: [ID: ${id}] ${title}`); // Afficher le titre de l'étape actuelle
        console.log('Fields:', fields.join(', ')); // Afficher les champs de l'étape actuelle
    }

    // Passer à l'étape suivante
    public nextStep(): boolean {
        return this.moveStep('next'); // Passer à l'étape suivante
    }

    // Revenir à l'étape précédente
    public previousStep(): boolean {
        return this.moveStep('prev'); // Revenir à l'étape précédente
    }

    // Mettre à jour les données du formulaire
    public updateFormData(data: FormDataType): void {
        Object.assign(this.formData, data); // Mettre à jour les données du formulaire
    }

    // Obtenir les données du formulaire
    public getFormData(): FormDataType {
        return { ...this.formData }; // Retourner les données du formulaire
    }

    // Soumettre le formulaire
    public async submitForm(): Promise<boolean> {
        let current = this.head; // Parcourir la liste chaînée pour valider chaque étape
        while (current) {
            if (!current.step.validate()) { // Valider l'étape actuelle
                console.log(`Validation failed at step: ${current.step.title}`); // Afficher le titre de l'étape où la validation a échoué
                return false; // Retourner false si la validation a échoué
            }
            current = current.next; // Passer à l'étape suivante
        }

        console.log('Form submitted successfully');
        console.log('Form data:', this.formData); // Afficher les données du formulaire
        return true; // Retourner true si le formulaire est valide
    }

    // Méthode privée pour déplacer l'étape (next ou prev)
    private moveStep(direction: 'next' | 'prev'): boolean {
        if (!this.currentStep || !this.currentStep[direction]) { // Vérifier si l'étape actuelle est disponible
            console.log(`No ${direction} step available`); // Afficher un message si l'étape n'est pas disponible
            return false; // Retourner false si l'étape n'est pas disponible
        }

        if (direction === 'next' && !this.currentStep.step.validate()) {
            console.log('Current step validation failed'); // Afficher un message si la validation a échoué
            return false; // Retourner false si la validation a échoué
        }

        this.currentStep = this.currentStep[direction]; // Définir l'étape actuelle
        this.displayCurrentStep(); // Afficher l'étape actuelle
        return true; // Retourner true si l'étape est disponible et valide
    }
}

// Classe pour créer des étapes de formulaire
class FormStepFactory {
    // Créer une étape de formulaire
    static createStep(id: string, title: string, fields: string[]): FormStepInterface {
        return {
            id,
            title,
            fields,
            validate: () => true, // Simplification: toujours valide
        };
    }
}

// Exemple d'utilisation
const form = new MultiStepForm();

// Ajouter des étapes au formulaire
form.addStep(FormStepFactory.createStep('personal', 'Personal Information', ['name', 'email', 'phone']));
form.addStep(FormStepFactory.createStep('address', 'Address', ['street', 'city', 'zipCode']));
form.addStep(FormStepFactory.createStep('payment', 'Payment Information', ['cardNumber', 'expiryDate', 'cvv']));

// Afficher l'étape courante
form.displayCurrentStep();

// Simuler la navigation et la saisie des données
form.updateFormData({ name: 'John Doe', email: 'john@example.com', phone: '1234567890' });
form.nextStep();

form.updateFormData({ street: '123 Main St', city: 'Anytown', zipCode: '12345' });
form.nextStep();

form.updateFormData({ cardNumber: '1111222233334444', expiryDate: '12/25', cvv: '123' });

// Revenir à l'étape précédente
form.previousStep();

// Avancer à nouveau
form.nextStep();

// Soumettre le formulaire
form.submitForm().then((success) => {
    if (success) {
        console.log('Form submitted successfully');
    } else {
        console.log('Form submission failed');
    }
});

export type { };

