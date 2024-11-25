## 🔍 Analyse détaillée de chaque approche

### 1. Try/Catch Traditionnel

Le try/catch est l'approche fondamentale de gestion d'erreurs en TypeScript, héritée de JavaScript. Bien que simple en apparence, son utilisation efficace en TypeScript moderne nécessite une compréhension approfondie des bonnes pratiques et des pièges potentiels.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
try {
  const data = JSON.parse(invalidJson);
  processData(data);
} catch (error: unknown) {  // TypeScript 5: typage explicite de l'erreur
  if (error instanceof Error) {
    console.error("Une erreur est survenue:", error.message);
    // Accès sécurisé aux propriétés de Error
  } else {
    console.error("Une erreur inconnue est survenue:", String(error));
  }
}
```

#### 🔄 Implémentation avancée avec gestion d'erreurs typée

```typescript
// Définition d'erreurs métier spécifiques
class BusinessError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "BusinessError";
    // Fix pour la chaîne de prototype en TypeScript
    Object.setPrototypeOf(this, BusinessError.prototype);
  }
}

// Gestionnaire d'erreurs typé
function handleError(error: unknown): never {
  // Erreurs métier
  if (error instanceof BusinessError) {
    console.error(`[${error.code}] ${error.message}`, error.details);
    throw error;
  }
  
  // Erreurs de syntaxe JSON
  if (error instanceof SyntaxError) {
    throw new BusinessError(
      "Format de données invalide",
      "INVALID_FORMAT",
      { originalError: error.message }
    );
  }
  
  // Erreurs réseau
  if (error instanceof TypeError) {
    throw new BusinessError(
      "Erreur de communication",
      "NETWORK_ERROR",
      { originalError: error.message }
    );
  }
  
  // Erreurs inconnues
  throw new BusinessError(
    "Erreur système inattendue",
    "SYSTEM_ERROR",
    { originalError: String(error) }
  );
}

// Utilisation dans une fonction async
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new BusinessError(
        "Échec de récupération des données utilisateur",
        "API_ERROR",
        {
          status: response.status,
          statusText: response.statusText
        }
      );
    }
    return await response.json();
  } catch (error: unknown) {
    handleError(error);
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Gestion d'erreurs asynchrones avec async/await
- Intégration avec des APIs externes
- Validation de données d'entrée
- Conversion d'erreurs système en erreurs métier
- Logging et monitoring d'erreurs

#### ✅ Avantages détaillés
1. **Intégration native**
   - Support complet de TypeScript 5
   - Compatibilité avec async/await
   - Pas de dépendances externes
   - Performance optimale du moteur V8

2. **Flexibilité du typage**
   - Discrimination de type précise
   - Conversion d'erreurs typée
   - Inférence de type automatique
   - Support des unions de types

3. **Gestion contextuelle**
   - Capture du contexte d'exécution
   - Stack traces détaillées
   - Métadonnées personnalisables
   - Chaînage d'erreurs possible

#### ❌ Inconvénients détaillés
1. **Sécurité du typage**
   - Type `unknown` obligatoire depuis TS 4.4
   - Vérifications de type manuelles nécessaires
   - Risque d'oubli de vérification de type
   - Complexité accrue du code

2. **Gestion du flux**
   - Interruption du flux d'exécution
   - Difficile à composer
   - Nested try/catch problématiques
   - Difficile à tester exhaustivement

3. **Maintenance**
   - Code défensif nécessaire
   - Duplication possible des handlers
   - Documentation cruciale
   - Tests complexes à écrire

#### 🛠️ Bonnes pratiques modernes
1. **Typage strict des erreurs**
```typescript
// Définition d'une hiérarchie d'erreurs
interface ErrorDetails {
  code: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

class DomainError extends Error {
  constructor(
    message: string,
    public readonly details: ErrorDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

// Utilisation avec type guard
function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
```

2. **Gestion asynchrone moderne**
```typescript
// Wrapper pour la gestion d'erreurs async
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    if (isDomainError(error)) {
      error.details.context = { ...error.details.context, ...context };
      throw error;
    }
    throw new DomainError("Erreur d'opération", {
      code: "OPERATION_ERROR",
      timestamp: new Date(),
      context: { ...context, originalError: error }
    });
  }
}

// Utilisation
const result = await withErrorHandling(
  () => fetchUserData(userId),
  { userId, operation: "fetchUserData" }
);
```

3. **Pattern de conversion d'erreurs**
```typescript
// Convertisseur d'erreurs typé
class ErrorConverter {
  static toDomainError(error: unknown, context?: Record<string, unknown>): DomainError {
    if (isDomainError(error)) {
      return error;
    }

    if (error instanceof TypeError) {
      return new DomainError("Erreur réseau", {
        code: "NETWORK_ERROR",
        timestamp: new Date(),
        context: { ...context, originalError: error.message }
      });
    }

    return new DomainError("Erreur système", {
      code: "SYSTEM_ERROR",
      timestamp: new Date(),
      context: { ...context, originalError: String(error) }
    });
  }
}
```

#### 📊 Métriques de qualité
- **Maintenabilité**: 🟡 Moyenne
  - Nécessite une discipline stricte
  - Documentation importante requise
  - Structure claire mais verbeuse

- **Testabilité**: 🟡 Moyenne
  - Tests unitaires possibles
  - Mocking complexe
  - Couverture difficile à garantir

- **Réutilisabilité**: 🟡 Moyenne
  - Patterns réutilisables
  - Duplication possible
  - Abstraction limitée

- **Évolutivité**: 🟡 Moyenne
  - Ajout facile de nouveaux types d'erreurs
  - Refactoring complexe
  - Risque de code spaghetti

#### 🔍 Conclusion
Le try/catch reste un outil fondamental en TypeScript, mais son utilisation efficace nécessite une approche structurée et des pratiques modernes. L'adoption de patterns comme la conversion d'erreurs typée et la gestion contextuelle permet de mitiger ses limitations intrinsèques. Pour les applications complexes, il est souvent préférable de le combiner avec d'autres approches comme Either ou Result.


### 2. Result/Option Pattern

Le Result/Option Pattern est une approche robuste et type-safe inspirée des langages fonctionnels comme Rust et Scala. Il offre une gestion d'erreurs explicite et prévisible, particulièrement adaptée aux applications critiques nécessitant une forte fiabilité.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour Result
type Success<T> = { success: true; value: T };
type Failure<E> = { success: false; error: E };
type Result<T, E> = Success<T> | Failure<E>;

// Types d'erreurs métier
interface ValidationError {
  code: string;
  field: string;
  message: string;
}

// Fonction utilitaire de création
const Result = {
  success<T, E>(value: T): Result<T, E> {
    return { success: true, value };
  },
  failure<T, E>(error: E): Result<T, E> {
    return { success: false, error };
  }
};

// Exemple d'utilisation simple
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return Result.failure("Division par zéro impossible");
  }
  return Result.success(a / b);
}
```

#### 🔄 Implémentation avancée avec utilitaires complets

```typescript
// Classe Result complète avec utilitaires
class ResultClass<T, E> {
  private constructor(
    private readonly value: T | null,
    private readonly error: E | null,
    private readonly isSuccess: boolean
  ) {}

  static success<T, E>(value: T): ResultClass<T, E> {
    return new ResultClass<T, E>(value, null, true);
  }

  static failure<T, E>(error: E): ResultClass<T, E> {
    return new ResultClass<T, E>(null, error, false);
  }

  // Transformation du succès
  map<U>(fn: (value: T) => U): ResultClass<U, E> {
    return this.isSuccess && this.value !== null
      ? ResultClass.success(fn(this.value))
      : ResultClass.failure(this.error as E);
  }

  // Transformation de l'erreur
  mapError<F>(fn: (error: E) => F): ResultClass<T, F> {
    return this.isSuccess
      ? ResultClass.success(this.value as T)
      : ResultClass.failure(fn(this.error as E));
  }

  // Chaînage de résultats
  flatMap<U>(fn: (value: T) => ResultClass<U, E>): ResultClass<U, E> {
    return this.isSuccess && this.value !== null
      ? fn(this.value)
      : ResultClass.failure(this.error as E);
  }

  // Récupération sécurisée des valeurs
  getOrElse(defaultValue: T): T {
    return this.isSuccess && this.value !== null ? this.value : defaultValue;
  }

  // Pattern matching
  match<U>(pattern: { success: (value: T) => U; failure: (error: E) => U }): U {
    return this.isSuccess && this.value !== null
      ? pattern.success(this.value)
      : pattern.failure(this.error as E);
  }
}

// Exemple d'utilisation avancée
interface UserData {
  email: string;
  password: string;
}

class UserService {
  validateUser(data: UserData): ResultClass<UserData, ValidationError[]> {
    const errors: ValidationError[] = [];

    if (!data.email.includes("@")) {
      errors.push({
        code: "INVALID_EMAIL",
        field: "email",
        message: "Format d'email invalide"
      });
    }

    if (data.password.length < 8) {
      errors.push({
        code: "INVALID_PASSWORD",
        field: "password",
        message: "Le mot de passe doit contenir au moins 8 caractères"
      });
    }

    return errors.length > 0
      ? ResultClass.failure(errors)
      : ResultClass.success(data);
  }

  async createUser(data: UserData): Promise<ResultClass<User, ValidationError[] | ApiError>> {
    return this.validateUser(data)
      .flatMap(async (validData) => {
        try {
          const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(validData)
          });

          if (!response.ok) {
            return ResultClass.failure([{
              code: "API_ERROR",
              field: "request",
              message: `Erreur API: ${response.status}`
            }]);
          }

          const user = await response.json();
          return ResultClass.success(user);
        } catch (error) {
          return ResultClass.failure([{
            code: "NETWORK_ERROR",
            field: "request",
            message: "Erreur réseau"
          }]);
        }
      });
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Applications critiques avec besoin de fiabilité élevée
- Validation de données complexe avec feedback détaillé
- APIs publiques nécessitant une gestion d'erreurs prévisible
- Opérations en chaîne avec transformations de données
- Services métier avec logique de validation sophistiquée

#### ✅ Avantages détaillés
1. **Sécurité du typage** (🟢 Excellente)
   - Typage fort des succès et erreurs
   - Discrimination de type automatique
   - Détection des erreurs à la compilation
   - Impossible d'oublier de gérer un cas

2. **Maintenabilité** (🟢 Bonne)
   - Structure claire et prévisible
   - Séparation des cas de succès et d'échec
   - Facilité d'extension et d'évolution
   - Documentation implicite du comportement

3. **Testabilité** (🟢 Facile)
   - Tests unitaires simples à écrire
   - Cas d'erreurs facilement simulables
   - Comportement déterministe
   - Mocking simplifié

