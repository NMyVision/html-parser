import { beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import Queue from "../src/Queue.ts";

describe("Queue Tests", () => {
  let queue: Queue<string> = new Queue();

  function hydrateQueue() {
    queue.enqueue("a1");
    queue.enqueue("b1");
    queue.enqueue("c1");
  }

  beforeEach(() => {
    queue = new Queue();
  });

  it("Proper constructor", () => {
    queue = new Queue<string>("a1", "b1", "c1");
    expect(queue).toEqual(["a1", "b1", "c1"]);
    expect(queue.size()).toEqual(3);
  });

  it("Gives right size", () => {
    expect(queue.size()).toEqual(0);
    hydrateQueue();
    expect(queue.size()).toEqual(3);
    queue.enqueue("d1");
    expect(queue.size()).toEqual(4);
    queue.dequeue();
    expect(queue.size()).toEqual(3);
    queue.clear();
    expect(queue.size()).toEqual(0);
  });

  it("Enqueues", function () {
    hydrateQueue();
    let head = queue.dequeue();
    expect(head).toEqual("a1");
    queue.dequeue();
    head = queue.dequeue();
    expect(head).toEqual("c1");
    expect(queue.isEmpty()).toEqual(true);
    head = queue.dequeue();
    expect(head).toEqual(undefined);
  });

  it("Peeks", function () {
    hydrateQueue();
    let head = queue.peek();
    expect(head).toEqual("a1");
    const head2 = queue.dequeue();
    expect(head).toEqual(head2);
    head = queue.peek();
    expect(head).toEqual("b1");
    queue.clear();
    head = queue.peek();
    expect(head).toEqual(undefined);
  });

  it("For each gives the right ordering", function () {
    queue.forEach((_) => {
      expect(true).toEqual(false); // should not enter here
    });

    for (let i = 65; i < 10; i++) {
      queue.enqueue(String.fromCharCode(i));
    }

    let i = 0;
    queue.forEach((e) => {
      expect(e).toEqual(String.fromCharCode(i));
      i++;
    });
  });

  it("For each can be interrupted", function () {
    const array = [0, 1, 2, 3, 4];
    const q = new Queue(...array);
    const b = q.filter((e) => {
      return (+e <= 3);
    });
    expect([0, 1, 2, 3]).toEqual(b);
  });
  it("Contains previously added items", function () {
    hydrateQueue();
    expect(queue.contains("a1")).toEqual(true);
    expect(queue.contains("z")).toEqual(false);
    // @ts-ignore: edge case handling
    expect(queue.contains(undefined)).toEqual(false);
  });
});
