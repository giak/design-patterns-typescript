import { URL } from "url";

/**
 * Represents a node in the navigation history
 */
interface HistoryNodeInterface {
  url: URL; // URL du noeud
  next: HistoryNodeInterface | null; // Prochain noeud
  prev: HistoryNodeInterface | null; // Noeud précédent
}

/**
 * Factory function to create a HistoryNode
 * @param url - The URL to create a node for
 * @returns A new HistoryNode
 */
function createHistoryNode(url: string): HistoryNodeInterface {
  return {
    url: new URL(url), // Créer un nouveau noeud avec l'URL
    next: null, // Initialiser le prochain noeud
    prev: null, // Initialiser le noeud précédent
  };
}

/**
 * Represents the result of a navigation action
 */
type NavigationResultType = {
  success: boolean; // Indicateur de succès
  url: URL | null; // URL du noeud
};

/**
 * Interface pour la fonctionnalité d'historique de navigation du navigateur
 */
interface BrowserHistoryInterface {
  visit(url: string): void; // Méthode pour visiter une URL
  back(): NavigationResultType; // Méthode pour revenir en arrière
  forward(): NavigationResultType; // Méthode pour avancer
  getCurrentUrl(): URL | null;
}

/**
 * Implements the browser history functionality
 */
class BrowserHistory implements BrowserHistoryInterface {
  private current: HistoryNodeInterface | null = null; // Noeud actuel

  /**
   * Adds a new URL to the history
   * @param url - The URL to visit
   * @throws Error if the URL is invalid
   */
  public visit(url: string): void {
    try {
      const newNode = createHistoryNode(url); // Créer un nouveau noeud avec l'URL
      if (this.current) {
        newNode.prev = this.current; // Définir le noeud précédent
        this.current.next = newNode; // Définir le noeud suivant
      }
      this.current = newNode;
      console.log(`Visited: ${url}`);
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Navigates back in the history
   * @returns The result of the navigation
   */
  public back(): NavigationResultType {
    if (this.current?.prev) {
      this.current = this.current.prev; // Définir le noeud précédent
      console.log(`Navigated back to: ${this.current.url.toString()}`);
      return { success: true, url: this.current.url };
    }
    console.log("Can't go back further");
    return { success: false, url: null };
  }

  /**
   * Navigates forward in the history
   * @returns The result of the navigation
   */
  public forward(): NavigationResultType {
    if (this.current?.next) {
      this.current = this.current.next; // Définir le noeud suivant
      console.log(`Navigated forward to: ${this.current.url.toString()}`);
      return { success: true, url: this.current.url };
    }
    console.log("Can't go forward");
    return { success: false, url: null };
  }

  /**
   * Gets the current URL
   * @returns The current URL or null if history is empty
   */
  public getCurrentUrl(): URL | null {
    return this.current ? this.current.url : null; // Retourner l'URL actuelle ou null si l'historique est vide
  }
}

/**
 * Factory function to create a BrowserHistory instance
 * @returns A new BrowserHistory instance
 */
function createBrowserHistory(): BrowserHistoryInterface {
  return new BrowserHistory();
}

// Example usage
async function runExample(): Promise<void> {
  const history = createBrowserHistory();

  try {
    history.visit("https://www.example.com");
    history.visit("https://www.example.com/page1");
    history.visit("https://www.example.com/page2");

    const currentUrl = history.getCurrentUrl();
    console.log(`Current URL: ${currentUrl?.toString()}`);

    await history.back();
    await history.back();
    await history.forward();

    history.visit("https://www.example.com/page3");
    await history.forward(); // This will log "Can't go forward"
  } catch (error) {
    if (error instanceof Error) {
      console.error(`An error occurred: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
  }
}

runExample().catch((error) => {
  console.error(`Unhandled error in example: ${error.message}`);
});

export type { };