#### ❌ Inconvénients détaillés
1. **Verbosité** (🟡 Moyenne)
   - Plus de code initial nécessaire
   - Définitions de types additionnelles
   - Wrappers pour les opérations standards
   - Utilitaires à maintenir

2. **Courbe d'apprentissage** (🟡 Moyenne)
   - Concepts fonctionnels à maîtriser
   - Patterns de transformation à comprendre
   - Changement de paradigme nécessaire
   - Documentation à maintenir

3. **Complexité d'implémentation** (🟡 Moyenne)
   - Setup initial conséquent
   - Intégration avec code existant
   - Gestion des cas complexes
   - Surcharge cognitive initiale

#### 🛠️ Bonnes pratiques
1. **Types génériques réutilisables**
```typescript
// Types d'erreurs standards
type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

// Alias de types communs
type ValidationResult<T> = Result<T, ValidationError[]>;
type ApiResult<T> = Result<T, ApiError>;

// Utilitaires de conversion
function fromPromise<T>(promise: Promise<T>): Promise<Result<T, Error>> {
  return promise
    .then((value) => Result.success<T, Error>(value))
    .catch((error) => Result.failure<T, Error>(error));
}
```

2. **Combinateurs de résultats**
```typescript
// Combinaison de plusieurs résultats
function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (!result.success) {
      return result; // Retourne la première erreur
    }
    values.push(result.value);
  }
  return { success: true, value: values };
}

// Parallélisation de résultats asynchrones
async function parallel<T, E>(
  results: Promise<Result<T, E>>[]
): Promise<Result<T[], E>> {
  try {
    const resolved = await Promise.all(results);
    return combine(resolved);
  } catch (error) {
    return Result.failure(error as E);
  }
}
```

3. **Intégration avec API existante**
```typescript
// Wrapper pour les fonctions pouvant throw
function tryCatch<T, E>(fn: () => T): Result<T, E> {
  try {
    return Result.success(fn());
  } catch (error) {
    return Result.failure(error as E);
  }
}

// Conversion de callbacks en Result
function fromCallback<T, E>(
  fn: (callback: (error: E | null, result?: T) => void) => void
): Promise<Result<T, E>> {
  return new Promise((resolve) => {
    fn((error, result) => {
      if (error) {
        resolve(Result.failure(error));
      } else {
        resolve(Result.success(result as T));
      }
    });
  });
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Bonne
  - Code auto-documenté
  - Intentions claires
  - Structure cohérente
  - Patterns reconnaissables

- **Sécurité du typage**: 🟢 Excellente
  - Typage complet
  - Inférence de type
  - Exhaustivité vérifiée
  - Erreurs à la compilation

- **Verbosité**: 🟡 Moyenne
  - Setup initial conséquent
  - Utilitaires nécessaires
  - Boilerplate modéré
  - Réutilisation possible

- **Performance**: 🟢 Excellente
  - Overhead minimal
  - Optimisation possible
  - Pas d'allocation excessive
  - GC-friendly

- **Maintenabilité**: 🟢 Bonne
  - Structure claire
  - Extensions faciles
  - Refactoring sûr
  - Tests robustes

- **Testabilité**: 🟢 Facile
  - Tests unitaires simples
  - Comportement prévisible
  - Mocking facile
  - Couverture complète

- **Complexité d'implémentation**: 🔴 Moyenne
  - Setup initial
  - Concepts à maîtriser
  - Documentation nécessaire
  - Courbe d'apprentissage

#### ��� Conclusion
Le Result/Option Pattern offre un excellent compromis entre sécurité du typage et maintenabilité, particulièrement adapté aux applications critiques nécessitant une gestion d'erreurs robuste. Bien que nécessitant un investissement initial en termes de setup et d'apprentissage, il apporte une valeur significative en termes de fiabilité et de maintenabilité du code. Son adoption est particulièrement recommandée pour les projets nécessitant une gestion d'erreurs prévisible et type-safe.


### 3. Either Pattern

Le Either Pattern est une approche fonctionnelle sophistiquée qui représente une valeur pouvant être de deux types différents : Left (généralement pour les erreurs) ou Right (pour les succès). Cette approche, issue de la programmation fonctionnelle, offre une gestion d'erreurs élégante et type-safe avec une grande composabilité.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour Either
type Left<L> = { readonly _tag: "Left"; readonly left: L };
type Right<R> = { readonly _tag: "Right"; readonly right: R };
type Either<L, R> = Left<L> | Right<R>;

// Constructeurs
const Either = {
  left<L, R>(value: L): Either<L, R> {
    return { _tag: "Left", left: value };
  },
  right<L, R>(value: R): Either<L, R> {
    return { _tag: "Right", right: value };
  },
  isLeft<L, R>(either: Either<L, R>): either is Left<L> {
    return either._tag === "Left";
  },
  isRight<L, R>(either: Either<L, R>): either is Right<R> {
    return either._tag === "Right";
  }
};

// Exemple d'utilisation simple
function divide(a: number, b: number): Either<string, number> {
  return b === 0
    ? Either.left("Division par zéro impossible")
    : Either.right(a / b);
}
```

#### 🔄 Implémentation avancée avec Monade

```typescript
class EitherClass<L, R> {
  private constructor(
    private readonly value: L | R,
    private readonly _tag: "Left" | "Right"
  ) {}

  static left<L, R>(value: L): EitherClass<L, R> {
    return new EitherClass<L, R>(value, "Left");
  }

  static right<L, R>(value: R): EitherClass<L, R> {
    return new EitherClass<L, R>(value, "Right");
  }

  // Transformation du Right
  map<T>(fn: (r: R) => T): EitherClass<L, T> {
    return this.isRight()
      ? EitherClass.right(fn(this.value as R))
      : EitherClass.left(this.value as L);
  }

  // Transformation du Left
  mapLeft<T>(fn: (l: L) => T): EitherClass<T, R> {
    return this.isLeft()
      ? EitherClass.left(fn(this.value as L))
      : EitherClass.right(this.value as R);
  }

  // Chaînage (bind)
  flatMap<T>(fn: (r: R) => EitherClass<L, T>): EitherClass<L, T> {
    return this.isRight()
      ? fn(this.value as R)
      : EitherClass.left(this.value as L);
  }

  // Pattern matching
  fold<T>(leftFn: (l: L) => T, rightFn: (r: R) => T): T {
    return this.isLeft()
      ? leftFn(this.value as L)
      : rightFn(this.value as R);
  }

  // Utilitaires
  isLeft(): boolean {
    return this._tag === "Left";
  }

  isRight(): boolean {
    return this._tag === "Right";
  }

  // Récupération sécurisée des valeurs
  getOrElse(defaultValue: R): R {
    return this.isRight() ? (this.value as R) : defaultValue;
  }

  // Conversion en string pour le debug
  toString(): string {
    return this.isLeft()
      ? `Left(${String(this.value)})`
      : `Right(${String(this.value)})`;
  }
}

// Exemple d'utilisation avancée
interface ValidationError {
  field: string;
  message: string;
}

class UserValidator {
  private validateEmail(email: string): EitherClass<ValidationError, string> {
    return email.includes("@")
      ? EitherClass.right(email)
      : EitherClass.left({
          field: "email",
          message: "Format d'email invalide"
        });
  }

  private validatePassword(password: string): EitherClass<ValidationError, string> {
    return password.length >= 8
      ? EitherClass.right(password)
      : EitherClass.left({
          field: "password",
          message: "Le mot de passe doit contenir au moins 8 caractères"
        });
  }

  validateUser(email: string, password: string): EitherClass<ValidationError, { email: string; password: string }> {
    return this.validateEmail(email).flatMap(validEmail =>
      this.validatePassword(password).map(validPassword => ({
        email: validEmail,
        password: validPassword
      }))
    ));
  }
}

// Utilisation avec gestion d'erreurs asynchrone
class UserService {
  async createUser(
    email: string,
    password: string
  ): Promise<EitherClass<ValidationError | Error, User>> {
    try {
      const validationResult = new UserValidator().validateUser(email, password);
      
      if (validationResult.isLeft()) {
        return validationResult as EitherClass<ValidationError, User>;
      }

      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(validationResult.getOrElse({ email: "", password: "" }))
      });

      if (!response.ok) {
        return EitherClass.left(new Error(`HTTP error! status: ${response.status}`));
      }

      const user = await response.json();
      return EitherClass.right(user);
    } catch (error) {
      return EitherClass.left(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Applications avec traitement fonctionnel des données
- Validation complexe avec transformations en chaîne
- APIs avec gestion d'erreurs sophistiquée
- Opérations composables avec effets de bord contrôlés
- Systèmes avec besoin de traçabilité des erreurs

#### ✅ Avantages d��taillés
1. **Sécurité du typage** (🟢 Excellente)
   - Discrimination de type complète
   - Gestion exhaustive des cas
   - Inférence de type puissante
   - Composition type-safe

2. **Composabilité** (🟢 Excellente)
   - Chaînage naturel des opérations
   - Transformations type-safe
   - Combinaison d'opérations
   - Réutilisation des patterns

3. **Maintenabilité** (🟢 Excellente)
   - Structure prévisible
   - Code déclaratif
   - Séparation des préoccupations
   - Facilité de refactoring

#### ❌ Inconvénients détaillés
1. **Verbosité** (🔴 Élevée)
   - Boilerplate initial important
   - Définitions de types complexes
   - Setup des utilitaires
   - Documentation nécessaire

2. **Complexité conceptuelle** (🔴 Complexe)
   - Concepts fonctionnels avancés
   - Courbe d'apprentissage raide
   - Paradigme différent
   - Abstractions sophistiquées

3. **Adoption par l'équipe** (🔴 Difficile)
   - Formation nécessaire
   - Résistance possible
   - Documentation importante
   - Temps d'adaptation

#### 🛠️ Bonnes pratiques
1. **Utilitaires de transformation**
```typescript
// Utilitaires pour la composition
const EitherUtils = {
  // Séquence d'opérations
  sequence<L, R>(eithers: Array<Either<L, R>>): Either<L, R[]> {
    const results: R[] = [];
    for (const either of eithers) {
      if (Either.isLeft(either)) {
        return either;
      }
      results.push(either.right);
    }
    return Either.right(results);
  },

  // Transformation de Promise en Either
  fromPromise<L, R>(promise: Promise<R>): Promise<Either<L, R>> {
    return promise
      .then((value) => Either.right<L, R>(value))
      .catch((error) => Either.left<L, R>(error));
  },

  // Combinaison de deux Either
  combine<L, A, B>(
    eitherA: Either<L, A>,
    eitherB: Either<L, B>
  ): Either<L, [A, B]> {
    if (Either.isLeft(eitherA)) return eitherA;
    if (Either.isLeft(eitherB)) return eitherB;
    return Either.right([eitherA.right, eitherB.right]);
  }
};
```

2. **Pattern Matching type-safe**
```typescript
// Type helper pour le pattern matching
type Pattern<L, R, T> = {
  Left: (left: L) => T;
  Right: (right: R) => T;
};

