class TwoWayListNode {
    constructor(value, next = null, previous = null) {
        this.value = value;
        this.next = next;
        this.previous = previous;
    }
}

class TwoWayList {
    constructor() {
        this.head = null;
        this.tail = null;
    }

    insertFirst(value) {
        let newNode = new TwoWayListNode(value, this.head);

        if (this.head) {
            this.head.previous = newNode;
        }

        this.head = newNode;

        if (!this.tail) {
            this.tail = newNode;
        }

        return this;
    }

    append(value) {
        let newNode = new TwoWayListNode(value);

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

    find(value) {

        let currentNode = this.head;

        while (currentNode) {
            if (value !== undefined && currentNode.value === value) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }

        return null;
    }

    delete(value) {
        let deletedNode = null;
        let currentNode = this.head;

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
                    let previousNode = deletedNode.previous;
                    let nextNode = deletedNode.next;
                    previousNode.next = nextNode;
                    nextNode.previous = previousNode;
                }
            }

            currentNode = currentNode.next;
        }

        return deletedNode;
    }

    replace(value, newvalue) {
        let deletedNode = null;
        let currentNode = this.head;

        while (currentNode) {
            if (currentNode.value === value) {
                let newNode = new TwoWayListNode(newvalue);
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

    size() {
        let i = 0;
        let currentNode = this.head;

        while (currentNode) {
            i++;
            currentNode = currentNode.next;
        }

        return i;
    }
}
let list = new TwoWayList();
list.append('1').append(2).append('first');
console.log(list.size());
// list.delete('1');
console.log(list.size());
list.replace('1', '111');
console.log(list.find('111'));
alert()