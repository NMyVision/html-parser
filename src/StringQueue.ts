import Queue from "./Queue.ts";

/**
 * A Special type of Queue made for parsing strings
 */
export default class StringQueue extends Queue<string> {
  #source: string[];
  #index: number;

  constructor(text?: string) {
    super(...(text ? Array.from(text) : []));
    this.#source = text ? Array.from(text) : [];
    this.#index = 0;
  }

  // @ts-ignore: we want peek to always return string, there is no way to force this via TS
  peek(take?: number): string {
    if (take === undefined) {
      return this[0]; // Return the first element if no argument is provided
    }
    return this.slice(0, take).join(""); // Return the first 'take' elements as a string
  }

  get index(): number {
    return this.#index;
  }

  any(): boolean {
    return !this.isEmpty();
  }

  run(...chars: string[]): string {
    const tx = this.join("");
    const positions = chars.map((x) => tx.indexOf(x)).filter((index) =>
      index >= 0
    );
    const r = positions.length > 0 ? Math.min(...positions) : -1;
    this.#index += r >= 0 ? r : 0;

    // short circuit out
    if (r < 0) return this.join("");

    return this.splice(0, r >= 0 ? r : 0).join("");
  }

  override dequeue(length: number = 1): string {
    let text = "";
    while (length-- > 0 && !this.isEmpty()) {
      this.#index++;
      text += super.dequeue()!;
    }
    return text;
  }

  skipSpace(): void {
    while (!this.isEmpty() && [" ", "\r", "\n"].includes(this.peek()!)) {
      this.dequeue();
    }
  }
}
