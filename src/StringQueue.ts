import { textSpanIsEmpty } from "typescript"
import Queue from "./Queue"


/**
 * A Special type of Queue made for parsing strings
 */
export default class StringQueue extends Queue<string>
{

  private _source: string[] | undefined
  private _index: number

  constructor(text?: string) {
    if (text) {
      super(...Array.from(text))
      this._source = Array.from(text)
      this._index = 0
    }
    else {
      super()
      this._index = 0
    }
  }

  get index() {
    return this._index;
  }

  any() {
    return !this.isEmpty()
  }


  run(...chars: string[]) {
    const tx = this.join('')
    const r = Math.min.apply(null, chars.map(x => tx.indexOf(x)).filter(x => x >= 0))
    this._index += r
    return this.splice(0, r).join('')
  }

  dequeue(length?: number) {
    if (length !== undefined) {
      var text = '';
      while (length-- > 0) {
        this._index++;
        text += super.dequeue();
      }
      return text;
    }

    this._index++;
    return super.dequeue();
  }

  skipSpace(): void {
    while (!this.isEmpty() && (this.peek() == ' ' || this.peek() == '\r' || this.peek() == '\n'))
      this.dequeue();
  }
}