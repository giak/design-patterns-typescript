// Interface de base pour tous les composants
interface Component {
  operation(): string;
}

// Classe Leaf (feuille) représentant un objet simple
class Leaf implements Component {
  constructor(private name: string) {}

  operation(): string {
    return `Leaf ${this.name}`;
  }
}

// Classe Composite représentant un objet composé d'autres objets
class Composite implements Component {
  private children: Component[] = [];

  constructor(private name: string) {}

  add(component: Component): void {
    this.children.push(component);
  }

  remove(component: Component): void {
    const index = this.children.indexOf(component);
    if (index !== -1) {
      this.children.splice(index, 1);
    }
  }

  operation(): string {
    const results = [
      `Branch ${this.name}`,
      ...this.children.map((child) => child.operation()),
    ];
    return results.join(", ");
  }

  // Implémentation de l'itérateur
  [Symbol.iterator](): Iterator<Component> {
    let index = 0;
    const children = this.children;

    return {
      next(): IteratorResult<Component> {
        if (index < children.length) {
          return { value: children[index++], done: false };
        } else {
          return { value: null as any, done: true };
        }
      },
    };
  }
}

// Utilisation du pattern
const tree = new Composite("Main");
const branch1 = new Composite("Branch 1");
const branch2 = new Composite("Branch 2");
const leaf1 = new Leaf("Leaf 1");
const leaf2 = new Leaf("Leaf 2");

branch1.add(leaf1);
branch2.add(leaf2);
tree.add(branch1);
tree.add(branch2);

console.log(tree.operation());

export type {};
