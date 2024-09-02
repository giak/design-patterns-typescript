const fs = require('node:fs');
const readline = require('node:readline');

const SEARCH_KEYWORD = 'recherche';

// Générateur qui lit un fichier ligne par ligne
/*
Ce générateur parcourt (via le yield) "paresseusement" les données volumineuses, renvoyant une ligne à la fois sans charger toutes les données en mémoire.
C'est essentiel pour gérer des fichiers ou des ensembles de données qui ne tiendraient pas en mémoire autrement.
*/
async function* readLargeFile(filePath: string): AsyncGenerator<string, void, undefined> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Number.POSITIVE_INFINITY,
  });

  for await (const line of rl) {
    yield line;
  }
}

// Utilisation du générateur pour parcourir un fichier
/*
Le traitement montre comment on peut rechercher des informations spécifiques dans les données, ligne par ligne.
*/
async function processFile(filePath: string) {
  const reader = readLargeFile(filePath);
  let count = 0;

  for await (const line of reader) {
    if (line.includes(SEARCH_KEYWORD)) {
      count++;
    }
  }

  console.log(`Nombre de lignes contenant le mot recherché: ${count}`);
}

// Utilisation de la fonction pour lire un fichier et recherche le nombre d’occurrence d'un mot:
processFile(`${__dirname}/fileReaderText.txt`);
