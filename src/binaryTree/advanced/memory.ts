/**
 * MemoryBlock is a class that represents a memory block in the binary tree.
 */
class MemoryBlock {
  size: number;
  address: number;
  left: MemoryBlock | null = null;
  right: MemoryBlock | null = null;

  /**
   * Constructor for MemoryBlock.
   * @param size - The size of the memory block.
   * @param address - The address of the memory block.
   */
  constructor(size: number, address: number) {
    this.size = size;
    this.address = address;
  }
}

/**
 * MemoryAllocator is a class that manages memory allocation and deallocation using a binary tree structure.
 * It allows for efficient allocation and deallocation of memory blocks, with the ability to merge adjacent free blocks.
 */
class MemoryAllocator {
  private root: MemoryBlock | null = null;

  /**
   * Constructor for MemoryAllocator.
   * @param totalMemory - The total size of the memory to be managed.
   */
  constructor(totalMemory: number) {
    this.root = new MemoryBlock(totalMemory, 0);
  }

  /**
   * Allocates a memory block of the specified size.
   * @param size - The size of the memory block to allocate.
   * @returns The address of the allocated memory block, or null if allocation failed.
   */

  allocate(size: number): number | null {
    const allocatedBlock = this.findAndRemove(this.root, size);
    if (allocatedBlock) {
      return allocatedBlock.address;
    }
    return null;
  }

  /**
   * Frees a previously allocated memory block.
   * @param address - The address of the memory block to free.
   * @param size - The size of the memory block to free.
   */
  free(address: number, size: number): void {
    const newBlock = new MemoryBlock(size, address);
    this.insert(newBlock);
  }

  /**
   * Finds and removes a memory block of the specified size from the binary tree.
   * @param node - The current node in the binary tree.
   * @param size - The size of the memory block to find and remove.
   * @returns The memory block that was removed, or null if no block was found.
   */
  private findAndRemove(
    node: MemoryBlock | null,
    size: number
  ): MemoryBlock | null {
    if (!node) return null;

    if (size <= node.size) {
      const leftResult = this.findAndRemove(node.left, size);
      if (leftResult) {
        return leftResult;
      }

      if (size === node.size) {
        const result = node;
        this.remove(node);
        return result;
      }

      if (size < node.size) {
        const allocatedBlock = new MemoryBlock(size, node.address);
        node.size -= size;
        node.address += size;
        return allocatedBlock;
      }
    }

    return this.findAndRemove(node.right, size);
  }

  /**
   * Inserts a new memory block into the binary tree.
   * @param block - The memory block to insert.
   */
  private insert(block: MemoryBlock): void {
    if (!this.root) {
      this.root = block;
      return;
    }

    let current = this.root;
    while (true) {
      if (block.size <= current.size) {
        if (!current.left) {
          current.left = block;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = block;
          break;
        }
        current = current.right;
      }
    }

    this.mergeFreeBlocks(block);
  }

  /**
   * Removes a memory block from the binary tree.
   * @param node - The memory block to remove.
   */
  private remove(node: MemoryBlock): void {
    if (!this.root) return;

    if (node === this.root) {
      if (!this.root.left) {
        this.root = this.root.right;
      } else if (!this.root.right) {
        this.root = this.root.left;
      } else {
        const minRight = this.findMin(this.root.right);
        this.remove(minRight);
        minRight.left = this.root.left;
        minRight.right = this.root.right;
        this.root = minRight;
      }
      return;
    }

    let parent: MemoryBlock | null = null;
    let current: MemoryBlock | null = this.root;

    while (current && current !== node) {
      parent = current;
      if (node.size <= current.size) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    if (!current || !parent) return;

    if (!current.left) {
      if (parent.left === current) {
        parent.left = current.right;
      } else {
        parent.right = current.right;
      }
    } else if (!current.right) {
      if (parent.left === current) {
        parent.left = current.left;
      } else {
        parent.right = current.left;
      }
    } else {
      const minRight = this.findMin(current.right);
      this.remove(minRight);
      minRight.left = current.left;
      minRight.right = current.right;
      if (parent.left === current) {
        parent.left = minRight;
      } else {
        parent.right = minRight;
      }
    }
  }

  /**
   * Finds the leftmost node in the binary tree.
   * @param node - The current node in the binary tree.
   * @returns The leftmost node.
   */
  private findMin(node: MemoryBlock): MemoryBlock {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  /**
   * Merges adjacent free memory blocks.
   * @param block - The memory block to check for merging.
   */
  private mergeFreeBlocks(block: MemoryBlock): void {
    const adjacent = this.findAdjacent(block);
    if (adjacent) {
      this.remove(adjacent);
      this.remove(block);
      const mergedBlock = new MemoryBlock(
        block.size + adjacent.size,
        Math.min(block.address, adjacent.address)
      );
      this.insert(mergedBlock);
    }
  }

  /**
   * Finds adjacent free memory blocks.
   * @param block - The memory block to check for adjacent free blocks.
   * @returns The adjacent free memory block, or null if no adjacent block was found.
   */
  private findAdjacent(block: MemoryBlock): MemoryBlock | null {
    let current = this.root;
    while (current) {
      if (
        current.address + current.size === block.address ||
        block.address + block.size === current.address
      ) {
        return current;
      }
      if (block.address < current.address) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }

  /**
   * Prints the current state of the memory.
   */
  printMemoryState(): void {
    const printNode = (node: MemoryBlock | null, prefix: string = ""): void => {
      if (node) {
        console.log(`${prefix}[Address: ${node.address}, Size: ${node.size}]`);
        printNode(node.left, prefix + "  L: ");
        printNode(node.right, prefix + "  R: ");
      }
    };
    printNode(this.root);
  }
}

// Exemple d'utilisation
const allocator = new MemoryAllocator(1024);

console.log("État initial de la mémoire:");
allocator.printMemoryState();

const addr1 = allocator.allocate(128);
console.log(`Allocation de 128 octets à l'adresse: ${addr1}`);
allocator.printMemoryState();

const addr2 = allocator.allocate(256);
console.log(`Allocation de 256 octets à l'adresse: ${addr2}`);
allocator.printMemoryState();

allocator.free(addr1!, 128);
console.log("Libération de 128 octets:");
allocator.printMemoryState();

allocator.free(addr2!, 256);
console.log("Libération de 256 octets:");
allocator.printMemoryState();

export type {};
