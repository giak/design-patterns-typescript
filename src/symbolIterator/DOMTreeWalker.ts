import { JSDOM } from 'jsdom';

class DOMTreeWalker implements Iterable<Element> {
  private root: Element;

  constructor(root: Element) {
    this.root = root;
  }

  [Symbol.iterator](): Iterator<Element> {
    const stack: Element[] = [this.root];
    return {
      next: (): IteratorResult<Element> => {
        if (stack.length === 0) {
          return { done: true, value: null as any };
        }
        const current = stack.pop()!;
        for (let i = current.children.length - 1; i >= 0; i--) {
          stack.push(current.children[i]);
        }
        return { done: false, value: current };
      },
    };
  }

  // Méthode pour filtrer les éléments par nom de balise
  *filterByTagName(tagName: string): IterableIterator<Element> {
    for (const element of this) {
      if (element.tagName.toLowerCase() === tagName.toLowerCase()) {
        yield element;
      }
    }
  }
}

// Fonction utilitaire pour créer un élément racine à partir d'un HTML string
function createRootElement(html: string, selector: string): Element {
  const dom = new JSDOM(html);
  const rootElement = dom.window.document.querySelector(selector);
  if (!rootElement) {
    throw new Error(`Root element not found for selector: ${selector}`);
  }
  return rootElement;
}

// Fonction d'aide pour créer un arbre DOM simple pour les tests
function createSampleDOM(): Element {
  const html = `
    <div>
      <header>
        <h1>Titre</h1>
        <nav>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </nav>
      </header>
      <main>
        <p>Paragraphe 1</p>
        <p>Paragraphe 2</p>
      </main>
      <footer>
        <p>Pied de page</p>
      </footer>
    </div>
  `;
  return createRootElement(html, 'div');
}

// Utilisation
const rootElement = createSampleDOM();
const treeWalker = new DOMTreeWalker(rootElement);

console.log("Parcours de tous les éléments :");
for (const element of treeWalker) {
  console.log(element.tagName);
}

console.log("\nRecherche de tous les paragraphes :");
for (const paragraph of treeWalker.filterByTagName("p")) {
  console.log(paragraph.textContent);
}