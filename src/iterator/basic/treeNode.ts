interface TreeNodeInterface {
  value: string;
  children: TreeNodeInterface[];
}

class DOMTree implements Iterable<TreeNodeInterface> {
  constructor(private root: TreeNodeInterface) {}

  *[Symbol.iterator](): Iterator<TreeNodeInterface> {
    const stack: TreeNodeInterface[] = [this.root];
    while (stack.length > 0) {
      const node = stack.pop() as TreeNodeInterface;
      yield node;
      stack.push(...(node.children?.reverse() ?? []));
    }
  }
}

// Utilisation
const domTree = new DOMTree({
  value: 'html',
  children: [
    { value: 'head', children: [] },
    {
      value: 'body',
      children: [
        { value: 'div', children: [] },
        { value: 'p', children: [] },
      ],
    },
  ],
});

for (const node of domTree) {
  console.log(node.value);
}
