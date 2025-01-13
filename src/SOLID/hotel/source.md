# État Initial du Code : Analyse des Problèmes

## Analogie avec la Construction d'une Maison

Imaginez une maison construite sans plan d'architecte, où tout a été fait au fur et à mesure des besoins :

### La Maison Monolithique

-   **Structure** : Une grande pièce unique servant à tout (cuisine, salon, chambre, bureau)
-   **Installation** : Tous les systèmes (électricité, plomberie, chauffage) sont entremêlés
-   **Modifications** : Impossible d'ajouter une pièce sans tout casser
-   **Maintenance** : Réparer un élément nécessite d'intervenir sur l'ensemble

### Les Problèmes

-   **Rigidité** : Comme les murs porteurs sont partout, on ne peut rien déplacer
-   **Fragilité** : Toucher à un élément risque d'en casser d'autres
-   **Immobilité** : Impossible d'ajouter de nouvelles fonctionnalités
-   **Complexité** : Difficile de comprendre comment tout fonctionne ensemble

### Parallèle avec Notre Code

Tout comme cette maison mal conçue, notre code initial du système de réservation d'hôtel souffre de problèmes similaires :

| Maison                | Code                                                        |
| --------------------- | ----------------------------------------------------------- |
| Grande pièce unique   | Classe monolithique `HotelBookingService`                   |
| Systèmes entremêlés   | Responsabilités mélangées (données, logique, notifications) |
| Murs porteurs partout | Couplage fort entre les composants                          |
| Réparations complexes | Maintenance difficile et risquée                            |

## Structure du Code Original

Le code initial dans `source.ts` présente une implémentation monolithique d'un système de réservation d'hôtel. Voici son analyse détaillée :

### 1. Architecture Monolithique

La classe `HotelBookingService` centralise toute la logique de l'application :

```typescript
class HotelBookingService {
    private rooms: RoomInterface[] = [...]
    private bookings: BookingInterface[] = []
    private emailService = new EmailService()

    public bookRoom(customer, roomId, checkInDate, checkOutDate, discountCode?) {...}
}
```

### 2. Multiples Responsabilités

La classe gère simultanément :

-   **Gestion des Données**

    -   Stockage direct des chambres (`rooms`)
    -   Stockage direct des réservations (`bookings`)
    -   Mise à jour des disponibilités

-   **Logique Métier**

    -   Validation des dates
    -   Calcul des prix
    -   Application des remises
    -   Vérification des disponibilités

-   **Communication**
    -   Envoi d'emails de confirmation
    -   Formatage des messages

### 3. Problèmes de Conception

#### Couplage Fort

-   La classe crée directement ses dépendances (ex: `new EmailService()`)
-   Les données sont stockées en mémoire dans la classe
-   La logique de notification est étroitement liée à l'email

#### Manque de Flexibilité

-   Impossible de changer facilement le stockage des données
-   Difficile d'ajouter de nouveaux types de notifications
-   Complexe de modifier la logique de calcul des prix

#### Testabilité Limitée

-   Tests unitaires complexes à cause des multiples responsabilités
-   Difficile de mocker les dépendances
-   Impossible de tester les composants individuellement

#### Maintenance Difficile

-   Une modification dans une fonctionnalité peut affecter les autres
-   Code difficile à comprendre et à maintenir
-   Risque élevé d'introduction de bugs

### 4. Violations des Principes SOLID

#### Single Responsibility Principle (SRP)

-   La classe a de multiples raisons de changer :

    ```typescript
    public bookRoom(...) {
        // Validation des dates
        if (nights <= 0) { return 'Invalid check-in or check-out date.' }

        // Recherche de chambre
        let room: RoomInterface | undefined;
        for (let i = 0; i < this.rooms.length; i++) {...}

        // Calcul du prix
        let totalPrice = nights * room.pricePerNight;
        if (discountCode) {...}

        // Stockage de la réservation
        this.bookings.push({...});

        // Envoi d'email
        this.emailService.sendEmail(...);
    }
    ```

#### Open/Closed Principle (OCP)

-   Modifications nécessaires dans la classe pour :
    -   Ajouter de nouveaux types de chambres
    -   Modifier la logique de prix
    -   Changer le système de notification

#### Dependency Inversion Principle (DIP)

-   Dépendances directes sur les implémentations
-   Pas d'abstraction pour le stockage des données
-   Couplage fort avec le service d'email

## Impact sur le Développement

Cette structure initiale pose plusieurs défis :

1. **Évolutivité Limitée**

    - Difficile d'ajouter de nouvelles fonctionnalités
    - Risque élevé de régression

2. **Maintenance Coûteuse**

    - Code difficile à comprendre
    - Modifications risquées
    - Tests complexes à maintenir

3. **Réutilisation Impossible**
    - Composants trop couplés
    - Logique métier mélangée avec l'infrastructure

Cette analyse justifie la nécessité d'une refactorisation en appliquant les principes SOLID, comme démontré dans la version refactorisée.
