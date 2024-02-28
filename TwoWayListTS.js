var TwoWayListNode = /** @class */ (function () {
    function TwoWayListNode(value, next, previous) {
        if (next === void 0) { next = null; }
        if (previous === void 0) { previous = null; }
        this._value = value;
        this._next = next;
        this._previous = previous;
    }
    Object.defineProperty(TwoWayListNode.prototype, "previous", {
        get: function () {
            return this._previous;
        },
        set: function (value) {
            this._previous = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TwoWayListNode.prototype, "next", {
        get: function () {
            return this._next;
        },
        set: function (value) {
            this._next = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TwoWayListNode.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value;
        },
        enumerable: false,
        configurable: true
    });
    return TwoWayListNode;
}());
var TwoWayListTS = /** @class */ (function () {
    function TwoWayListTS() {
        this.head = null;
        this.tail = null;
    }
    TwoWayListTS.prototype.insertFirst = function (value) {
        var newNode = new TwoWayListNode(value, this.head);
        if (this.head) {
            this.head.previous = newNode;
        }
        this.head = newNode;
        if (!this.tail) {
            this.tail = newNode;
        }
        return this;
    };
    TwoWayListTS.prototype.append = function (value) {
        var newNode = new TwoWayListNode(value);
        if (this.tail) {
            this.tail.next = newNode;
        }
        newNode.previous = this.tail;
        this.tail = newNode;
        if (!this.head) {
            this.head = newNode;
        }
        return this;
    };
    TwoWayListTS.prototype.find = function (value) {
        var currentNode = this.head;
        while (currentNode) {
            if (value !== undefined && currentNode.value === value) {
                return currentNode;
            }
            currentNode = currentNode.next;
        }
        return null;
    };
    TwoWayListTS.prototype.delete = function (value) {
        var deletedNode = null;
        var currentNode = this.head;
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
                }
                else if (deletedNode === this.tail) {
                    this.tail = deletedNode.previous;
                    this.tail.next = null;
                }
                else {
                    var previousNode = deletedNode.previous;
                    var nextNode = deletedNode.next;
                    previousNode.next = nextNode;
                    nextNode.previous = previousNode;
                }
            }
            currentNode = currentNode.next;
        }
        return deletedNode;
    };
    TwoWayListTS.prototype.replace = function (value, newvalue) {
        var deletedNode = null;
        var currentNode = this.head;
        while (currentNode) {
            if (currentNode.value === value) {
                var newNode = new TwoWayListNode(newvalue);
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
                }
                else if (deletedNode === this.tail) {
                    this.tail = newNode;
                    newNode.previous = deletedNode.previous;
                    newNode.previous.next = newNode;
                }
                else {
                    var previousNode = deletedNode.previous;
                    var nextNode = deletedNode.next;
                    previousNode.next = newNode;
                    nextNode.previous = newNode;
                    newNode.previous = previousNode;
                    newNode.next = nextNode;
                }
            }
            currentNode = currentNode.next;
        }
    };
    TwoWayListTS.prototype.size = function () {
        var i = 0;
        var currentNode = this.head;
        while (currentNode) {
            i++;
            currentNode = currentNode.next;
        }
        return i;
    };
    return TwoWayListTS;
}());
var list = new TwoWayListTS();
list.append('1').append('2').append('first');
console.log(list.size());
// list.delete('1');
console.log(list.size());
list.replace('1', '111');
console.log(list.find('111'));
