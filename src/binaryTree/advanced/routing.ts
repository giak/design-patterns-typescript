/**
 * Basic example of a routing tree using a binary search tree.
 * ⚠️ Beware: purpose is about using Typescript and "basic binary search tree", not about performance or efficiency.
 */

const { randomUUID } = require("node:crypto");

/**
 * Interface representing routing information.
 * @interface
 */
interface RouteInfo {
  /** The next hop IP address. */
  nextHop: string;
  /** The metric for the route. */
  metric: number;
  /** The interface name. */
  interface: string;
}

/**
 * Class representing a node in the routing tree.
 */
class RouteNode {
  /** Unique identifier for the route node. */
  id: string;
  /** IP prefix for the route. */
  ipPrefix: string;
  /** Routing information associated with the node. */
  routeInfo: RouteInfo;
  /** Left child node. */
  left: RouteNode | null = null;
  /** Right child node. */
  right: RouteNode | null = null;

  /**
   * Creates a new RouteNode.
   * @param {string} ipPrefix - The IP prefix for the route.
   * @param {RouteInfo} routeInfo - The routing information.
   */
  constructor(ipPrefix: string, routeInfo: RouteInfo) {
    this.id = randomUUID();
    this.ipPrefix = ipPrefix;
    this.routeInfo = routeInfo;
  }
}

/**
 * Class representing an advanced routing tree.
 */
class AdvancedRoutingTree {
  /** Root node of the routing tree. */
  private root: RouteNode | null = null;

