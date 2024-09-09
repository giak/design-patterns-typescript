class CSVParser implements Iterable<string[]> {
  private content: string;
  private delimiter: string;
  private hasHeader: boolean;

  constructor(
    content: string,
    delimiter: string = ",",
    hasHeader: boolean = true
  ) {
    this.content = content;
    this.delimiter = delimiter;
    this.hasHeader = hasHeader;
  }

  private *parseLines(): Generator<string[]> {
    const lines = this.content.split("\n");
    let startIndex = this.hasHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        yield this.parseLine(line);
      }
    }
  }

  private parseLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === this.delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current) {
      result.push(current.trim());
    }

    return result;
  }

  public getHeader(): string[] | null {
    if (!this.hasHeader) return null;
    const firstLine = this.content.split("\n")[0];
    return this.parseLine(firstLine);
  }

  [Symbol.iterator](): Iterator<string[]> {
    return this.parseLines();
  }
}

// Exemple d'utilisation
const csvContent = `"Nom","Âge","Ville"
  "Dupont, Jean",30,Paris
  "Martin, Marie",25,"New York"
  "Smith, John",40,Londres
  `;

const parser = new CSVParser(csvContent);

console.log("En-tête :", parser.getHeader());
console.log("Données :");
for (const row of parser) {
  console.log(row);
}
