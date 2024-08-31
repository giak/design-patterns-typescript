import { LinkedList } from '../chained';

describe('LinkedList', () => {
  let list: LinkedList<number>;

  beforeEach(() => {
    list = new LinkedList<number>();
  });

  describe('add method', () => {
    it('should add elements to the list', () => {
      list.add(1);
      list.add(2);
      list.add(3);
      const elements = Array.from(list);
      expect(elements).toEqual([1, 2, 3]);
    });
  });

  describe('remove method', () => {
    it('should remove elements from the list', () => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.remove(2);
      const elements = Array.from(list);
      expect(elements).toEqual([1, 3]);
    });

    it('should return false when trying to remove a non-existent element', () => {
      list.add(1);
      const result = list.remove(2);
      expect(result).toBe(false);
    });
  });

  describe('find method', () => {
    it('should find an existing element', () => {
      list.add(1);
      list.add(2);
      list.add(3);
      const node = list.find(2);
      expect(node?.data).toBe(2);
    });

    it('should return null when trying to find a non-existent element', () => {
      list.add(1);
      const node = list.find(2);
      expect(node).toBeNull();
    });
  });

  describe('insertAfter method', () => {
    it('should insert an element after a specific node', () => {
      list.add(1);
      list.add(2);
      list.add(3);
      list.insertAfter(2, 2.5);
      const elements = Array.from(list);
      expect(elements).toEqual([1, 2, 2.5, 3]);
    });

    it('should return false when trying to insert after a non-existent node', () => {
      list.add(1);
      const result = list.insertAfter(2, 2.5);
      expect(result).toBe(false);
    });
  });

  describe('iterable interface', () => {
    it('should iterate over the list and verify the elements', () => {
      list.add(1);
      list.add(2);
      list.add(3);
      const elements = [];
      for (const item of list) {
        elements.push(item);
      }
      expect(elements).toEqual([1, 2, 3]);
    });
  });
});