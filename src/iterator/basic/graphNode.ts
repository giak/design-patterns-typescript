interface GraphNodeInterface {
  id: string;
  connections: GraphNodeInterface[];
}

class GraphIterator implements Iterator<GraphNodeInterface> {
  private visited = new Set<string>();
  private stack: GraphNodeInterface[] = [];

  constructor(private startNode: GraphNodeInterface) {
    this.stack.push(startNode);
  }

  next(): IteratorResult<GraphNodeInterface> {
    while (this.stack.length > 0) {
      const node = this.stack.pop();
      if (node && !this.visited.has(node.id)) {
        this.visited.add(node.id);
        this.stack.push(...node.connections);
        return { done: false, value: node };
      }
    }
    return { done: true, value: undefined };
  }
}

class Graph implements Iterable<GraphNodeInterface> {
  constructor(private startNode: GraphNodeInterface) {}

  [Symbol.iterator](): Iterator<GraphNodeInterface> {
    return new GraphIterator(this.startNode);
  }
}

// Utilisation
const nodeA: GraphNodeInterface = { id: 'A', connections: [] };
const nodeB: GraphNodeInterface = { id: 'B', connections: [] };
const nodeC: GraphNodeInterface = { id: 'C', connections: [] };

nodeA.connections = [nodeB, nodeC];
nodeB.connections = [nodeC];

const graph = new Graph(nodeA);

for (const node of graph) {
  console.log(`Visiting node: ${node.id}`);
}
