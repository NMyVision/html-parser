export default class Queue<T> extends Array<T> {
  constructor(...items: T[]) {
    super(...items);
  }

  enqueue(item: T): number {
    return super.push(item); // Push item to the end of the array
  }

  dequeue(): T | undefined {
    return this.shift(); // Using shift for clarity when removing the first item
  }

  peek(): T | undefined;
  peek(take: number): T[];
  peek(take?: number): T | T[] | undefined {
    if (take === undefined) {
      return this[0]; // Return the first element if no argument is provided
    }
    return this.slice(0, take); // Return the first 'take' elements as an array
  }

  size(): number {
    return this.length; // Return the size of the queue (length of the array)
  }

  clear(): void {
    this.length = 0; // Clear all elements in the queue
  }

  isEmpty(): boolean {
    return this.length === 0; // Check if the queue is empty
  }

  contains(item: T, fromIndex: number = 0): boolean {
    return this.includes(item, fromIndex); // Check if item exists in the queue
  }
}