  /**
   * Inserts a new route into the tree.
   * @param {string} ipPrefix - The IP prefix for the route.
   * @param {RouteInfo} routeInfo - The routing information.
   */
  insert(ipPrefix: string, routeInfo: RouteInfo): void {
    const newNode = new RouteNode(ipPrefix, routeInfo);
    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (this.compareIP(ipPrefix, current.ipPrefix) < 0) {
        if (current.left === null) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }

  /**
   * Searches for a route by IP address.
   * @param {string} ip - The IP address to search for.
   * @returns {RouteInfo | null} The routing information if found, otherwise null.
   */
  search(ip: string): RouteInfo | null {
    let current = this.root;
    let bestMatch: RouteNode | null = null;

    while (current !== null) {
      if (this.isIPInPrefix(ip, current.ipPrefix)) {
        bestMatch = current;
        if (this.compareIP(ip, current.ipPrefix) < 0) {
          current = current.left;
        } else {
          current = current.right;
        }
      } else if (this.compareIP(ip, current.ipPrefix) < 0) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return bestMatch ? bestMatch.routeInfo : null;
  }

  /**
   * Deletes a route from the tree.
   * @param {string} ipPrefix - The IP prefix of the route to delete.
   * @returns {boolean} True if the route was deleted, otherwise false.
   */
  delete(ipPrefix: string): boolean {
    let current = this.root;
    let parent: RouteNode | null = null;
    let isLeftChild = false;

    // Find the node to delete
    while (current !== null && current.ipPrefix !== ipPrefix) {
      parent = current;
      if (this.compareIP(ipPrefix, current.ipPrefix) < 0) {
        isLeftChild = true;
        current = current.left;
      } else {
        isLeftChild = false;
        current = current.right;
      }
    }

    if (current === null) return false; // Node not found

    // Case 1: Leaf node
    if (current.left === null && current.right === null) {
      if (current === this.root) {
        this.root = null;
      } else if (isLeftChild) {
        parent!.left = null;
      } else {
        parent!.right = null;
      }
    }
    // Case 2: Node with one child
    else if (current.right === null) {
      if (current === this.root) {
        this.root = current.left;
      } else if (isLeftChild) {
        parent!.left = current.left;
      } else {
        parent!.right = current.left;
      }
    } else if (current.left === null) {
      if (current === this.root) {
        this.root = current.right;
      } else if (isLeftChild) {
        parent!.left = current.right;
      } else {
        parent!.right = current.right;
      }
    }
    // Case 3: Node with two children
    else {
      const successor = this.getSuccessor(current);
      if (current === this.root) {
        this.root = successor;
      } else if (isLeftChild) {
        parent!.left = successor;
      } else {
        parent!.right = successor;
      }
      successor.left = current.left;
    }

    return true;
  }

  /**
   * Gets the successor of a node.
   * @param {RouteNode} deleteNode - The node to find the successor for.
   * @returns {RouteNode} The successor node.
   */
  private getSuccessor(deleteNode: RouteNode): RouteNode {
    let successorParent = deleteNode;
    let successor = deleteNode;
    let current = deleteNode.right;

    while (current !== null) {
      successorParent = successor;
      successor = current;
      current = current.left;
    }

    if (successor !== deleteNode.right) {
      successorParent.left = successor.right;
      successor.right = deleteNode.right;
    }

    return successor;
  }

  /**
   * Compares two IP addresses.
   * @param {string} ip1 - The first IP address.
   * @param {string} ip2 - The second IP address.
   * @returns {number} Negative if ip1 < ip2, positive if ip1 > ip2, zero if equal.
   */
  private compareIP(ip1: string, ip2: string): number {
    const parts1 = ip1.split(".").map(Number);
    const parts2 = ip2.split(".").map(Number);

    for (let i = 0; i < 4; i++) {
      if (parts1[i] < parts2[i]) return -1;
      if (parts1[i] > parts2[i]) return 1;
    }

    return 0;
  }

  /**
   * Checks if an IP address is within a given prefix.
   * @param {string} ip - The IP address to check.
   * @param {string} prefix - The prefix to check against.
   * @returns {boolean} True if the IP is in the prefix, otherwise false.
   */
  private isIPInPrefix(ip: string, prefix: string): boolean {
    const [prefixIP, prefixLength] = prefix.split("/");
    const ipBinary = this.ipToBinary(ip);
    const prefixBinary = this.ipToBinary(prefixIP);

    return (
      ipBinary.slice(0, Number(prefixLength)) ===
      prefixBinary.slice(0, Number(prefixLength))
    );
  }

  /**
   * Converts an IP address to its binary representation.
   * @param {string} ip - The IP address to convert.
   * @returns {string} The binary representation of the IP address.
   */
  private ipToBinary(ip: string): string {
    return ip
      .split(".")
      .map((octet) => Number.parseInt(octet).toString(2).padStart(8, "0"))
      .join("");
  }

  /**
   * Performs an in-order traversal of the routing tree.
   */
  inOrderTraversal(): void {
    const traverse = (node: RouteNode | null) => {
      if (node !== null) {
        traverse(node.left);
        console.log(`${node.ipPrefix}: ${JSON.stringify(node.routeInfo)}`);
        traverse(node.right);
      }
    };

    traverse(this.root);
  }
}

// Example usage
const routingTree = new AdvancedRoutingTree();

routingTree.insert("192.168.0.0/16", {
  nextHop: "10.0.0.1",
  metric: 10,
  interface: "eth0",
});
routingTree.insert("10.0.0.0/8", {
  nextHop: "10.0.0.2",
  metric: 5,
  interface: "eth1",
});
routingTree.insert("172.16.0.0/12", {
  nextHop: "172.16.0.1",
  metric: 15,
  interface: "eth2",
});

console.log(routingTree.search("192.168.1.100")); // { nextHop: "10.0.0.1", metric: 10, interface: "eth0" }
console.log(routingTree.search("10.1.1.1")); // { nextHop: "10.0.0.2", metric: 5, interface: "eth1" }
console.log(routingTree.search("8.8.8.8")); // null

routingTree.delete("10.0.0.0/8");
console.log(routingTree.search("10.1.1.1")); // null

console.log("Routing tree after deletion:");
routingTree.inOrderTraversal();

export type {};