// Fonction de pattern matching
function match<L, R, T>(
  either: Either<L, R>,
  pattern: Pattern<L, R, T>
): T {
  return Either.isLeft(either)
    ? pattern.Left(either.left)
    : pattern.Right(either.right);
}

// Utilisation
const result = match(divide(10, 2), {
  Left: (error) => `Erreur: ${error}`,
  Right: (value) => `Résultat: ${value}`
});
```

3. **Gestion des effets de bord**
```typescript
// Wrapper pour les effets de bord
function tryCatch<L, R>(f: () => R): Either<L, R> {
  try {
    return Either.right(f());
  } catch (error) {
    return Either.left(error as L);
  }
}

// Gestion des effets asynchrones
async function tryCatchAsync<L, R>(
  f: () => Promise<R>
): Promise<Either<L, R>> {
  try {
    const result = await f();
    return Either.right(result);
  } catch (error) {
    return Either.left(error as L);
  }
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Bonne
  - Code déclaratif
  - Intentions claires
  - Flux de données visible
  - Structure cohérente

- **Sécurité du typage**: 🟢 Excellente
  - Typage discriminé
  - Exhaustivité vérifiée
  - Composition type-safe
  - Inférence puissante

- **Verbosité**: 🔴 Élevée
  - Setup conséquent
  - Boilerplate nécessaire
  - Types complexes
  - Utilitaires nombreux

- **Performance**: 🟢 Excellente
  - Optimisations possibles
  - Allocation contrôlée
  - GC-friendly
  - Pas de surcoût majeur

- **Maintenabilité**: 🟢 Excellente
  - Code prévisible
  - Refactoring sûr
  - Tests robustes
  - Documentation claire

- **Testabilité**: 🟢 Facile
  - Tests unitaires simples
  - Comportement prévisible
  - Mocking facile
  - Couverture complète

- **Complexité d'implémentation**: 🔴 Simple
  - Concept basique
  - Setup minimal
  - Pas d'abstraction
  - Documentation simple

#### 🔍 Conclusion
Le Either Pattern représente l'approche la plus sophistiquée et robuste pour la gestion d'erreurs en TypeScript. Bien qu'il nécessite un investissement initial important en termes d'apprentissage et de setup, il offre des garanties uniques en termes de type-safety et de composabilité. Son adoption est particulièrement recommandée pour les projets complexes nécessitant une gestion d'erreurs rigoureuse et une maintenance à long terme. La principale difficulté réside dans la formation de l'équipe et l'acceptation du paradigme fonctionnel, mais les bénéfices en termes de qualité de code et de maintenabilité justifient largement cet investissement.


### 4. Nullable Values

L'approche Nullable Values utilise les valeurs `null` ou `undefined` natives de TypeScript pour signaler l'absence de valeur ou une erreur. Bien que simple, cette approche nécessite une attention particulière avec l'option `strictNullChecks` de TypeScript pour garantir la sécurité des types.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour les valeurs nullables
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

// Exemple simple de fonction retournant une valeur nullable
function findUserById(id: string): Nullable<User> {
  const user = database.get(id);
  return user || null;
}

// Utilisation avec vérification de null
const user = findUserById("123");
if (user !== null) {
  console.log(user.name); // TypeScript sait que user est non-null ici
} else {
  console.log("Utilisateur non trouvé");
}
```

#### 🔄 Implémentation avancée avec utilitaires

```typescript
// Utilitaires pour les valeurs nullables
class NullableUtils {
  // Transformation sécurisée
  static map<T, U>(value: Nullable<T>, fn: (value: T) => U): Nullable<U> {
    return value === null ? null : fn(value);
  }

  // Chaînage de transformations
  static flatMap<T, U>(
    value: Nullable<T>,
    fn: (value: T) => Nullable<U>
  ): Nullable<U> {
    return value === null ? null : fn(value);
  }

  // Valeur par défaut
  static getOrElse<T>(value: Nullable<T>, defaultValue: T): T {
    return value === null ? defaultValue : value;
  }

  // Vérification de présence
  static isPresent<T>(value: Nullable<T>): value is T {
    return value !== null;
  }

  // Filtrage
  static filter<T>(
    value: Nullable<T>,
    predicate: (value: T) => boolean
  ): Nullable<T> {
    return value !== null && predicate(value) ? value : null;
  }
}

// Exemple d'utilisation avancée
interface UserRepository {
  findById(id: string): Nullable<User>;
  findByEmail(email: string): Nullable<User>;
}

class UserService {
  constructor(private repository: UserRepository) {}

  // Exemple de chaînage avec nullable
  findUserWithDetails(id: string): Nullable<UserDetails> {
    return NullableUtils.flatMap(
      this.repository.findById(id),
      user => this.enrichUserData(user)
    );
  }

  private enrichUserData(user: User): Nullable<UserDetails> {
    const preferences = this.loadUserPreferences(user.id);
    if (!preferences) return null;

    const lastLogin = this.getLastLoginDate(user.id);
    if (!lastLogin) return null;

    return {
      ...user,
      preferences,
      lastLogin
    };
  }

  // Exemple avec multiple nullable
  async updateUserEmail(
    userId: string,
    newEmail: string
  ): Promise<Nullable<User>> {
    const user = this.repository.findById(userId);
    if (!user) return null;

    const existingUserWithEmail = this.repository.findByEmail(newEmail);
    if (existingUserWithEmail) return null;

    try {
      user.email = newEmail;
      await this.repository.save(user);
      return user;
    } catch {
      return null;
    }
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Petits projets avec logique simple
- Prototypes et POCs
- Intégration avec APIs retournant null
- Cas où la performance est critique
- Validation simple de données

#### ✅ Avantages détaillés
1. **Simplicité** (🟢 Excellente)
   - Concept natif du langage
   - Pas de setup nécessaire
   - Facile à comprendre
   - Documentation abondante

2. **Performance** (🟢 Excellente)
   - Pas d'overhead mémoire
   - Optimisations du moteur JS
   - Pas d'allocations supplémentaires
   - GC-friendly

3. **Support natif** (🟢 Bon)
   - Intégré à TypeScript
   - Opérateurs dédiés (?., ??, !)
   - Inférence de type automatique
   - Compatibilité totale

#### ❌ Inconvénients détaillés
1. **Sécurité du typage** (🟡 Moyenne)
   - Risques de null pointer
   - Vérifications constantes nécessaires
   - Pas de contexte d'erreur
   - Confusion null/undefined

2. **Maintenabilité** (🔴 Faible)
   - Code défensif nécessaire
   - Tests complexes
   - Debug difficile
   - Évolution limitée

3. **Évolutivité** (🔴 Faible)
   - Difficile d'ajouter du contexte
   - Pas de distinction des cas d'erreur
   - Refactoring risqué
   - Extension limitée

#### 🛠️ Bonnes pratiques
1. **Configuration TypeScript stricte**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true
  }
}

// Exemple d'utilisation sécurisée
function processUser(user: Nullable<User>): string {
  // TypeScript force la vérification
  if (user === null) {
    return "Utilisateur non disponible";
  }
  // TypeScript sait que user est non-null ici
  return user.name;
}
```

2. **Utilitaires de chaînage**
```typescript
// Utilitaires pour le chaînage sécurisé
class Optional<T> {
  private constructor(private value: T | null) {}

  static of<T>(value: T | null): Optional<T> {
    return new Optional(value);
  }

  map<U>(fn: (value: T) => U): Optional<U> {
    return this.value === null
      ? Optional.of(null)
      : Optional.of(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Optional<U>): Optional<U> {
    return this.value === null
      ? Optional.of(null)
      : fn(this.value);
  }

  getOrElse(defaultValue: T): T {
    return this.value === null ? defaultValue : this.value;
  }
}

// Utilisation
const userOptional = Optional.of(findUserById("123"))
  .map(user => user.email)
  .map(email => email.toLowerCase());
```

3. **Gestion des cas nullables multiples**
```typescript
// Helper pour combiner des nullables
function combine<T1, T2, R>(
  value1: Nullable<T1>,
  value2: Nullable<T2>,
  fn: (v1: T1, v2: T2) => R
): Nullable<R> {
  if (value1 === null || value2 === null) {
    return null;
  }
  return fn(value1, value2);
}

// Exemple d'utilisation
const result = combine(
  findUserById("123"),
  findUserPreferences("123"),
  (user, prefs) => ({
    name: user.name,
    theme: prefs.theme
  })
);
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Bonne
  - Syntaxe simple
  - Concepts familiers
  - Code concis
  - Intention claire

- **Sécurité du typage**: 🟡 Moyenne
  - Dépend de strictNullChecks
  - Risques de runtime
  - Vérifications manuelles
  - Pas de contexte d'erreur

- **Verbosité**: 🟢 Faible
  - Syntaxe concise
  - Peu de boilerplate
  - Opérateurs natifs
  - Setup minimal

- **Performance**: 🟢 Excellente
  - Pas d'overhead
  - Optimisations V8
  - Allocation minimale
  - GC efficace

- **Maintenabilité**: 🔴 Faible
  - Code défensif
  - Tests complexes
  - Debug difficile
  - Évolution limitée

- **Testabilité**: 🟡 Moyenne
  - Tests simples à écrire
  - Couverture difficile
  - Cas limites nombreux
  - Mocking simple

- **Complexité d'implémentation**: 🟢 Simple
  - Concept basique
  - Setup minimal
  - Pas d'abstraction
  - Documentation simple

#### 🔍 Conclusion
L'approche Nullable Values offre une solution simple et performante pour les cas basiques de gestion d'erreurs. Son principal avantage réside dans sa simplicité et son support natif par TypeScript. Cependant, elle montre rapidement ses limites dans des applications complexes, notamment en termes de maintenabilité et d'évolutivité. Elle est particulièrement adaptée aux petits projets et aux prototypes, mais devrait être évitée pour des applications critiques ou nécessitant une gestion d'erreurs sophistiquée.


### 5. Callbacks (style Node.js)

Le style callback de Node.js est une approche traditionnelle où le premier paramètre du callback est réservé pour les erreurs (error-first callbacks). Bien que moins utilisée avec les Promises modernes, cette approche reste importante pour la maintenance de code legacy et l'intégration avec des bibliothèques anciennes.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour les callbacks
type ErrorCallback = (error: Error) => void;
type SuccessCallback<T> = (result: T) => void;
type NodeCallback<T> = (error: Error | null, result?: T) => void;

// Exemple simple de fonction avec callback
function readFileCallback(
  path: string,
  callback: NodeCallback<string>
): void {
  fs.readFile(path, "utf8", (error, data) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null, data);
  });
}

