export class MinHeap<T> {
  private readonly items: T[] = [];

  constructor(private readonly score: (item: T) => number) {}

  size(): number {
    return this.items.length;
  }

  push(item: T): void {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  replaceRoot(item: T): void {
    this.items[0] = item;
    this.bubbleDown(0);
  }

  peek(): T | undefined {
    return this.items[0];
  }

  toSortedDesc(): T[] {
    return [...this.items].sort((a, b) => this.score(b) - this.score(a));
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.score(this.items[parent]) <= this.score(this.items[index])) break;
      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  private bubbleDown(index: number): void {
    const length = this.items.length;
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let smallest = index;

      if (left < length && this.score(this.items[left]) < this.score(this.items[smallest])) smallest = left;
      if (right < length && this.score(this.items[right]) < this.score(this.items[smallest])) smallest = right;
      if (smallest === index) break;

      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      index = smallest;
    }
  }
}
