class PriorityQueue<T> {
  private heap: [number, T][] = [];

  enqueue(item: T, priority: number): void {
    this.heap.push([priority, item]);
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const item = this.heap[0];
    this.heap[0] = this.heap.pop() ?? item;
    this.bubbleDown(0);
    return item[1];
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (
        leftChild < length &&
        this.heap[leftChild][0] < this.heap[smallest][0]
      ) {
        smallest = leftChild;
      }
      if (
        rightChild < length &&
        this.heap[rightChild][0] < this.heap[smallest][0]
      ) {
        smallest = rightChild;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }
}

// Utilisation
const taskQueue = new PriorityQueue();
taskQueue.enqueue("Répondre aux emails", 3);
taskQueue.enqueue("Réunion d'urgence", 1);
taskQueue.enqueue("Pause café", 5);
taskQueue.enqueue("Finir le rapport", 2);

console.log(taskQueue.dequeue()); // "Réunion d'urgence"
console.log(taskQueue.dequeue()); // "Finir le rapport"
console.log(taskQueue.dequeue()); // "Répondre aux emails"
console.log(taskQueue.dequeue()); // "Pause café"

export type {};
