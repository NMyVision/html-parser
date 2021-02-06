import StringQueue from "../src/StringQueue"

describe.only("Queue Tests", () => {

  var queue: StringQueue = null;

  function hydrateQueue() {
    queue.enqueue('a');
    queue.enqueue('b');
    queue.enqueue('c');
  }

  beforeEach(() => {
    queue = new StringQueue();
  });

  it('Proper constructor string', () => {
    queue = new StringQueue('abc')
    expect(Array.from(queue)).toEqual(['a', 'b', 'c']);
    expect(queue.size()).toEqual(3);
  })

  it("Gives right size", () => {

    expect(queue.size()).toEqual(0)
    hydrateQueue();
    expect(queue.size()).toEqual(3);
    queue.enqueue('d');
    expect(queue.size()).toEqual(4);
    queue.dequeue();
    expect(queue.size()).toEqual(3);
    queue.clear();
    expect(queue.size()).toEqual(0);

  })

  it("Runs", () => {
    queue = new StringQueue('div />')
    expect(queue.run('/', ' ')).toEqual('div')

    queue = new StringQueue('abc--def..hij')
    expect(queue.run('--')).toEqual('abc')

    queue = new StringQueue('abc-*def.*hij')
    expect(queue.run('.*', '--')).toEqual('abc-*def')

    let tag = "";
    queue = new StringQueue('<div><input type="text" /></div>')
    queue.dequeue()
    expect(queue.index).toEqual(1)
    tag = queue.run(">")
    expect(queue.index).toEqual(4)
    expect(tag).toEqual("div")
    queue.dequeue()

    queue.run('<')
    queue.dequeue()
    expect(queue.index).toEqual(6)
    tag = queue.run(' ')
    expect(tag).toEqual("input")

    queue.skipSpace()

    const attr = queue.run('=', ' ')
    expect(attr).toEqual("type")

    queue.dequeue()
    const del = queue.peek()
    queue.dequeue()

    const attrValue = queue.run(del)
    queue.dequeue()

    expect(attrValue).toEqual("text")


  })

  it('Enqueues',
    function () {
      hydrateQueue();
      var head = queue.dequeue();
      expect(head).toEqual('a');
      queue.dequeue();
      head = queue.dequeue();
      expect(head).toEqual('c');
      expect(queue.isEmpty()).toEqual(true);
      head = queue.dequeue();
      expect(head).toEqual(undefined);
    });

  it('Peeks',
    function () {
      hydrateQueue();
      var head = queue.peek();
      expect(head).toEqual('a');
      var head2 = queue.dequeue();
      expect(head).toEqual(head2);
      head = queue.peek();
      expect(head).toEqual('b');
      queue.clear();
      head = queue.peek();
      expect(head).toEqual(undefined);
    });


  it('For each gives the right ordering',
    function () {

      queue.forEach(function (e: any) {
        expect(true).toEqual(false); // should not enter here
      });

      for (var i = 65; i < 10; i++) {
        queue.enqueue(String.fromCharCode(i));
      }

      var i = 0;
      queue.forEach(function (e: any) {
        expect(e).toEqual(String.fromCharCode(i));
        i++;
      });
    });

  it('Contains previously added items',
    function () {
      hydrateQueue();
      expect(queue.contains('a')).toEqual(true);
      expect(queue.contains('z')).toEqual(false);
      expect(queue.contains(undefined)).toEqual(false);
    });
})