// Utilisation basique
readFileCallback("config.json", (error, data) => {
  if (error) {
    console.error("Erreur de lecture:", error);
    return;
  }
  console.log("Données:", data);
});
```

#### 🔄 Implémentation avancée avec types personnalisés

```typescript
// Types avancés pour la gestion d'erreurs
interface BaseError {
  code: string;
  message: string;
  timestamp: Date;
}

interface ValidationError extends BaseError {
  field: string;
  value: unknown;
}

interface NetworkError extends BaseError {
  status: number;
  retryable: boolean;
}

// Types pour les callbacks typés
type TypedCallback<T, E extends BaseError = Error> = (
  error: E | null,
  result?: T
) => void;

// Classe utilitaire pour les opérations asynchrones
class AsyncOperation<T, E extends BaseError = Error> {
  constructor(
    private readonly operation: (
      callback: TypedCallback<T, E>
    ) => void
  ) {}

  execute(callback: TypedCallback<T, E>): void {
    this.operation(callback);
  }

  // Conversion en Promise
  toPromise(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.operation((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result!);
      });
    });
  }

  // Chaînage d'opérations
  map<U>(fn: (value: T) => U): AsyncOperation<U, E> {
    return new AsyncOperation((callback) => {
      this.operation((error, result) => {
        if (error) {
          callback(error);
          return;
        }
        try {
          const mapped = fn(result!);
          callback(null, mapped);
        } catch (err) {
          callback(err as E);
        }
      });
    });
  }

  // Gestion des erreurs
  catch(handler: (error: E) => T): AsyncOperation<T, E> {
    return new AsyncOperation((callback) => {
      this.operation((error, result) => {
        if (error) {
          try {
            const recovered = handler(error);
            callback(null, recovered);
          } catch (err) {
            callback(err as E);
          }
          return;
        }
        callback(null, result);
      });
    });
  }
}

// Exemple d'utilisation avancée
class UserService {
  private validateUser(
    data: unknown,
    callback: TypedCallback<User, ValidationError>
  ): void {
    const errors: ValidationError[] = [];

    if (!data || typeof data !== "object") {
      callback({
        code: "INVALID_INPUT",
        message: "Données invalides",
        timestamp: new Date(),
        field: "data",
        value: data
      });
      return;
    }

    // Validation complexe...
    callback(null, data as User);
  }

  private saveUser(
    user: User,
    callback: TypedCallback<User, NetworkError>
  ): void {
    fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(user)
    })
      .then(response => {
        if (!response.ok) {
          callback({
            code: "API_ERROR",
            message: "Erreur lors de la sauvegarde",
            timestamp: new Date(),
            status: response.status,
            retryable: response.status >= 500
          });
          return;
        }
        return response.json();
      })
      .then(savedUser => callback(null, savedUser))
      .catch(error => {
        callback({
          code: "NETWORK_ERROR",
          message: error.message,
          timestamp: new Date(),
          status: 0,
          retryable: true
        });
      });
  }

  // Utilisation combinée
  createUser(
    data: unknown,
    callback: TypedCallback<User, ValidationError | NetworkError>
  ): void {
    this.validateUser(data, (validationError, validUser) => {
      if (validationError) {
        callback(validationError);
        return;
      }

      this.saveUser(validUser!, (networkError, savedUser) => {
        if (networkError) {
          callback(networkError);
          return;
        }
        callback(null, savedUser);
      });
    });
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Maintenance de code Node.js legacy
- Intégration avec des bibliothèques basées sur les callbacks
- Migration progressive vers les Promises
- APIs avec opérations asynchrones simples
- Systèmes événementiels

#### ✅ Avantages détaillés
1. **Convention établie** (🟢 Bonne)
   - Pattern reconnu dans Node.js
   - Documentation abondante
   - Communauté expérimentée
   - Intégration facile

2. **Séparation des cas** (🟢 Bonne)
   - Gestion explicite des erreurs
   - Distinction claire succès/échec
   - Logging facilité
   - Débogage simplifié

3. **Flexibilité** (🟡 Moyenne)
   - Conversion vers Promises possible
   - Adaptation aux besoins spécifiques
   - Extensibilité
   - Personnalisation des types

#### ❌ Inconvénients détaillés
1. **Callback Hell** (🔴 Problématique)
   - Imbrication excessive
   - Code difficile à suivre
   - Maintenance complexe
   - Debug laborieux

2. **Verbosité** (🔴 Élevée)
   - Beaucoup de boilerplate
   - Répétition des patterns
   - Gestion d'erreurs verbeuse
   - Types complexes

3. **Gestion d'état** (🔴 Difficile)
   - État distribué
   - Synchronisation complexe
   - Fuites mémoire possibles
   - Race conditions

#### 🛠️ Bonnes pratiques
1. **Typage strict des callbacks**
```typescript
// Types génériques pour les callbacks
type AsyncCallback<T, E = Error> = (error: E | null, result?: T) => void;
type ErrorHandler<E = Error> = (error: E) => void;
type SuccessHandler<T> = (result: T) => void;

// Utilisation avec types spécifiques
interface DatabaseError extends Error {
  code: string;
  sqlState?: string;
}

function query<T>(
  sql: string,
  callback: AsyncCallback<T, DatabaseError>
): void {
  // Implémentation...
}
```

2. **Utilitaires de composition**
```typescript
// Composition de callbacks
class CallbackChain<T, E = Error> {
  constructor(
    private readonly operations: Array<
      (callback: AsyncCallback<T, E>) => void
    > = []
  ) {}

  add<U>(
    operation: (input: T, callback: AsyncCallback<U, E>) => void
  ): CallbackChain<U, E> {
    return new CallbackChain([
      ...this.operations,
      (callback) => {
        if (this.operations.length === 0) {
          operation(undefined as T, callback);
          return;
        }

        this.operations[this.operations.length - 1](
          (error, result) => {
            if (error) {
              callback(error);
              return;
            }
            operation(result!, callback);
          }
        );
      }
    ]);
  }

  execute(callback: AsyncCallback<T, E>): void {
    if (this.operations.length === 0) {
      callback(null);
      return;
    }

    this.operations[this.operations.length - 1](callback);
  }
}
```

3. **Gestion des timeouts**
```typescript
// Wrapper avec timeout
function withTimeout<T>(
  operation: (callback: AsyncCallback<T>) => void,
  timeoutMs: number
): (callback: AsyncCallback<T>) => void {
  return (callback) => {
    let completed = false;
    const timer = setTimeout(() => {
      if (!completed) {
        completed = true;
        callback(new Error(`Operation timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    operation((error, result) => {
      if (!completed) {
        completed = true;
        clearTimeout(timer);
        callback(error, result);
      }
    });
  };
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🔴 Faible
  - Code imbriqué
  - Flux difficile à suivre
  - Logique dispersée
  - Intention masquée

- **Sécurité du typage**: 🟡 Moyenne
  - Types possibles
  - Vérifications manuelles
  - Inférence limitée
  - Erreurs potentielles

- **Verbosité**: 🔴 Élevée
  - Callbacks répétitifs
  - Gestion d'erreurs verbeuse
  - Boilerplate important
  - Types complexes

- **Performance**: 🟡 Moyenne
  - Overhead des callbacks
  - Pile d'appels profonde
  - Consommation mémoire
  - GC impact

- **Maintenabilité**: 🔴 Faible
  - Code fragile
  - Modifications risquées
  - Tests complexes
  - Documentation nécessaire

- **Testabilité**: 🔴 Difficile
  - Mocking complexe
  - Asynchronicité
  - Couverture difficile
  - Setup complexe

- **Complexité d'implémentation**: 🟡 Moyenne
  - Pattern simple
  - Gestion d'erreurs complexe
  - Types nécessaires
  - Composition difficile

#### 🔍 Conclusion
Le style callback de Node.js, bien qu'historiquement important et encore présent dans de nombreuses bibliothèques, présente des limitations significatives en termes de maintenabilité et de lisibilité. Son utilisation devrait être limitée à la maintenance de code legacy ou à l'intégration avec des bibliothèques anciennes. Pour les nouveaux développements, il est fortement recommandé d'utiliser des approches plus modernes comme les Promises ou async/await, qui offrent une meilleure expérience de développement et une maintenance plus aisée.


### 6. Décorateurs TypeScript

Les décorateurs TypeScript offrent une approche élégante et déclarative pour la gestion des erreurs, particulièrement adaptée aux applications orientées aspect (AOP) et aux frameworks modernes comme Angular ou NestJS. Cette approche permet une séparation claire des préoccupations entre la logique métier et la gestion des erreurs.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour les décorateurs
type ErrorHandler = (error: Error, context: unknown) => void;
type MethodDecorator = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => PropertyDescriptor;

// Décorateur simple de gestion d'erreurs
function HandleError(handler?: ErrorHandler): MethodDecorator {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (handler) {
          handler(error as Error, {
            class: target.constructor.name,
            method: propertyKey,
            arguments: args
          });
        }
        throw error;
      }
    };

    return descriptor;
  };
}

// Exemple d'utilisation simple
class UserService {
  @HandleError((error, context) => {
    console.error(`Erreur dans ${context.method}:`, error);
  })
  async getUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`User not found: ${id}`);
    }
    return response.json();
  }
}
```

#### 🔄 Implémentation avancée avec configuration

```typescript
// Types avancés pour la configuration des décorateurs
interface ErrorHandlerConfig {
  rethrow?: boolean;
  logLevel?: "error" | "warn" | "info";
  retry?: {
    attempts: number;
    delay: number;
  };
  transform?: (error: Error) => Error;
}

// Types d'erreurs personnalisés
class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "DomainError";
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

// Décorateur avancé avec configuration
function HandleError(config: ErrorHandlerConfig = {}): MethodDecorator {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      let attempts = 0;
      const maxAttempts = config.retry?.attempts ?? 1;

      while (attempts < maxAttempts) {
        try {
          const result = await originalMethod.apply(this, args);
          return result;
        } catch (error) {
          attempts++;
          const transformedError = config.transform
            ? config.transform(error as Error)
            : error;

          // Logging selon le niveau configuré
          const logMethod = console[config.logLevel ?? "error"];
          logMethod?.call(console, `[${target.constructor.name}.${propertyKey}]`, {
            error: transformedError,
            attempt: attempts,
            arguments: args
          });

          // Gestion des retries
          if (attempts < maxAttempts && config.retry) {
            await new Promise(resolve => 
              setTimeout(resolve, config.retry.delay)
            );
            continue;
          }

          // Propagation de l'erreur si configuré
          if (config.rethrow !== false) {
            throw transformedError;
          }
        }
      }
    };

    return descriptor;
  };
}

