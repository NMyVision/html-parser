import { stringify } from "querystring"

export default class Queue<T> extends Array<T>
{
  constructor(...items:T[]){
    super(...items)
  }

  enqueue(item: T) {
    return super.push(item)
  }

  dequeue() {
    return this.splice(0, 1)[0]
  }

  // peek(): T {
  //     return this[0]
  // }
  peek(): T
  peek(take:number): string
  peek(take?: number): T | string {
    if (take  === undefined)
      return this[0]

      return this.filter((x, index) => index < take).join("")
  }

  size(): number {
    return this.length
  }

  clear() {
    this.length = 0
  }

  isEmpty() {
    return this.length === 0
  }

  contains(item:T, fromIndex?:number) {
    return this.includes(item, fromIndex)
  }
}