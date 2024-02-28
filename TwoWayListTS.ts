class TwoWayListNode<Type> {
    get previous(): TwoWayListNode<Type> {
        return this._previous;
    }

    set previous(value: TwoWayListNode<Type>) {
        this._previous = value;
    }
    get next(): TwoWayListNode<Type> {
        return this._next;
    }

    set next(value: TwoWayListNode<Type>) {
        this._next = value;
    }
    get value(): Type {
        return this._value;
    }

    set value(value: Type) {
        this._value = value;
    }
    private _value: Type;
    private _next: TwoWayListNode<Type>;
    private _previous: TwoWayListNode<Type>;
    constructor(value: Type, next: TwoWayListNode<Type> = null, previous: TwoWayListNode<Type> = null) {
        this._value = value;
        this._next = next;
        this._previous = previous;
    }
}

class TwoWayListTS<Type> {
    private head: TwoWayListNode<Type>;
    private tail: TwoWayListNode<Type>;
    constructor() {
        this.head = null;
        this.tail = null;
    }

    insertFirst(value: Type): TwoWayListTS<Type> {
        let newNode: TwoWayListNode<Type> = new TwoWayListNode(value, this.head);

        if (this.head) {
            this.head.previous = newNode;
        }

        this.head = newNode;

        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    append(value: Type): TwoWayListTS<Type> {
        let newNode: TwoWayListNode<Type> = new TwoWayListNode(value);

        if (this.tail) {
            this.tail.next = newNode;
        }

        newNode.previous = this.tail;

        this.tail = newNode;

        if (!this.head) {
            this.head = newNode;
        }

        return this;
    }

    find(value: Type): TwoWayListNode<Type> {

        let currentNode: TwoWayListNode<Type> = this.head;

        while (currentNode) {
            if (value !== undefined && currentNode.value === value) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }

        return null;
    }

    delete(value: Type): TwoWayListNode<Type> {
        let deletedNode: TwoWayListNode<Type>  = null;
        let currentNode: TwoWayListNode<Type> = this.head;

        while (currentNode) {
            if (currentNode.value === value) {
                deletedNode = currentNode;

                if (deletedNode === this.head) {
                    this.head = deletedNode.next;

                    if (this.head) {
                        this.head.previous = null;
                    }

                    if (deletedNode === this.tail) {
                        this.tail = null;
                    }
                } else if (deletedNode === this.tail) {
                    this.tail = deletedNode.previous;
                    this.tail.next = null;
                } else {
                    let previousNode: TwoWayListNode<Type> = deletedNode.previous;
                    let nextNode: TwoWayListNode<Type> = deletedNode.next;
                    previousNode.next = nextNode;
                    nextNode.previous = previousNode;
                }
            }

            currentNode = currentNode.next;
        }

        return deletedNode;
    }

    replace(value: Type, newvalue: Type): void {
        let deletedNode = null;
        let currentNode: TwoWayListNode<Type> = this.head;

        while (currentNode) {
            if (currentNode.value === value) {
                let newNode: TwoWayListNode<Type> = new TwoWayListNode(newvalue);
                deletedNode = currentNode;

                if (deletedNode === this.head) {
                    this.head = newNode;

                    if (deletedNode.next) {
                        newNode.next = deletedNode.next;
                        newNode.next.previous = newNode;
                    }

                    if (deletedNode === this.tail) {
                        this.tail = newNode;
                    }
                } else if (deletedNode === this.tail) {
                    this.tail = newNode;
                    newNode.previous = deletedNode.previous;
                    newNode.previous.next = newNode;
                } else {
                    let previousNode = deletedNode.previous;
                    let nextNode = deletedNode.next;
                    previousNode.next = newNode;
                    nextNode.previous = newNode;
                    newNode.previous = previousNode;
                    newNode.next = nextNode;

                }
            }

            currentNode = currentNode.next;
        }
    }

    size(): number {
        let i: number = 0;
        let currentNode: TwoWayListNode<Type> = this.head;

        while (currentNode) {
            i++;
            currentNode = currentNode.next;
        }

        return i;
    }
}
let list: TwoWayListTS<string> = new TwoWayListTS()
list.append('1').append('2').append('first');
console.log(list.size());
// list.delete('1');
console.log(list.size());
list.replace('1', '111');
console.log(list.find('111'));