// Exemple d'utilisation avancée
class UserService {
  @HandleError({
    rethrow: true,
    logLevel: "error",
    retry: {
      attempts: 3,
      delay: 1000
    },
    transform: (error: Error) => {
      if (error instanceof TypeError) {
        return new DomainError(
          "Erreur réseau",
          "NETWORK_ERROR",
          { originalError: error.message }
        );
      }
      return error;
    }
  })
  async createUser(userData: UserInput): Promise<User> {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  @HandleError({
    logLevel: "warn",
    transform: (error: Error) => {
      return new DomainError(
        "Erreur de validation",
        "VALIDATION_ERROR",
        { originalError: error.message }
      );
    }
  })
  validateUser(user: unknown): User {
    // Logique de validation...
    return user as User;
  }
}

// Décorateur pour la validation des paramètres
function ValidateParams(schema: any): MethodDecorator {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
      const validationResult = schema.validate(args[0]);
      if (validationResult.error) {
        throw new DomainError(
          "Validation des paramètres échouée",
          "INVALID_PARAMS",
          { details: validationResult.error }
        );
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
```

#### 🎯 Cas d'utilisation idéaux
- Applications Angular ou NestJS
- Architecture orientée aspect (AOP)
- Gestion centralisée des erreurs
- Logging et monitoring transversal
- Validation des paramètres de méthodes

#### ✅ Avantages détaillés
1. **Séparation des préoccupations** (🟢 Excellente)
   - Logique d'erreur isolée
   - Code métier plus propre
   - Réutilisation facilitée
   - Configuration déclarative

2. **Maintenabilité** (🟢 Bonne)
   - Gestion centralisée
   - Configuration flexible
   - Code DRY
   - Documentation claire

3. **Extensibilité** (🟢 Excellente)
   - Facile à personnaliser
   - Composition possible
   - Paramétrage flexible
   - Évolution simple

#### ❌ Inconvénients détaillés
1. **Configuration nécessaire** (🔴 Complexe)
   - Setup TypeScript requis
   - Metadata reflection API
   - Compilation spécifique
   - Documentation importante

2. **Complexité cachée** (🔴 Élevée)
   - Logique d'erreur moins visible
   - Debug plus complexe
   - Stack traces modifiées
   - Effets de bord possibles

3. **Support expérimental** (🟡 Moyen)
   - Évolution des standards
   - Compatibilité à surveiller
   - Breaking changes possibles
   - Documentation limitée

#### 🛠️ Bonnes pratiques
1. **Configuration TypeScript**
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "target": "ES2022",
    "module": "ESNext"
  }
}

// Décorateur avec metadata
import "reflect-metadata";

function ValidateType(type: any): MethodDecorator {
  return function(target, propertyKey, descriptor) {
    const paramTypes = Reflect.getMetadata(
      "design:paramtypes",
      target,
      propertyKey
    );
    // Validation du type...
  };
}
```

2. **Composition de décorateurs**
```typescript
// Décorateurs composables
function Retry(config: RetryConfig): MethodDecorator {
  return function(target, propertyKey, descriptor) {
    // Logique de retry...
  };
}

function Log(level: LogLevel): MethodDecorator {
  return function(target, propertyKey, descriptor) {
    // Logique de logging...
  };
}

// Utilisation composée
class UserService {
  @HandleError()
  @Retry({ attempts: 3, delay: 1000 })
  @Log("error")
  async createUser(userData: UserInput): Promise<User> {
    // Implémentation...
  }
}
```

3. **Gestion du contexte**
```typescript
// Décorateur avec contexte
function WithContext(context: string): MethodDecorator {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const contextData = {
        timestamp: new Date(),
        context,
        method: propertyKey,
        args
      };
      
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        error.context = contextData;
        throw error;
      }
    };
    return descriptor;
  };
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Excellente
  - Syntaxe déclarative
  - Intentions claires
  - Configuration lisible
  - Code métier propre

- **Sécurité du typage**: 🟢 Bonne
  - Support TypeScript
  - Metadata reflection
  - Validation possible
  - Types personnalisés

- **Verbosité**: 🟡 Moyenne
  - Configuration nécessaire
  - Décorateurs multiples
  - Setup initial
  - Documentation requise

- **Performance**: 🟡 Moyenne
  - Overhead des décorateurs
  - Reflection API
  - Proxies
  - Stack traces modifiées

- **Maintenabilité**: 🟢 Bonne
  - Centralisation
  - Configuration flexible
  - Réutilisation
  - Documentation claire

- **Testabilité**: 🟢 Facile
  - Isolation possible
  - Mocking simple
  - Configuration testable
  - Couverture claire

- **Complexité d'implémentation**: 🔴 Complexe
  - Setup élaboré
  - Concepts avancés
  - Configuration TypeScript
  - Metadata handling

#### 🔍 Conclusion
Les décorateurs TypeScript offrent une approche élégante et puissante pour la gestion des erreurs, particulièrement adaptée aux applications modernes et aux architectures orientées aspect. Bien que nécessitant un setup initial conséquent et une bonne compréhension des concepts avancés, ils permettent une séparation claire des préoccupations et une maintenance facilitée. Leur utilisation est recommandée pour les projets de taille moyenne à grande, particulièrement dans le contexte de frameworks comme Angular ou NestJS.


### 7. DI Error Handler

L'approche DI (Dependency Injection) Error Handler utilise l'injection de dépendances pour centraliser et standardiser la gestion des erreurs à travers l'application. Cette approche est particulièrement adaptée aux applications enterprise utilisant des frameworks modernes comme Angular ou NestJS.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Interface de base pour le gestionnaire d'erreurs
interface ErrorHandler {
  handleError(error: Error, context?: unknown): void;
  handleErrorWithContext<T extends object>(error: Error, context: T): void;
}

// Implémentation basique du gestionnaire d'erreurs
@Injectable()
class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService
  ) {}

  handleError(error: Error, context?: unknown): void {
    this.logger.error("Une erreur est survenue", { error, context });
    this.metrics.incrementErrorCount(error.constructor.name);
  }

  handleErrorWithContext<T extends object>(error: Error, context: T): void {
    this.handleError(error, {
      ...context,
      timestamp: new Date(),
      errorType: error.constructor.name
    });
  }
}

// Exemple d'utilisation simple
@Injectable()
class UserService {
  constructor(private readonly errorHandler: ErrorHandler) {}

  async getUser(id: string): Promise<User> {
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        throw new Error(`User not found: ${id}`);
      }
      return response.json();
    } catch (error) {
      this.errorHandler.handleError(error as Error, { userId: id });
      throw error;
    }
  }
}
```

#### 🔄 Implémentation avancée avec stratégies

```typescript
// Types d'erreurs spécifiques
interface ErrorContext {
  timestamp: Date;
  source: string;
  operation: string;
  metadata?: Record<string, unknown>;
}

interface ErrorStrategy {
  canHandle(error: Error): boolean;
  handle(error: Error, context: ErrorContext): void;
}

// Stratégies spécifiques
@Injectable()
class ValidationErrorStrategy implements ErrorStrategy {
  constructor(private readonly logger: LoggerService) {}

  canHandle(error: Error): boolean {
    return error instanceof ValidationError;
  }

  handle(error: ValidationError, context: ErrorContext): void {
    this.logger.warn("Erreur de validation", {
      fields: error.fields,
      context
    });
  }
}

@Injectable()
class NetworkErrorStrategy implements ErrorStrategy {
  constructor(
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService,
    private readonly notifier: NotificationService
  ) {}

  canHandle(error: Error): boolean {
    return error instanceof NetworkError;
  }

  handle(error: NetworkError, context: ErrorContext): void {
    this.logger.error("Erreur réseau", {
      status: error.status,
      context
    });
    this.metrics.incrementNetworkErrors();
    this.notifier.notify("ops", "Erreur réseau détectée");
  }
}

// Gestionnaire d'erreurs avancé
@Injectable()
class AdvancedErrorHandler implements ErrorHandler {
  constructor(
    private readonly strategies: ErrorStrategy[],
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService
  ) {}

  handleError(error: Error, context?: unknown): void {
    const errorContext: ErrorContext = {
      timestamp: new Date(),
      source: "unknown",
      operation: "unknown",
      metadata: context as Record<string, unknown>
    };

    this.handleErrorWithContext(error, errorContext);
  }

  handleErrorWithContext<T extends ErrorContext>(error: Error, context: T): void {
    const strategy = this.strategies.find(s => s.canHandle(error));
    
    if (strategy) {
      strategy.handle(error, context);
    } else {
      this.handleUnknownError(error, context);
    }

    this.metrics.recordError({
      type: error.constructor.name,
      context
    });
  }

  private handleUnknownError(error: Error, context: ErrorContext): void {
    this.logger.error("Erreur non gérée", { error, context });
  }
}

// Configuration du module
@Module({
  providers: [
    {
      provide: ErrorHandler,
      useClass: AdvancedErrorHandler
    },
    ValidationErrorStrategy,
    NetworkErrorStrategy,
    LoggerService,
    MetricsService,
    NotificationService
  ]
})
class ErrorHandlingModule {}

// Exemple d'utilisation avancée
@Injectable()
class UserService {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly validator: ValidationService
  ) {}

  @Transactional()
  async createUser(userData: unknown): Promise<User> {
    try {
      // Validation
      const validationResult = this.validator.validate(userData);
      if (!validationResult.isValid) {
        throw new ValidationError("Données utilisateur invalides", validationResult.errors);
      }

      // Appel API
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new NetworkError(
          "Erreur lors de la création de l'utilisateur",
          response.status
        );
      }

      return response.json();
    } catch (error) {
      this.errorHandler.handleErrorWithContext(error as Error, {
        timestamp: new Date(),
        source: "UserService",
        operation: "createUser",
        metadata: { userData }
      });
      throw error;
    }
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Applications enterprise
- Architectures microservices
- Systèmes avec monitoring avancé
- Applications avec besoins de traçabilité
- Systèmes avec multiples sources d'erreurs

#### ✅ Avantages détaillés
1. **Centralisation** (🟢 Excellente)
   - Gestion unifiée des erreurs
   - Configuration centralisée
   - Monitoring simplifié
   - Maintenance facilitée

2. **Flexibilité** (🟢 Excellente)
   - Stratégies personnalisables
   - Extension facile
   - Configuration par environnement
   - Adaptation aux besoins

3. **Séparation des responsabilités** (🟢 Excellente)
   - Code métier plus propre
   - Logique d'erreur isolée
   - Tests simplifiés
   - Maintenance facilitée

#### ❌ Inconvénients détaillés
1. **Complexité initiale** (🔴 Élevée)
   - Setup d'infrastructure
   - Configuration DI
   - Apprentissage nécessaire
   - Documentation importante

2. **Overhead** (🟡 Moyen)
   - Performance impactée
   - Mémoire supplémentaire
   - Complexité accrue
   - Stack traces modifiées

3. **Maintenance** (🟡 Moyenne)
   - Documentation nécessaire
   - Formation équipe
   - Évolution complexe
   - Debugging indirect

#### 🛠️ Bonnes pratiques
1. **Configuration modulaire**
```typescript
// Configuration par environnement
@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggingModule,
    MetricsModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useFactory: (config: ConfigService) => {
        return config.get("NODE_ENV") === "production"
          ? new ProductionErrorHandler()
          : new DevelopmentErrorHandler();
      },
      inject: [ConfigService]
    },
    ...errorStrategies
  ]
})
export class ErrorHandlingModule {}
```

2. **Contexte riche**
```typescript
// Types pour le contexte d'erreur
interface ErrorContext {
  timestamp: Date;
  source: string;
  operation: string;
  user?: {
    id: string;
    role: string;
  };
  request?: {
    method: string;
    path: string;
    params: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

// Utilisation du contexte
@Injectable()
class ContextualErrorHandler implements ErrorHandler {
  handleErrorWithContext(error: Error, context: ErrorContext): void {
    // Enrichissement du contexte
    const enrichedContext = {
      ...context,
      environment: process.env.NODE_ENV,
      version: process.env.APP_VERSION,
      host: os.hostname()
    };

    // Traitement avec contexte complet
    this.processError(error, enrichedContext);
  }
}
```

3. **Monitoring intégré**
```typescript
// Service de monitoring
@Injectable()
class ErrorMonitoringService {
  constructor(
    private readonly metrics: MetricsService,
    private readonly logger: LoggerService,
    private readonly alerting: AlertingService
  ) {}

  trackError(error: Error, context: ErrorContext): void {
    // Métriques
    this.metrics.incrementErrorCount({
      type: error.constructor.name,
      source: context.source
    });

    // Logging structuré
    this.logger.error("Error tracked", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    });

    // Alerting si nécessaire
    if (this.shouldAlert(error)) {
      this.alerting.sendAlert({
        level: "error",
        message: `Error in ${context.source}: ${error.message}`,
        context
      });
    }
  }
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Excellente
  - Structure claire
  - Responsabilités définies
  - Configuration explicite
  - Intentions visibles

- **Sécurité du typage**: 🟢 Excellente
  - Types stricts
  - Interfaces claires
  - Erreurs typées
  - Contexte typé

- **Verbosité**: 🟡 Moyenne
  - Configuration nécessaire
  - Boilerplate DI
  - Stratégies multiples
  - Documentation requise

- **Performance**: 🟡 Moyenne
  - Overhead DI
  - Résolution dynamique
  - Proxies
  - Monitoring impact

- **Maintenabilité**: 🟢 Excellente
  - Structure modulaire
  - Configuration centralisée
  - Évolution facilitée
  - Tests unitaires simples

- **Testabilité**: 🟢 Excellente
  - Injection simple
  - Mocking facile
  - Tests isolés
  - Couverture complète

- **Complexité d'implémentation**: 🔴 Complexe
  - Setup élaboré
  - Configuration DI
  - Stratégies multiples
  - Intégration complexe

#### 🔍 Conclusion
L'approche DI Error Handler offre une solution robuste et extensible pour la gestion des erreurs dans les applications enterprise. Bien que nécessitant un investissement initial important en termes de setup et de configuration, elle apporte des bénéfices significatifs en termes de maintenabilité, de testabilité et de monitoring. Cette approche est particulièrement recommandée pour les projets de grande envergure nécessitant une gestion d'erreurs sophistiquée et centralisée.


### 8. Custom Error Classes

Les classes d'erreur personnalisées permettent de créer une hiérarchie d'erreurs riche et typée, facilitant la gestion précise des différents types d'erreurs dans l'application. Cette approche est particulièrement utile pour les applications avec un domaine métier complexe nécessitant une gestion d'erreurs détaillée.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Classe de base pour les erreurs personnalisées
abstract class BaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly timestamp: Date = new Date()
  ) {
    super(message);
    this.name = this.constructor.name;
    // Fix pour la chaîne de prototype en TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

// Erreurs spécifiques au domaine
class ValidationError extends BaseError {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>
  ) {
    super(message, "VALIDATION_ERROR");
  }

  static fromFieldErrors(errors: Record<string, string[]>): ValidationError {
    const message = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join("; ");
    return new ValidationError(message, errors);
  }
}

// Exemple d'utilisation simple
function validateUser(user: unknown): void {
  const errors: Record<string, string[]> = {};

  if (!user || typeof user !== "object") {
    throw new ValidationError("Invalid user data", {
      user: ["Must be an object"]
    });
  }

  // Validation spécifique...
}
```

#### 🔄 Implémentation avancée avec hiérarchie complète

```typescript
// Types pour les erreurs
interface ErrorMetadata {
  timestamp: Date;
  correlationId?: string;
  requestId?: string;
  userId?: string;
}

// Hiérarchie d'erreurs
abstract class DomainError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly metadata: ErrorMetadata
  ) {
    super(message, code);
  }
}

