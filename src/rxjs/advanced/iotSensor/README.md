# IoT Sensor Data Processing with RxJS

Ce projet démontre le traitement de données de capteurs IoT en utilisant RxJS et TypeScript. Il simule des lectures de capteurs, agrège les données, et les envoie à un service cloud fictif.

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (généralement installé avec Node.js)

## Installation

1. Clonez ce dépôt sur votre machine locale :
   ```
   git clone https://github.com/votre-nom-utilisateur/iot-sensor-processing.git
   cd iot-sensor-processing
   ```

2. Installez les dépendances nécessaires :
   ```
   pnpm install rxjs typescript ts-node @types/node
   ```

## Structure du projet

Le projet est organisé comme suit :

```
src/rxjs/advanced/iotSensor/
├── config.ts
├── errors.ts
├── formatters.ts
├── iotSensorProcessing.ts
├── services.ts
├── simulators.ts
├── types.ts
└── utils.ts
```


- `iotSensorProcessing.ts`: Fichier principal orchestrant le traitement des données
- `config.ts`: Configuration des capteurs
- `errors.ts`: Définitions des erreurs personnalisées
- `formatters.ts`: Formatage des données pour l'affichage
- `services.ts`: Services IoT
- `simulators.ts`: Simulation des capteurs
- `types.ts`: Définitions des types et interfaces
- `utils.ts`: Fonctions utilitaires

## Exécution du projet

Pour exécuter le projet, utilisez la commande suivante :

```
npx ts-node src/rxjs/advanced/iotSensor/iotSensorProcessing.ts
```


Cela démarrera la simulation des capteurs et le traitement des données. Vous verrez les résultats s'afficher dans la console.

## Fonctionnalités

- Simulation de lectures de capteurs pour la température, l'humidité et la pression.
- Agrégation des données des capteurs sur des intervalles de 5 secondes.
- Formatage des données agrégées avec des emojis.
- Simulation d'envoi des données à un service cloud.
- Gestion des erreurs et des valeurs aberrantes.

## Personnalisation

Vous pouvez ajuster les paramètres de simulation dans le fichier `config.ts`. Cela vous permet de modifier les valeurs de base, le bruit, les tendances et les intervalles pour chaque type de capteur.

## Dépannage

Si vous rencontrez des problèmes lors de l'exécution du projet, assurez-vous que :

1. Vous avez bien installé toutes les dépendances avec `npm install`.
2. Vous utilisez une version récente de Node.js (14+).
3. Vous exécutez la commande depuis le répertoire racine du projet.

Si les problèmes persistent, vérifiez les messages d'erreur dans la console pour plus d'informations.

## Contribution

Les contributions à ce projet sont les bienvenues. N'hésitez pas à ouvrir une issue ou à soumettre une pull request si vous avez des suggestions d'amélioration.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.


