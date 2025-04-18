export default class Queue<T> implements WritableStream<T>, AsyncGenerator<T, never, void> {
  readonly #promises: Promise<T>[] = [];
  readonly #resolvers: ((item: T) => void)[] = [];
  readonly #observers: ((item: T) => void)[] = [];

  #closed = false;
  #locked = false;
  readonly #stream: WritableStream<T>;

  static #__add<X>(promises: Promise<X>[], resolvers: ((item: X) => void)[]): void {
    const prom = new Promise((resolve) => {
      (window as any).handle = resolve;
      resolvers.push(resolve);
    });
    (window as any).banana = prom;
    promises.push(prom as any);
  }

  static #__enqueue<X>(closed: boolean, promises: Promise<X>[], resolvers: ((item: X) => void)[], item: X): void {
    if (!closed) {
      if (!resolvers.length) Queue.#__add(promises, resolvers);
      const resolve = resolvers.shift()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      (window as any).bull = item;
      resolve(item);
    }
  }

  constructor() {
    const closed = this.#closed;
    const promises = this.#promises;
    const resolvers = this.#resolvers;
    this.#stream = new WritableStream({
      write(item: T): void {
        Queue.#__enqueue(closed, promises, resolvers, item);
      },
    });
  }

  #add(): void {
    return Queue.#__add(this.#promises, this.#resolvers);
  }

  enqueue(item: T): void {
    const manog = Queue.#__enqueue(this.#closed, this.#promises, this.#resolvers, item);

    console.log({ item, resol: this.#resolvers, observers: this.#observers, promises: this.#promises });
    return manog;
  }

  dequeue(): Promise<T> {
    if (!this.#promises.length) this.#add();
    const item = this.#promises.shift()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    console.log(item);
    (window as any).mango = item;
    return item;
  }

  isEmpty(): boolean {
    return !this.#promises.length;
  }

  isBlocked(): boolean {
    return !!this.#resolvers.length;
  }

  get length(): number {
    return this.#promises.length - this.#resolvers.length;
  }

  async next(): Promise<IteratorResult<T, never>> {
    const done = false;
    console.log("This Next is called ");
    const value = await this.dequeue();
    console.log({ value });
    for (const observer of this.#observers) {
      observer(value);
    }
    return { done, value };
  }

  return(): Promise<IteratorResult<T, never>> {
    this.close(); // Ensure the stream is closed on return
    return Promise.resolve({ done: true, value: undefined! });
  }

  throw(err: Error): Promise<IteratorResult<T, never>> {
    return new Promise((_resolve, reject) => {
      reject(err);
    });
  }

  [Symbol.asyncIterator](): AsyncGenerator<T, never, void> {
    return this;
  }

  [Symbol.asyncDispose](): Promise<void> {
    // Cleanup resources
    this.#promises.length = 0; // Clear pending promises
    this.#resolvers.length = 0; // Clear resolvers
    this.#observers.length = 0; // Clear observers
    this.#closed = true; // Mark as closed
    return Promise.resolve();
  }

  get locked(): boolean {
    return this.#stream.locked;
  }

  abort(reason?: Error): Promise<void> {
    return this.#stream.abort(reason);
  }

  close(): Promise<void> {
    this.#closed = true; // Mark the queue as closed
    return this.#stream.close();
  }

  getWriter(): WritableStreamDefaultWriter<T> {
    return this.#stream.getWriter();
  }
}