class BusinessError extends DomainError {
  constructor(
    message: string,
    code: string,
    metadata: ErrorMetadata,
    public readonly domain: string
  ) {
    super(message, `BUS_${code}`, metadata);
  }
}

class TechnicalError extends DomainError {
  constructor(
    message: string,
    code: string,
    metadata: ErrorMetadata,
    public readonly component: string
  ) {
    super(message, `TECH_${code}`, metadata);
  }
}

// Erreurs spécifiques
class UserError extends BusinessError {
  constructor(
    message: string,
    code: string,
    metadata: ErrorMetadata,
    public readonly userId?: string
  ) {
    super(message, code, metadata, "USER");
  }

  static notFound(userId: string, metadata: ErrorMetadata): UserError {
    return new UserError(
      `User ${userId} not found`,
      "NOT_FOUND",
      metadata,
      userId
    );
  }

  static invalidCredentials(metadata: ErrorMetadata): UserError {
    return new UserError(
      "Invalid credentials",
      "INVALID_CREDENTIALS",
      metadata
    );
  }
}

class DatabaseError extends TechnicalError {
  constructor(
    message: string,
    code: string,
    metadata: ErrorMetadata,
    public readonly query?: string
  ) {
    super(message, code, metadata, "DATABASE");
  }

  static connectionFailed(
    details: string,
    metadata: ErrorMetadata
  ): DatabaseError {
    return new DatabaseError(
      `Database connection failed: ${details}`,
      "CONNECTION_FAILED",
      metadata
    );
  }
}

// Service utilisant les erreurs personnalisées
class UserService {
  private readonly logger = new Logger();
  private readonly metrics = new MetricsService();

  async createUser(userData: unknown): Promise<User> {
    const metadata: ErrorMetadata = {
      timestamp: new Date(),
      correlationId: generateCorrelationId()
    };

    try {
      // Validation
      if (!this.isValidUserData(userData)) {
        throw ValidationError.fromFieldErrors({
          userData: ["Invalid user data format"]
        });
      }

      // Vérification de l'existence
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new UserError(
          "User already exists",
          "ALREADY_EXISTS",
          metadata,
          existingUser.id
        );
      }

      // Création
      try {
        return await this.userRepository.create(userData);
      } catch (error) {
        if (error instanceof DatabaseError) {
          this.logger.error("Database error during user creation", error);
          this.metrics.incrementDatabaseErrors();
          throw error;
        }
        throw new TechnicalError(
          "Failed to create user",
          "CREATE_FAILED",
          metadata,
          "USER_REPOSITORY"
        );
      }
    } catch (error) {
      if (error instanceof DomainError) {
        this.logger.error("Domain error occurred", {
          error: error.toJSON(),
          metadata
        });
        throw error;
      }
      
      // Erreur inattendue
      const unexpectedError = new TechnicalError(
        "Unexpected error during user creation",
        "UNEXPECTED",
        metadata,
        "USER_SERVICE"
      );
      this.logger.error("Unexpected error", {
        originalError: error,
        wrappedError: unexpectedError.toJSON()
      });
      throw unexpectedError;
    }
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Applications avec domaine métier complexe
- APIs avec besoins de gestion d'erreurs détaillée
- Systèmes nécessitant une traçabilité précise
- Applications avec multiples types d'erreurs
- Systèmes avec besoins de monitoring avancé

#### ✅ Avantages détaillés
1. **Typage fort** (🟢 Excellente)
   - Hiérarchie d'erreurs claire
   - Discrimination de type précise
   - Contexte riche
   - Sérialisation contrôlée

2. **Maintenabilité** (🟢 Bonne)
   - Structure claire
   - Réutilisation facilitée
   - Documentation implicite
   - Tests simplifiés

3. **Traçabilité** (🟢 Excellente)
   - Contexte détaillé
   - Stack traces enrichies
   - Logging structuré
   - Monitoring précis

#### ❌ Inconvénients détaillés
1. **Complexité** (🟡 Moyenne)
   - Hiérarchie à maintenir
   - Types à gérer
   - Documentation nécessaire
   - Formation requise

2. **Verbosité** (🟡 Moyenne)
   - Classes nombreuses
   - Constructeurs multiples
   - Métadonnées à gérer
   - Sérialisation à implémenter

3. **Performance** (🟡 Moyenne)
   - Création d'objets
   - Sérialisation/désérialisation
   - Stack traces
   - Métadonnées

#### 🛠️ Bonnes pratiques
1. **Hiérarchie claire**
```typescript
// Hiérarchie d'erreurs organisée
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly category: string;
  
  constructor(
    message: string,
    public readonly metadata: ErrorMetadata = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  get fullCode(): string {
    return `${this.category}_${this.code}`;
  }
}

class ValidationError extends AppError {
  readonly category = "VAL";
  constructor(
    message: string,
    public readonly code: string,
    public readonly fields: Record<string, string[]>
  ) {
    super(message);
  }
}

class SecurityError extends AppError {
  readonly category = "SEC";
  constructor(
    message: string,
    public readonly code: string,
    public readonly userId?: string
  ) {
    super(message);
  }
}
```

2. **Factory methods**
```typescript
// Méthodes factory pour la création d'erreurs
class ApiError extends AppError {
  readonly category = "API";

  static notFound(
    resource: string,
    id: string,
    metadata?: ErrorMetadata
  ): ApiError {
    return new ApiError(
      `${resource} with id ${id} not found`,
      "NOT_FOUND",
      metadata
    );
  }

  static unauthorized(
    reason: string,
    metadata?: ErrorMetadata
  ): ApiError {
    return new ApiError(
      `Unauthorized: ${reason}`,
      "UNAUTHORIZED",
      metadata
    );
  }

  static badRequest(
    message: string,
    metadata?: ErrorMetadata
  ): ApiError {
    return new ApiError(
      message,
      "BAD_REQUEST",
      metadata
    );
  }
}
```

3. **Error utilities**
```typescript
// Utilitaires pour la gestion des erreurs
class ErrorUtils {
  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }

  static toErrorResponse(error: Error): ErrorResponse {
    if (this.isAppError(error)) {
      return {
        code: error.fullCode,
        message: error.message,
        metadata: error.metadata,
        timestamp: new Date()
      };
    }

    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      timestamp: new Date()
    };
  }

  static enrichError<T extends AppError>(
    error: T,
    metadata: Partial<ErrorMetadata>
  ): T {
    error.metadata = {
      ...error.metadata,
      ...metadata
    };
    return error;
  }
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Bonne
  - Hiérarchie claire
  - Intentions explicites
  - Types descriptifs
  - Structure logique

- **Sécurité du typage**: 🟢 Excellente
  - Types discriminés
  - Hiérarchie typée
  - Metadata typée
  - Conversion sûre

- **Verbosité**: 🟡 Moyenne
  - Classes nécessaires
  - Constructeurs explicites
  - Metadata requise
  - Sérialisation

- **Performance**: 🟡 Moyenne
  - Objets d'erreur
  - Sérialisation JSON
  - Stack traces
  - Metadata

- **Maintenabilité**: 🟢 Bonne
  - Structure claire
  - Extension facile
  - Tests simples
  - Documentation claire

- **Testabilité**: 🟢 Bonne
  - Création simple
  - Assertions faciles
  - Mocking possible
  - Tests unitaires

- **Complexité d'implémentation**: 🟡 Moyenne
  - Hiérarchie à définir
  - Types à gérer
  - Metadata à maintenir
  - Sérialisation

#### 🔍 Conclusion
Les classes d'erreur personnalisées offrent une solution robuste et typée pour la gestion des erreurs dans les applications complexes. Bien qu'elles nécessitent un investissement initial en termes de conception et de maintenance, elles apportent une grande valeur en termes de typage, de traçabilité et de maintenabilité. Cette approche est particulièrement recommandée pour les applications avec un domaine métier riche nécessitant une gestion d'erreurs précise et détaillée.


### 9. Error Cause Chain

Le chaînage des causes d'erreurs (Error Cause Chain) est une approche qui permet de créer une trace détaillée de l'origine et de la propagation des erreurs à travers l'application. Cette fonctionnalité, introduite en ECMAScript 2022 avec le paramètre `cause` du constructeur Error, offre une meilleure traçabilité des erreurs.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Types de base pour le chaînage d'erreurs
interface ErrorCause {
  cause?: Error;
  context?: Record<string, unknown>;
}

// Classe de base avec support du chaînage
class ChainableError extends Error {
  readonly cause?: Error;
  readonly context?: Record<string, unknown>;

  constructor(message: string, options?: ErrorCause) {
    super(message);
    this.name = this.constructor.name;
    this.cause = options?.cause;
    this.context = options?.context;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  getCauseChain(): Error[] {
    const chain: Error[] = [this];
    let currentCause = this.cause;
    
    while (currentCause) {
      chain.push(currentCause);
      currentCause = (currentCause as ChainableError).cause;
    }
    
    return chain;
  }
}

// Exemple d'utilisation simple
try {
  throw new Error("Erreur de base");
} catch (error) {
  throw new ChainableError("Une erreur est survenue", {
    cause: error as Error,
    context: { operation: "exemple" }
  });
}
```

#### 🔄 Implémentation avancée avec contexte enrichi

```typescript
// Types pour le contexte d'erreur
interface ErrorContext {
  timestamp: Date;
  layer: "api" | "service" | "repository";
  operation: string;
  metadata?: Record<string, unknown>;
}

// Erreur avec contexte enrichi
class ContextualError extends ChainableError {
  constructor(
    message: string,
    public readonly context: ErrorContext,
    options?: ErrorCause
  ) {
    super(message, options);
  }

  getFullStack(): string {
    let stack = this.formatError(this);
    let currentCause = this.cause;

    while (currentCause) {
      stack += `\nCaused by: ${this.formatError(currentCause)}`;
      currentCause = (currentCause as ContextualError).cause;
    }

    return stack;
  }

  private formatError(error: Error): string {
    if (error instanceof ContextualError) {
      return `[${error.context.layer}] ${error.message} (${error.context.operation})`;
    }
    return error.message;
  }

  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      context: this.context,
      stack: this.getFullStack(),
      cause: this.cause instanceof Error ? {
        message: this.cause.message,
        name: this.cause.name
      } : undefined
    };
  }
}

// Service utilisant le chaînage d'erreurs
class UserService {
  async createUser(userData: unknown): Promise<User> {
    try {
      // Validation
      const validationResult = await this.validateUser(userData);
      if (!validationResult.success) {
        throw new ContextualError(
          "Validation échouée",
          {
            timestamp: new Date(),
            layer: "service",
            operation: "validateUser",
            metadata: { errors: validationResult.errors }
          }
        );
      }

      try {
        // Création en base de données
        const user = await this.userRepository.create(validationResult.data);
        return user;
      } catch (error) {
        throw new ContextualError(
          "Erreur lors de la création en base de données",
          {
            timestamp: new Date(),
            layer: "repository",
            operation: "createUser",
            metadata: { userData: validationResult.data }
          },
          { cause: error as Error }
        );
      }
    } catch (error) {
      // Capture et enrichissement de l'erreur
      throw new ContextualError(
        "Échec de la création d'utilisateur",
        {
          timestamp: new Date(),
          layer: "api",
          operation: "createUser",
          metadata: { originalData: userData }
        },
        { cause: error as Error }
      );
    }
  }
}

// Middleware de gestion d'erreurs
function errorHandler(error: unknown): void {
  if (error instanceof ContextualError) {
    console.error("Erreur détectée:");
    console.error(error.getFullStack());
    
    // Logging structuré
    const causes = error.getCauseChain().map(err => ({
      message: err.message,
      context: (err as ContextualError).context
    }));
    
    console.error("Chaîne de causes:", JSON.stringify(causes, null, 2));
  } else {
    console.error("Erreur inconnue:", error);
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Débogage d'erreurs complexes
- Systèmes distribués
- Logging avancé
- Analyse de cause racine
- Monitoring d'erreurs en production

#### ✅ Avantages détaillés
1. **Traçabilité complète** (🟢 Excellente)
   - Historique des erreurs
   - Contexte à chaque niveau
   - Stack traces enrichies
   - Analyse facilitée

2. **Contexte riche** (🟢 Excellente)
   - Métadonnées à chaque niveau
   - Information temporelle
   - Données structurées
   - Sérialisation JSON

3. **Standard ECMAScript** (🟢 Bon)
   - Support natif (ES2022+)
   - Interopérabilité
   - Performance optimisée
   - Maintenance simplifiée

#### ❌ Inconvénients détaillés
1. **Verbosité** (🔴 Élevée)
   - Stack traces longues
   - Données redondantes
   - Contexte verbeux
   - Sérialisation complexe

2. **Performance** (🟡 Moyenne)
   - Overhead mémoire
   - Sérialisation coûteuse
   - Stack traces longues
   - Objets complexes

3. **Compatibilité** (🟡 Moyenne)
   - Support ES2022+ requis
   - Polyfills nécessaires
   - Transpilation requise
   - Sérialisation limitée

#### 🛠️ Bonnes pratiques
1. **Gestion du contexte**
```typescript
// Helper pour enrichir le contexte
function withContext<T extends Error>(
  error: T,
  context: Partial<ErrorContext>
): ContextualError {
  return new ContextualError(
    error.message,
    {
      timestamp: new Date(),
      layer: "unknown",
      operation: "unknown",
      ...context
    },
    { cause: error }
  );
}

// Utilisation
try {
  await riskyOperation();
} catch (error) {
  throw withContext(error as Error, {
    layer: "service",
    operation: "riskyOperation"
  });
}
```

2. **Formatage personnalisé**
```typescript
// Classe avec formatage avancé
class FormattedError extends ContextualError {
  formatCause(cause: Error, level: number = 0): string {
    const indent = "  ".repeat(level);
    let result = `${indent}Caused by: ${cause.message}`;
    
    if (cause instanceof ContextualError) {
      result += ` (${cause.context.layer}:${cause.context.operation})`;
      if (cause.cause) {
        result += "\n" + this.formatCause(cause.cause, level + 1);
      }
    }
    
    return result;
  }

  getDetailedStack(): string {
    let result = `Error: ${this.message}`;
    result += `\nContext: ${JSON.stringify(this.context, null, 2)}`;
    
    if (this.cause) {
      result += "\n" + this.formatCause(this.cause);
    }
    
    return result;
  }
}
```

3. **Intégration avec le logging**
```typescript
// Service de logging avec support des causes
class ErrorLogger {
  private readonly logger: Logger;

  logError(error: unknown): void {
    if (error instanceof ContextualError) {
      this.logContextualError(error);
    } else {
      this.logger.error("Erreur non contextuelle", { error });
    }
  }

  private logContextualError(error: ContextualError): void {
    const errorChain = error.getCauseChain().map((err, index) => ({
      level: index,
      message: err.message,
      context: err instanceof ContextualError ? err.context : undefined,
      timestamp: new Date()
    }));

    this.logger.error("Erreur avec contexte", {
      error: error.toJSON(),
      chain: errorChain
    });
  }
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟢 Bonne
  - Structure claire
  - Contexte explicite
  - Chaînage visible
  - Format cohérent

- **Sécurité du typage**: 🟢 Bonne
  - Types stricts
  - Contexte typé
  - Chaînage typé
  - Conversion sûre

- **Verbosité**: 🔴 Élevée
  - Contexte détaillé
  - Stack traces longues
  - Métadonnées nombreuses
  - Sérialisation verbeuse

- **Performance**: 🟡 Moyenne
  - Overhead mémoire
  - Sérialisation JSON
  - Stack traces
  - Objets imbriqués

- **Maintenabilité**: 🟢 Bonne
  - Structure claire
  - Contexte organisé
  - Évolution simple
  - Debug facilité

- **Testabilité**: 🟢 Bonne
  - Assertions simples
  - Contexte vérifiable
  - Chaînage testable
  - Mocking facile

- **Complexité d'implémentation**: 🟡 Moyenne
  - Setup modéré
  - Contexte à gérer
  - Sérialisation
  - Compatibilité

#### 🔍 Conclusion
Le chaînage des causes d'erreurs offre une solution puissante pour la traçabilité et le débogage des erreurs dans les applications complexes. Bien que cette approche puisse être verbeuse et avoir un impact sur les performances, elle apporte une valeur significative en termes de diagnostic et de maintenance. Elle est particulièrement recommandée pour les systèmes distribués et les applications nécessitant une analyse approfondie des erreurs en production.


### 10. Codes de retour

L'approche par codes de retour est une méthode traditionnelle utilisant des valeurs numériques ou des énumérations pour signaler les différents états d'erreur. Cette approche, bien que simple, reste pertinente dans certains contextes, notamment pour les systèmes embarqués ou les interfaces avec du code natif.

#### 📝 Implémentation basique avec TypeScript 5

```typescript
// Énumération des codes d'erreur
enum StatusCode {
  SUCCESS = 0,
  NOT_FOUND = 1,
  INVALID_INPUT = 2,
  UNAUTHORIZED = 3,
  INTERNAL_ERROR = 4
}

// Type pour le résultat avec code
interface OperationResult<T> {
  code: StatusCode;
  data?: T;
  message?: string;
}

// Fonction simple retournant un code
function divide(a: number, b: number): OperationResult<number> {
  if (b === 0) {
    return {
      code: StatusCode.INVALID_INPUT,
      message: "Division par zéro impossible"
    };
  }
  return {
    code: StatusCode.SUCCESS,
    data: a / b
  };
}

// Utilisation
const result = divide(10, 2);
if (result.code === StatusCode.SUCCESS) {
  console.log("Résultat:", result.data);
} else {
  console.error("Erreur:", result.message);
}
```

#### 🔄 Implémentation avancée avec codes détaillés

```typescript
// Codes d'erreur organisés par domaine
const ErrorCodes = {
  VALIDATION: {
    REQUIRED_FIELD: "VAL_001",
    INVALID_FORMAT: "VAL_002",
    OUT_OF_RANGE: "VAL_003"
  },
  BUSINESS: {
    INSUFFICIENT_FUNDS: "BUS_001",
    ACCOUNT_LOCKED: "BUS_002",
    DUPLICATE_ENTRY: "BUS_003"
  },
  TECHNICAL: {
    DATABASE_ERROR: "TECH_001",
    NETWORK_ERROR: "TECH_002",
    TIMEOUT: "TECH_003"
  }
} as const;

// Types pour les codes d'erreur
type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes][keyof typeof ErrorCodes[keyof typeof ErrorCodes]];
type ErrorDomain = keyof typeof ErrorCodes;

// Interface pour les résultats d'opération
interface OperationResult<T, E extends ErrorCode = ErrorCode> {
  success: boolean;
  data?: T;
  error?: {
    code: E;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Classe utilitaire pour les résultats
class Result<T> {
  private constructor(
    private readonly success: boolean,
    private readonly data?: T,
    private readonly error?: {
      code: ErrorCode;
      message: string;
      details?: Record<string, unknown>;
    }
  ) {}

  static success<T>(data: T): Result<T> {
    return new Result(true, data);
  }

  static failure<T>(
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ): Result<T> {
    return new Result(false, undefined, { code, message, details });
  }

  isSuccess(): this is Result<T> & { data: T } {
    return this.success;
  }

  isFailure(): this is Result<T> & { error: NonNullable<Result<T>["error"]> } {
    return !this.success;
  }

  getOrElse(defaultValue: T): T {
    return this.success ? this.data! : defaultValue;
  }

  map<U>(fn: (value: T) => U): Result<U> {
    return this.success
      ? Result.success(fn(this.data!))
      : Result.failure(this.error!.code, this.error!.message, this.error!.details);
  }
}

// Service utilisant les codes de retour
class UserService {
  validateUser(data: unknown): Result<User> {
    if (!data || typeof data !== "object") {
      return Result.failure(
        ErrorCodes.VALIDATION.INVALID_FORMAT,
        "Format de données invalide",
        { received: typeof data }
      );
    }

    const errors: Record<string, string[]> = {};
    // Validation détaillée...

    if (Object.keys(errors).length > 0) {
      return Result.failure(
        ErrorCodes.VALIDATION.REQUIRED_FIELD,
        "Champs requis manquants",
        { errors }
      );
    }

    return Result.success(data as User);
  }

  async createUser(data: unknown): Promise<Result<User>> {
    // Validation
    const validationResult = this.validateUser(data);
    if (validationResult.isFailure()) {
      return validationResult;
    }

    try {
      // Vérification des doublons
      const existingUser = await this.findByEmail(validationResult.data.email);
      if (existingUser) {
        return Result.failure(
          ErrorCodes.BUSINESS.DUPLICATE_ENTRY,
          "Un utilisateur avec cet email existe déjà"
        );
      }

      // Création
      const user = await this.userRepository.create(validationResult.data);
      return Result.success(user);
    } catch (error) {
      return Result.failure(
        ErrorCodes.TECHNICAL.DATABASE_ERROR,
        "Erreur lors de la création de l'utilisateur",
        { error: String(error) }
      );
    }
  }

  // Middleware de gestion des erreurs
  handleOperationResult<T>(result: Result<T>): void {
    if (result.isFailure()) {
      const { code, message, details } = result.error;
      
      // Logging structuré
      console.error("Erreur d'opération:", {
        code,
        message,
        details,
        timestamp: new Date()
      });

      // Métriques
      incrementErrorCount(code);
    }
  }
}
```

#### 🎯 Cas d'utilisation idéaux
- Systèmes embarqués
- Interfaces avec code natif
- Applications avec contraintes de performance
- Systèmes legacy
- APIs avec codes d'état standardisés

#### ✅ Avantages détaillés
1. **Performance** (🟢 Excellente)
   - Overhead minimal
   - Pas d'allocation d'objets
   - Stack traces simples
   - Consommation mémoire minimale

2. **Simplicité** (🟢 Bonne)
   - Concept facile à comprendre
   - Implémentation directe
   - Pas de dépendances
   - Documentation simple

3. **Portabilité** (🟢 Excellente)
   - Compatible avec tous les langages
   - Sérialisation simple
   - Interopérabilité
   - Standard universel

#### ❌ Inconvénients détaillés
1. **Contexte limité** (🔴 Faible)
   - Pas d'information détaillée
   - Pas de stack trace
   - Débogage difficile
   - Perte de contexte

2. **Maintenance** (🔴 Faible)
   - Codes à maintenir
   - Documentation nécessaire
   - Risque d'incohérence
   - Évolution complexe

3. **Type-safety** (🟡 Moyenne)
   - Vérification limitée
   - Codes magiques possibles
   - Erreurs silencieuses
   - Typage complexe

#### 🛠️ Bonnes pratiques
1. **Organisation des codes**
```typescript
// Constantes pour les codes d'erreur
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const;

// Mapping des codes internes vers HTTP
const ERROR_TO_HTTP: Record<ErrorCode, number> = {
  [ErrorCodes.VALIDATION.REQUIRED_FIELD]: HTTP_STATUS.BAD_REQUEST,
  [ErrorCodes.BUSINESS.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
  [ErrorCodes.TECHNICAL.DATABASE_ERROR]: HTTP_STATUS.INTERNAL_ERROR
};

// Utilitaire de conversion
function toHttpStatus(code: ErrorCode): number {
  return ERROR_TO_HTTP[code] ?? HTTP_STATUS.INTERNAL_ERROR;
}
```

2. **Utilitaires de manipulation**
```typescript
// Helper pour la manipulation des résultats
class ResultUtils {
  static combine<T>(results: Result<T>[]): Result<T[]> {
    const failures = results.filter(r => r.isFailure());
    if (failures.length > 0) {
      return Result.failure(
        ErrorCodes.VALIDATION.INVALID_FORMAT,
        "Erreurs multiples détectées",
        {
          errors: failures.map(f => f.error)
        }
      );
    }
    return Result.success(results.map(r => r.data!));
  }

  static async parallel<T>(
    operations: Promise<Result<T>>[]
  ): Promise<Result<T[]>> {
    try {
      const results = await Promise.all(operations);
      return this.combine(results);
    } catch (error) {
      return Result.failure(
        ErrorCodes.TECHNICAL.NETWORK_ERROR,
        "Erreur lors des opérations parallèles",
        { error: String(error) }
      );
    }
  }
}
```

3. **Gestion des erreurs HTTP**
```typescript
// Middleware Express pour la gestion des erreurs
function errorMiddleware(
  result: Result<unknown>,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (result.isFailure()) {
    const { code, message, details } = result.error;
    const status = toHttpStatus(code);

    // Logging
    console.error("Erreur API:", {
      code,
      status,
      message,
      details,
      path: req.path,
      method: req.method
    });

    // Réponse
    res.status(status).json({
      error: {
        code,
        message,
        details: process.env.NODE_ENV === "production" ? undefined : details
      }
    });
    return;
  }
  next();
}
```

#### 📊 Métriques de qualité détaillées
- **Lisibilité**: 🟡 Moyenne
  - Codes numériques
  - Intention masquée
  - Documentation nécessaire
  - Structure simple

- **Sécurité du typage**: 🟡 Moyenne
  - Énumérations possibles
  - Vérification limitée
  - Codes magiques
  - Type unions

- **Verbosité**: 🟢 Faible
  - Codes concis
  - Structure simple
  - Peu de boilerplate
  - Documentation requise

- **Performance**: 🟢 Excellente
  - Overhead minimal
  - Pas d'objets
  - Stack simple
  - Mémoire optimale

- **Maintenabilité**: 🔴 Faible
  - Codes à gérer
  - Documentation cruciale
  - Évolution difficile
  - Tests complexes

- **Testabilité**: 🟡 Moyenne
  - Tests simples
  - Couverture facile
  - Cas limites nombreux
  - Mocking simple

- **Complexité d'implémentation**: 🟢 Simple
  - Concept basique
  - Setup minimal
  - Peu d'abstraction
  - Documentation nécessaire

#### 🔍 Conclusion
L'approche par codes de retour, bien que limitée en termes de contexte et de maintenabilité, reste une solution viable pour des cas spécifiques nécessitant des performances optimales ou une compatibilité maximale. Elle est particulièrement adaptée aux systèmes embarqués, aux interfaces avec du code natif et aux applications avec des contraintes de performance strictes. Cependant, pour des applications modernes nécessitant une gestion d'erreurs riche et contextuelle, d'autres approches comme Either ou les classes d'erreur personnalisées sont généralement plus appropriées.