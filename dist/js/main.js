(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @fileOverview Implementation of a doubly linked-list data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    var isEqual = require('lodash.isequal');
    var Node = require('./lib/list-node');
    var Iterator = require('./lib/iterator');

    /**************************************************
     * Doubly linked list class
     *
     * Implementation of a doubly linked list data structure.  This
     * implementation provides the general functionality of adding nodes to
     * the front or back of the list, as well as removing node from the front
     * or back.  This functionality enables this implemention to be the
     * underlying data structure for the more specific stack or queue data
     * structure.
     *
     ***************************************************/

    /**
     * Creates a LinkedList instance.  Each instance has a head node, a tail
     * node and a size, which represents the number of nodes in the list.
     *
     * @constructor
     */
    function DoublyLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;

        // add iterator as a property of this list to share the same
        // iterator instance with all other methods that may require
        // its use.  Note: be sure to call this.iterator.reset() to
        // reset this iterator to point the head of the list.
        this.iterator = new Iterator(this);
    }

    /* Functions attached to the Linked-list prototype.  All linked-list
     * instances will share these methods, meaning there will NOT be copies
     * made for each instance.  This will be a huge memory savings since there
     * may be several different linked lists.
     */
    DoublyLinkedList.prototype = {

        /**
         * Creates a new Node object with 'data' assigned to the node's data
         * property
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {object} Node object intialized with 'data'
         */
        createNewNode: function (data) {
            return new Node(data);
        },

        /**
         * Returns the first node in the list, commonly referred to as the
         * 'head' node
         *
         * @returns {object} the head node of the list
         */
        getHeadNode: function () {
            return this.head;
        },

        /**
         * Returns the last node in the list, commonly referred to as the
         * 'tail'node
         *
         * @returns {object} the tail node of the list
         */
        getTailNode: function () {
            return this.tail;
        },

        /**
         * Determines if the list is empty
         *
         * @returns {boolean} true if the list is empty, false otherwise
         */
        isEmpty: function () {
            return (this.size === 0);
        },

        /**
         * Returns the size of the list, or number of nodes
         *
         * @returns {number} the number of nodes in the list
         */
        getSize: function () {
            return this.size;
        },

        /**
         * Clears the list of all nodes/data
         */
        clear: function () {
            while (!this.isEmpty()) {
                this.remove();
            }
        },

        //################## INSERT methods ####################

        /**
         * Inserts a node with the provided data to the end of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insert: function (data) {
            var newNode = this.createNewNode(data);
            if (this.isEmpty()) {
                this.head = this.tail = newNode;
            } else {
                this.tail.next = newNode;
                newNode.prev = this.tail;
                this.tail = newNode;
            }
            this.size += 1;

            return true;
        },

        /**
         * Inserts a node with the provided data to the front of the list
         *
         * @param {object|string|number} data The data to initialize with the
         *                                    node
         * @returns {boolean} true if insert operation was successful
         */
        insertFirst: function (data) {
            if (this.isEmpty()) {
                this.insert(data);
            } else {
                var newNode = this.createNewNode(data);

                newNode.next = this.head;
                this.head.prev = newNode;
                this.head = newNode;

                this.size += 1;
            }

            return true;
        },

        /**
         * Inserts a node with the provided data at the index indicated.
         *
         * @param {number} index The index in the list to insert the new node
         * @param {object|string|number} data The data to initialize with the node
         */
        insertAt: function (index, data) {
            var current = this.getHeadNode(),
                newNode = this.createNewNode(data),
                position = 0;

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return false;
            }

            // if index is 0, we just need to insert the first node
            if (index === 0) {
                this.insertFirst(data);
                return true;
            }

            while (position < index) {
                current = current.next;
                position += 1;
            }

            current.prev.next = newNode;
            newNode.prev = current.prev;
            current.prev = newNode;
            newNode.next = current;

            this.size += 1;

            return true;
        },

        /**
         * Inserts a node before the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node before
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertBefore: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            return this.insertAt(index, dataToInsert);
        },

        /**
         * Inserts a node after the first node containing the provided data
         *
         * @param {object|string|number} nodeData The data of the node to
         *         find to insert the new node after
         * @param {object|string|number} dataToInsert The data to initialize with the node
         * @returns {boolean} true if insert operation was successful
         */
        insertAfter: function (nodeData, dataToInsert) {
            var index = this.indexOf(nodeData);
            var size = this.getSize();

            // check if we want to insert new node after the tail node
            if (index + 1 === size) {

                // if so, call insert, which will append to the end by default
                return this.insert(dataToInsert);

            } else {

                // otherwise, increment the index and insert there
                return this.insertAt(index + 1, dataToInsert);
            }
        },

        /**
         * Concatenate another linked list to the end of this linked list. The result is very
         * similar to array.concat but has a performance improvement since there is no need to
         * iterate over the lists
         * @param {DoublyLinkedList} otherLinkedList
         * @returns {DoublyLinkedList}
         */
        concat: function (otherLinkedList) {
            if (otherLinkedList instanceof DoublyLinkedList) {
                //create new list so the calling list is immutable (like array.concat)
                var newList = new DoublyLinkedList();
                if (this.getSize() > 0) { //this list is NOT empty
                    newList.head = this.getHeadNode();
                    newList.tail = this.getTailNode();
                    newList.tail.next = otherLinkedList.getHeadNode();
                    if (otherLinkedList.getSize() > 0) {
                        newList.tail = otherLinkedList.getTailNode();
                    }
                    newList.size = this.getSize() + otherLinkedList.getSize();
                }
                else { //'this' list is empty
                    newList.head = otherLinkedList.getHeadNode();
                    newList.tail = otherLinkedList.getTailNode();
                    newList.size = otherLinkedList.getSize();
                }
                return newList;

            }
            else {
                throw new Error("Can only concat another instance of DoublyLinkedList");
            }
        },

        //################## REMOVE methods ####################

        /**
         * Removes the tail node from the list
         *
         * There is a significant performance improvement with the operation
         * over its singly linked list counterpart.  The mere fact of having
         * a reference to the previous node improves this operation from O(n)
         * (in the case of singly linked list) to O(1).
         *
         * @returns the node that was removed
         */
        remove: function () {
            if (this.isEmpty()) {
                return null;
            }

            // get handle for the tail node
            var nodeToRemove = this.getTailNode();

            // if there is only one node in the list, set head and tail
            // properties to null
            if (this.getSize() === 1) {
                this.head = null;
                this.tail = null;

            // more than one node in the list
            } else {
                this.tail = this.getTailNode().prev;
                this.tail.next = null;
            }
            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the head node from the list
         *
         * @returns the node that was removed
         */
        removeFirst: function () {
            if (this.isEmpty()) {
                return null;
            }

            var nodeToRemove;

            if (this.getSize() === 1) {
                nodeToRemove = this.remove();
            } else {
                nodeToRemove = this.getHeadNode();
                this.head = this.head.next;
                this.head.prev = null;
                this.size -= 1;
            }

            return nodeToRemove;
        },

        /**
         * Removes the node at the index provided
         *
         * @param {number} index The index of the node to remove
         * @returns the node that was removed
         */
        removeAt: function (index) {
            var nodeToRemove = this.findAt(index);

            // check for index out-of-bounds
            if (index < 0 || index > this.getSize() - 1) {
                return null;
            }

            // if index is 0, we just need to remove the first node
            if (index === 0) {
                return this.removeFirst();
            }

            // if index is size-1, we just need to remove the last node,
            // which remove() does by default
            if (index === this.getSize() - 1) {
                return this.remove();
            }

            nodeToRemove.prev.next = nodeToRemove.next;
            nodeToRemove.next.prev = nodeToRemove.prev;
            nodeToRemove.next = nodeToRemove.prev = null;

            this.size -= 1;

            return nodeToRemove;
        },

        /**
         * Removes the first node that contains the data provided
         *
         * @param {object|string|number} nodeData The data of the node to remove
         * @returns the node that was removed
         */
        removeNode: function (nodeData) {
            var index = this.indexOf(nodeData);
            return this.removeAt(index);
        },

        //################## FIND methods ####################

        /**
         * Returns the index of the first node containing the provided data.  If
         * a node cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the index of the node if found, -1 otherwise
         */
        indexOf: function (nodeData) {
            this.iterator.reset();
            var current;

            var index = 0;

            // iterate over the list (keeping track of the index value) until
            // we find the node containg the nodeData we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return index;
                }
                index += 1;
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the fist node containing the provided data.  If a node
         * cannot be found containing the provided data, -1 is returned.
         *
         * @param {object|string|number} nodeData The data of the node to find
         * @returns the node if found, -1 otherwise
         */
        find: function (nodeData) {
            // start at the head of the list
            this.iterator.reset();
            var current;

            // iterate over the list until we find the node containing the data
            // we are looking for
            while (this.iterator.hasNext()) {
                current = this.iterator.next();
                if (isEqual(current.getData(), nodeData)) {
                    return current;
                }
            }

            // only get here if we didn't find a node containing the nodeData
            return -1;
        },

        /**
         * Returns the node at the location provided by index
         *
         * @param {number} index The index of the node to return
         * @returns the node located at the index provided.
         */
        findAt: function (index) {
            // if idx is out of bounds or fn called on empty list, return -1
            if (this.isEmpty() || index > this.getSize() - 1) {
                return -1;
            }

            // else, loop through the list and return the node in the
            // position provided by idx.  Assume zero-based positions.
            var node = this.getHeadNode();
            var position = 0;

            while (position < index) {
                node = node.next;
                position += 1;
            }

            return node;
        },

        /**
         * Determines whether or not the list contains the provided nodeData
         *
         * @param {object|string|number} nodeData The data to check if the list
         *        contains
         * @returns the true if the list contains nodeData, false otherwise
         */
        contains: function (nodeData) {
            if (this.indexOf(nodeData) > -1) {
                return true;
            } else {
                return false;
            }
        },

        //################## UTILITY methods ####################

        /**
         * Utility function to iterate over the list and call the fn provided
         * on each node, or element, of the list
         *
         * @param {object} fn The function to call on each node of the list
         * @param {bool} reverse Use or not reverse iteration (tail to head), default to false
         */
        forEach: function (fn, reverse) {
            reverse = reverse || false;
            if (reverse) {
                this.iterator.reset_reverse();
                this.iterator.each_reverse(fn);
            } else {
                this.iterator.reset();
                this.iterator.each(fn);
            }
        },

        /**
         * Returns an array of all the data contained in the list
         *
         * @returns {array} the array of all the data from the list
         */
        toArray: function () {
            var listArray = [];
            this.forEach(function (node) {
                listArray.push(node.getData());
            });

            return listArray;
        },

        /**
         * Interrupts iteration over the list
         */
        interruptEnumeration: function () {
            this.iterator.interrupt();
        }
    };

    module.exports = DoublyLinkedList;

}());

},{"./lib/iterator":2,"./lib/list-node":3,"lodash.isequal":4}],2:[function(require,module,exports){
/**
 * @fileOverview Implementation of an iterator for a linked list
 *               data structure
 * @author Jason S. Jones
 * @license MIT
 */

(function () {
    'use strict';

    /**************************************************
     * Iterator class
     *
     * Represents an instantiation of an iterator to be used
     * within a linked list.  The iterator will provide the ability
     * to iterate over all nodes in a list by keeping track of the
     * postition of a 'currentNode'.  This 'currentNode' pointer
     * will keep state until a reset() operation is called at which
     * time it will reset to point the head of the list.
     *
     * Even though this iterator class is inextricably linked
     * (no pun intended) to a linked list instatiation, it was removed
     * from within the linked list code to adhere to the best practice
     * of separation of concerns.
     *
     ***************************************************/

    /**
     * Creates an iterator instance to iterate over the linked list provided.
     *
     * @constructor
     * @param {object} theList the linked list to iterate over
     */
    function Iterator(theList) {
        this.list = theList || null;
        this.stopIterationFlag = false;

        // a pointer the current node in the list that will be returned.
        // initially this will be null since the 'list' will be empty
        this.currentNode = null;
    }

    /* Functions attached to the Iterator prototype.  All iterator instances
     * will share these methods, meaning there will NOT be copies made for each
     * instance.
     */
    Iterator.prototype = {

        /**
         * Returns the next node in the iteration.
         *
         * @returns {object} the next node in the iteration.
         */
        next: function () {
            var current = this.currentNode;
            // a check to prevent error if randomly calling next() when
            // iterator is at the end of the list, meaining the currentNode
            // will be pointing to null.
            //
            // When this function is called, it will return the node currently
            // assigned to this.currentNode and move the pointer to the next
            // node in the list (if it exists)
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.next;
            }

            return current;
        },

        /**
         * Determines if the iterator has a node to return
         *
         * @returns true if the iterator has a node to return, false otherwise
         */
        hasNext: function () {
            return this.currentNode !== null;
        },

        /**
         * Resets the iterator to the beginning of the list.
         */
        reset: function () {
            this.currentNode = this.list.getHeadNode();
        },

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        first: function () {
            this.reset();
            return this.next();
        },

        /**
         * Sets the list to iterate over
         *
         * @param {object} theList the linked list to iterate over
         */
        setList: function (theList) {
            this.list = theList;
            this.reset();
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument.
         * Iteration will break if interrupt() is called
         *
         * @param {function} callback the callback function to be called with
         *                   each node of the list as an arg
         */
        each: function (callback) {
            this.reset();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### REVERSE ITERATION (TAIL -> HEAD) ###
         */

        /**
         * Returns the first node in the list and moves the iterator to
         * point to the second node.
         *
         * @returns the first node in the list
         */
        last: function () {
            this.reset_reverse();
            return this.next_reverse();
        },

        /**
         * Resets the iterator to the tail of the list.
         */
        reset_reverse: function () {
            this.currentNode = this.list.getTailNode();
        },

        /**
         * Returns the next node in the iteration, when iterating from tail to head
         *
         * @returns {object} the next node in the iteration.
         */
        next_reverse: function () {
            var current = this.currentNode;
            if (this.currentNode !== null) {
                this.currentNode = this.currentNode.prev;
            }

            return current;
        },

        /**
         * Iterates over all nodes in the list and calls the provided callback
         * function with each node as an argument,
         * starting from the tail and going towards the head.
         * The iteration will break if interrupt() is called.
         *
         * @param {function} callback the callback function to be called within
         *                    each node as an arg
         */
        each_reverse: function (callback) {
            this.reset_reverse();
            var el;
            while (this.hasNext() && !this.stopIterationFlag) {
                el = this.next_reverse();
                callback(el);
            }
            this.stopIterationFlag = false;
        },

        /*
         * ### INTERRUPT ITERATION ###
         */

        /**
         * Raises interrupt flag (that will stop each() or each_reverse())
         */

        interrupt: function () {
            this.stopIterationFlag = true;
        }
    };

    module.exports = Iterator;

}());

},{}],3:[function(require,module,exports){
(function () {
    'use strict';

    /**************************************************
     * Linked list node class
     *
     * Internal private class to represent a node within
     * a linked list.  Each node has a 'data' property and
     * a pointer the previous node and the next node in the list.
     *
     * Since the 'Node' function is not assigned to
     * module.exports it is not visible outside of this
     * file, therefore, it is private to the LinkedList
     * class.
     *
     ***************************************************/

    /**
     * Creates a node object with a data property and pointer
     * to the next node
     *
     * @constructor
     * @param {object|number|string} data The data to initialize with the node
     */
    function Node(data) {
        this.data = data;
        this.next = null;
        this.prev = null;
    }

    /* Functions attached to the Node prototype.  All node instances will
     * share these methods, meaning there will NOT be copies made for each
     * instance.  This will be a huge memory savings since there will likely
     * be a large number of individual nodes.
     */
    Node.prototype = {

        /**
         * Returns whether or not the node has a pointer to the next node
         *
         * @returns {boolean} true if there is a next node; false otherwise
         */
        hasNext: function () {
            return (this.next !== null);
        },

        /**
         * Returns whether or not the node has a pointer to the previous node
         *
         * @returns {boolean} true if there is a previous node; false otherwise
         */
        hasPrev: function () {
            return (this.prev !== null);
        },

        /**
         * Returns the data of the the node
         *
         * @returns {object|string|number} the data of the node
         */
        getData: function () {
            return this.data;
        },

        /**
         * Returns a string represenation of the node.  If the data is an
         * object, it returns the JSON.stringify version of the object.
         * Otherwise, it simply returns the data
         *
         * @return {string} the string represenation of the node data
         */
        toString: function () {
            if (typeof this.data === 'object') {
                return JSON.stringify(this.data);
            } else {
                return String(this.data);
            }
        }
    };

    module.exports = Node;

}());

},{}],4:[function(require,module,exports){
(function (global){
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = isEqual;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (root, factory){
  'use strict';

  /*istanbul ignore next:cant test*/
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else {
    // Browser globals
    root.objectPath = factory();
  }
})(this, function(){
  'use strict';

  var toStr = Object.prototype.toString;
  function hasOwnProperty(obj, prop) {
    if(obj == null) {
      return false
    }
    //to handle objects with null prototypes (too edge case?)
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  function isEmpty(value){
    if (!value) {
      return true;
    }
    if (isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value !== 'string') {
        for (var i in value) {
            if (hasOwnProperty(value, i)) {
                return false;
            }
        }
        return true;
    }
    return false;
  }

  function toString(type){
    return toStr.call(type);
  }

  function isObject(obj){
    return typeof obj === 'object' && toString(obj) === "[object Object]";
  }

  var isArray = Array.isArray || function(obj){
    /*istanbul ignore next:cant test*/
    return toStr.call(obj) === '[object Array]';
  }

  function isBoolean(obj){
    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
  }

  function getKey(key){
    var intKey = parseInt(key);
    if (intKey.toString() === key) {
      return intKey;
    }
    return key;
  }

  function factory(options) {
    options = options || {}

    var objectPath = function(obj) {
      return Object.keys(objectPath).reduce(function(proxy, prop) {
        if(prop === 'create') {
          return proxy;
        }

        /*istanbul ignore else*/
        if (typeof objectPath[prop] === 'function') {
          proxy[prop] = objectPath[prop].bind(objectPath, obj);
        }

        return proxy;
      }, {});
    };

    function hasShallowProperty(obj, prop) {
      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
    }

    function getShallowProperty(obj, prop) {
      if (hasShallowProperty(obj, prop)) {
        return obj[prop];
      }
    }

    function set(obj, path, value, doNotReplace){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (typeof path === 'string') {
        return set(obj, path.split('.').map(getKey), value, doNotReplace);
      }
      var currentPath = path[0];
      var currentValue = getShallowProperty(obj, currentPath);
      if (path.length === 1) {
        if (currentValue === void 0 || !doNotReplace) {
          obj[currentPath] = value;
        }
        return currentValue;
      }

      if (currentValue === void 0) {
        //check if we assume an array
        if(typeof path[1] === 'number') {
          obj[currentPath] = [];
        } else {
          obj[currentPath] = {};
        }
      }

      return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    objectPath.has = function (obj, path) {
      if (typeof path === 'number') {
        path = [path];
      } else if (typeof path === 'string') {
        path = path.split('.');
      }

      if (!path || path.length === 0) {
        return !!obj;
      }

      for (var i = 0; i < path.length; i++) {
        var j = getKey(path[i]);

        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
          obj = obj[j];
        } else {
          return false;
        }
      }

      return true;
    };

    objectPath.ensureExists = function (obj, path, value){
      return set(obj, path, value, true);
    };

    objectPath.set = function (obj, path, value, doNotReplace){
      return set(obj, path, value, doNotReplace);
    };

    objectPath.insert = function (obj, path, value, at){
      var arr = objectPath.get(obj, path);
      at = ~~at;
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }
      arr.splice(at, 0, value);
    };

    objectPath.empty = function(obj, path) {
      if (isEmpty(path)) {
        return void 0;
      }
      if (obj == null) {
        return void 0;
      }

      var value, i;
      if (!(value = objectPath.get(obj, path))) {
        return void 0;
      }

      if (typeof value === 'string') {
        return objectPath.set(obj, path, '');
      } else if (isBoolean(value)) {
        return objectPath.set(obj, path, false);
      } else if (typeof value === 'number') {
        return objectPath.set(obj, path, 0);
      } else if (isArray(value)) {
        value.length = 0;
      } else if (isObject(value)) {
        for (i in value) {
          if (hasShallowProperty(value, i)) {
            delete value[i];
          }
        }
      } else {
        return objectPath.set(obj, path, null);
      }
    };

    objectPath.push = function (obj, path /*, values */){
      var arr = objectPath.get(obj, path);
      if (!isArray(arr)) {
        arr = [];
        objectPath.set(obj, path, arr);
      }

      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    objectPath.coalesce = function (obj, paths, defaultValue) {
      var value;

      for (var i = 0, len = paths.length; i < len; i++) {
        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
          return value;
        }
      }

      return defaultValue;
    };

    objectPath.get = function (obj, path, defaultValue){
      if (typeof path === 'number') {
        path = [path];
      }
      if (!path || path.length === 0) {
        return obj;
      }
      if (obj == null) {
        return defaultValue;
      }
      if (typeof path === 'string') {
        return objectPath.get(obj, path.split('.'), defaultValue);
      }

      var currentPath = getKey(path[0]);
      var nextObj = getShallowProperty(obj, currentPath)
      if (nextObj === void 0) {
        return defaultValue;
      }

      if (path.length === 1) {
        return nextObj;
      }

      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    objectPath.del = function del(obj, path) {
      if (typeof path === 'number') {
        path = [path];
      }

      if (obj == null) {
        return obj;
      }

      if (isEmpty(path)) {
        return obj;
      }
      if(typeof path === 'string') {
        return objectPath.del(obj, path.split('.'));
      }

      var currentPath = getKey(path[0]);
      if (!hasShallowProperty(obj, currentPath)) {
        return obj;
      }

      if(path.length === 1) {
        if (isArray(obj)) {
          obj.splice(currentPath, 1);
        } else {
          delete obj[currentPath];
        }
      } else {
        return objectPath.del(obj[currentPath], path.slice(1));
      }

      return obj;
    }

    return objectPath;
  }

  var mod = factory();
  mod.create = factory;
  mod.withInheritedProps = factory({includeInheritedProps: true})
  return mod;
});

},{}],6:[function(require,module,exports){
var animation = {
    state: false,
    counter: 0,
    duration: 240
};

module.exports.animation = animation;
},{}],7:[function(require,module,exports){
// dependencies
// SP
// FIL15338+@

// NPM
    var LinkedList = require('dbly-linked-list');
    var objectPath = require("object-path");

// Custom Requires
    var mathUtils = require('./mathUtils.js').mathUtils;
    var trig = require('./trigonomicUtils.js').trigonomicUtils;
    require('./canvasApiAugmentation.js');
    var coloring = require('./colorUtils.js').colorUtils;
    var easing = require('./easing.js').easingEquations;
    var animation = require('./animation.js').animation;
    var debugConfig = require('./debugUtils.js');
    var debug = debugConfig.debug;
    var lastCalledTime = debugConfig.lastCalledTime;
    var environment = require('./environment.js').environment;
    var physics = environment.forces;
    var runtimeEngine = environment.runtimeEngine;
    
    require('./gears.js');
    
    var overlayCfg = require('./overlay.js').overlayCfg;

    var sunCorona = require('./sunCorona.js');
    var sunSpikes = require('./sunSpikes.js');
    var lensFlare = require('./lensFlare.js');
    var sineWave = require('./sineWaveModulator.js').sineWave;
    var proportionalMeasures = require('./proportionalMeasures.js');
    var bgCycler = require('./backgroundCycler.js');
    var theStars = require('./theStars.js');
    // var muscleModifier = require('./muscleModifier.js').muscleModifier;
    // var seq = require('./sequencer.js');
    // var seqList = seq.seqList;
    // var trackPlayer = require('./trackPlayer.js');

// base variables
    var mouseX = 0, 
        mouseY = 0, 
        lastMouseX = 0, 
        lastMouseY = 0, 
        frameRate = 60, 
        lastUpdate = Date.now(),
        mouseDown = false,
        runtime = 0,
        pLive = 0,
        globalClock = 0,
        counter = 0,
        displayOverlay = false;

// create window load function, initialise mouse tracking
    function init() {
        
        window.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        window.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
        window.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseUp()  ;});
        window.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
        
        // if(typeof window.setup == 'function') window.setup();
        // cjsloop();  
        
    }

    // window load function
    // includes mouse tracking
    window.addEventListener('load',init);

// static asset canvases
let staticAssetCanvas = document.createElement('canvas');
let staticAssetCtx = staticAssetCanvas.getContext("2d");
staticAssetCanvas.width = window.innerWidth * 2;
staticAssetCanvas.height = window.innerHeight * 2;

var staticAssetConfigs = {};
var imageAssetConfigs = {};

let secondaryStaticAssetCanvas = document.createElement('canvas');
let secondaryStaticAssetCtx = secondaryStaticAssetCanvas.getContext("2d");
secondaryStaticAssetCanvas.width = window.innerWidth * 2;
secondaryStaticAssetCanvas.height = window.innerHeight * 2;

let flareAssetCanvas = document.createElement('canvas');
let flareAssetCtx = flareAssetCanvas.getContext("2d");
flareAssetCanvas.width = window.innerWidth * 2;
flareAssetCanvas.height = window.innerHeight * 2;
flareAssetCanvas.id = 'flareAssetCanvas';

let bgGlareCanvas = document.createElement('canvas');
let bgGlareCtx = bgGlareCanvas.getContext("2d");
bgGlareCanvas.width = window.innerWidth;
bgGlareCanvas.height = window.innerHeight;

let lensFlareCanvas = document.createElement('canvas');
let lensFlareCtx = lensFlareCanvas.getContext("2d");



// standard canvas rendering
// canvas housekeeping

//// Screen Renderers

// face layer
var canvas = document.querySelector("#face-layer");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingQuality = "high";

var flareLayer = document.querySelector("#flare-layer");
var flareLayerCtx = canvas.getContext("2d");

var coronaLayer = document.querySelector("#corona-layer");
var coronaLayerCtx = canvas.getContext("2d");


// cache canvas w/h
var canW = window.innerWidth;
var canH = window.innerHeight;
var canvasCentreH = canW / 2;
var canvasCentreV = canH / 2;

// set canvases to full-screen
canvas.width = canW;
canvas.height = canH;
flareLayer.width = canW;
flareLayer.height = canH;
coronaLayer.width = canW;
coronaLayer.height = canH;


// set base canvas config
var canvasConfig = {
    width: canW,
    height: canH,
    centerH: canvasCentreH,
    centerV: canvasCentreV,

    bufferClearRegion: {
        x: canvasCentreH,
        y: canvasCentreV,
        w: 0,
        h: 0
    }
};


// set buffer config for use in constrained canvas clear region
var bufferClearRegion = {
    x: canvasCentreH,
    y: canvasCentreV,
    w: 0,
    h: 0
};

// set aperture sides fpor light effects across animation
let apertureSides = 6;

// set base config for sun
var theSun = {
    colours: {
        base: {
            red: '#aa0000',
            orange: '#FF9C0D',
            yellow: '#bbbb00',
            white: '#FFFFFF',
            whiteShadow: '#DDDDFF'
        },
        rgb: {
            orange: '255, 156, 13',
            whiteShadow: {
                r: 221,
                g: 221,
                b: 255
            }
        },
        rgba: {
            orangeShadow: 'rgba( 255, 156, 13, 0.3 )',
            orangeShadowLight: 'rgba( 255, 156, 13, 0.2 )',
            orangeShadowLightest: 'rgba( 255, 156, 13, 0.1 )',
            orangeShadowDarkLip: 'rgba( 255, 156, 13, 0.4 )',
            orangeShadowDark: 'rgba( 255, 156, 13, 1 )'
        },
        debug: {
            points: '#00aa00',
            handles: '#0000aa',
            lines: '#0055ff',
            orange: 'rgb( 255, 156, 13, 0.2 )',
            dimmed: 'rgba( 255, 150, 40, 0.2 )',
            fills: 'rgba( 255, 150, 40, 0.2 )',
            fillsTeeth: 'rgba( 255, 255, 255, 0.1 )'
        }
    },
    debug: {
        pointR: 4,
        handleR: 2
    },
    r: 30,
    x: 300,
    y: 850,
    rVel: 0,
    a: Math.PI / 1.2,
    fullRotation: Math.PI * 2,
    orbitSeconds: 30,
    orbitTime: 0,
    orbitClock: 0,
    localRotation: 0,
    lens: {},
    lensFlareOpacity: 0,
    lensFlareOpacityInterval: 0.02,
    indicatorParams: {
        r: 100,
        x: 150,
        y: 150
    },
    pivotPoint: {
        hMultiplier: 0.5,
        vMultiplier: 1
    },
    isVisible: false,

    getCanvasDimentions: function( canvas ) {

        this.canvas = {
            w: canvas.width,
            h: canvas.height,
            centreH: canvas.width / 2,
            centreV: canvas.height / 2
        }

        this.lens.radius = this.canvas.centreH;
        this.lens.maxD = trig.dist( 0, 0, this.canvas.w * 3, this.canvas.h * 3 );
        this.lens.sunLensIntersectingFlag = false;
        this.lens.currIntersectDist = 0;
        this.lens.currOverlap = 0;
        this.lens.currOverlapScale = 0;
        this.lens.sunLensTangentDist = 0;

    },

    calculateSunLensIntersectDist: function() {
        // console.log( 'this.x: ', this.x );
        // console.log( 'this.Y: ', this.Y );
        // console.log( 'this.x: ', this.x );
        // console.log( 'this.x: ', this.x );


        this.lens.currIntersectDist = trig.dist( this.x, this.y, this.canvas.centreH, this.canvas.centreV );
        if ( this.lens.currIntersectDist < this.r + this.lens.radius ) {
            this.lens.sunLensIntersectingFlag = true;
            this.lens.currOverlap = ( this.r + this.lens.radius ) - this.lens.currIntersectDist;
            if( this.lens.currOverlap >= 0 && this.lens.currOverlap < this.r ) {
                this.lens.currOverlapScale = this.lens.currOverlap / this.r;
            }

        } else {
            this.lens.sunLensIntersectingFlag = false;
        }

    },

    setInternalCoordinates: function() {

        let canvas = this.canvas;
        let pivot = this.pivotPoint;

        pivot.x = canvas.w * pivot.hMultiplier;
        pivot.y = canvas.h * pivot.vMultiplier;
        pivot.r = trig.dist( canvas.w / 3, canvas.h / 3, pivot.x, pivot.y );
        this.sunToStageCentreAngle = trig.angle( this.x, this.y, canvas.centreH, canvas.centreV );
        this.orbitTime = this.orbitSeconds * 60;
        this.orbitClock = Math.round( ( this.a / this.fullRotation ) * this.orbitTime );
        this.rVel = this.fullRotation / this.orbitTime;



    },

    setSunToStageCentreAngle: function() {

        let canvas = this.canvas;
        this.sunToStageCentreAngle = trig.angle( this.x, this.y, canvas.centreH, canvas.centreV );
    },

    updatePosition: function() {

        let pivot = this.pivotPoint;
        let newPos = trig.radialDistribution( pivot.x, pivot.y, pivot.r, this.a );
        this.localRotation = trig.angle( this.x, this.y, this.canvas.centreH, this.canvas.centreV );
        this.x = newPos.x;
        this.y = newPos.y;
        this.isVisible = this.checkIfVisible();
        this.a += this.rVel;
        this.calculateSunLensIntersectDist();

        if ( this.orbitClock < this.orbitTime ) {
            this.orbitClock++;
        } else {
            this.orbitClock = 0;
        }
    },

    checkIfVisible: function() {
        let isVisible = false;

        if ( this.x + this.r > 0 ) {
            if ( this.x - this.r < this.canvas.w ) {
                if ( this.y + this.r > 0 ) {
                    if ( this.y - this.r < this.canvas.h ) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    indicatorCoordinates: {
        spokes: []
    },

    setindicatorCoordinates: function(){

        let self = this;
        let indParam = self.indicatorParams;
        let num = 24;

        let segment = ( Math.PI * 2 ) / num;
        let txtCounter = 18;
        for ( let i = 0; i < num; i++ ) {

            let startMultiplier = i % 6 === 0 ? 1.25 : 1.1;

            let startPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r / startMultiplier, segment * i );
            let endPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r, segment * i );

            let txtPoint = trig.radialDistribution( indParam.x, indParam.y, indParam.r * 1.2, segment * i );

            this.indicatorCoordinates.spokes.push(
                { start: startPoint, end: endPoint, txt: txtPoint, t: txtCounter }
            );

            if ( txtCounter === 23 ) {
                txtCounter = 0;
            } else {
                txtCounter++;
            }

        }

    },

    indicator: function( ctx ) {
        
        let self = this;
        let indParam = self.indicatorParams;
        let indicator = trig.radialDistribution( indParam.x, indParam.y, indParam.r, self.a );
        let indCoords = self.indicatorCoordinates;
        // console.log( 'indParam: ', indParam );
        ctx.fillStyle = 'red';
        
        ctx.lineWidth = 1;

        ctx.strokeStyle = 'rgba( 255, 0, 0, 0.5 )';

        ctx.globalCompositeOperation = 'source-over';

        ctx.strokeStyle = 'rgba( 255, 0, 0, 0.2)';
        ctx.setLineDash( [] );
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.font = '16px Tahoma';

        for (var i = 0; i < 24; i++) {
            let thisSpoke = indCoords.spokes[ i ];
            ctx.beginPath();
            ctx.moveTo( thisSpoke.start.x, thisSpoke.start.y );
            ctx.lineTo( thisSpoke.end.x, thisSpoke.end.y );
            ctx.closePath();
            ctx.stroke();

            ctx.fillText( thisSpoke.t, thisSpoke.txt.x, thisSpoke.txt.y );
        }

        
        ctx.strokeStyle = 'red';

        ctx.strokeCircle( indParam.x, indParam.y, indParam.r );

        ctx.beginPath();
        ctx.moveTo( indParam.x, indParam.y );
        ctx.lineTo( indicator.x, indicator.y );
        ctx.closePath();
        ctx.stroke();

        ctx.fillCircle( indParam.x, indParam.y, 5 );
        ctx.fillCircle( indicator.x, indicator.y, 10 );

        ctx.strokeCircle( self.pivotPoint.x, self.pivotPoint.y, self.pivotPoint.r );

        ctx.fillStyle = 'red';
        ctx.font = '20px Tahoma';

        ctx.fillText( this.orbitClock+' / '+this.orbitTime, 100, 330 );

    },

    render: function() {

        var coronaGradient = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 2 );
            coronaGradient.addColorStop(0, "rgba( 255, 255, 180, 1 )");
            coronaGradient.addColorStop(0.3, "rgba( 255, 255, 180, 0.5 )");
            coronaGradient.addColorStop(1, "rgba( 255, 255, 180, 0 )");


        var coronaGradient2 = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 10 );
            coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
            coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );

        var coronaGradient3 = ctx.createRadialGradient(this.x, this.y, this.r, this.x, this.y, this.r * 5 );
            coronaGradient2.addColorStop( 0, "rgba( 255, 255, 255, 1 )" );
            coronaGradient2.addColorStop( 1, "rgba( 255, 255, 255, 0 )" );
        
        if ( !overlayCfg.displayGlareSpikes ) {
            
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = coronaGradient2;
            ctx.fillCircle( this.x, this.y, this.r * 10 );
            
            ctx.fillStyle = coronaGradient3;
            ctx.fillCircle( this.x, this.y, this.r * 5 );

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = coronaGradient;
            ctx.fillCircle( this.x, this.y, this.r * 3 );


            ctx.translate( this.x, this.y );
            
            ctx.rotate( this.localRotation );
            ctx.globalCompositeOperation = 'lighter';
            sunSpikes.displayCorona( { xPos: 0, yPos: 0 } );

            // ctx.globalCompositeOperation = 'source-over';
            // ctx.globalCompositeOperation = 'lighten';
            var renderFlares = sunSpikes.displayCfg.flares;
            ctx.drawImage(
                sunSpikes.flareOptions.canvas,
                renderFlares.x, renderFlares.y, renderFlares.w, renderFlares.h,
                -(renderFlares.w / 2 ), -(renderFlares.h / 2 ), renderFlares.w, renderFlares.h
            );

            ctx.rotate( -this.localRotation );
            ctx.translate( -this.x, -this.y );

            // drawFeatures();
            if ( this.isVisible === true ) {
                if ( this.lensFlareOpacity < 1 ) {
                    this.lensFlareOpacity += this.lensFlareOpacityInterval;
                } else {
                    this.lensFlareOpacity = 1;
                }
            }

            if ( this.isVisible === false ) {
                if ( this.lensFlareOpacity > this.lensFlareOpacityInterval ) {
                    this.lensFlareOpacity -= this.lensFlareOpacityInterval;
                } else {
                    this.lensFlareOpacity = 0;
                }
            }
            // console.log( 'this.lensFlareOpacity: ', this.lensFlareOpacity );
            ctx.globalAlpha = this.lensFlareOpacity;

            lensFlare.setDisplayProps( theSun );
            lensFlare.displayFlares(  trig.dist( canvas.w / 2, canvas.h / 2, this.x, this.y ) );

            ctx.globalAlpha = 1;

            rainbowDot.render( this.x, this.y, this.lens, this.isVisible );

        }

    },

    init: function( canvas ) {
        this.getCanvasDimentions( canvas );
        this.setInternalCoordinates();
        this.setindicatorCoordinates();
        // sineWave.getClock( this.orbitTime, this.orbitClock );
    }
}

theSun.init( canvas );

bgCycler.init( canvas, ctx, theSun.orbitTime, theSun.orbitClock, theSun.pivotPoint );

theStars.getCanvas( canvas, ctx );
theStars.setInitialConfig( theSun );
theStars.populateArray();

let distToStageCentre = trig.dist( theSun.x, theSun.y, canvasCentreH, canvasCentreV );

function faceToStageCentreDebugLine( ctx ) {
    let currStroke = ctx.strokeStyle;
    let currFill = ctx.fillStyle;

    ctx.strokeStyle = 'rgba( 150, 150, 150, 0.6 )';
    ctx.fillStyle = 'rgba( 150, 150, 150, 1 )';

    ctx.translate( theSun.x, theSun.y );
    ctx.rotate( theSun.sunToStageCentreAngle );

    ctx.beginPath();
    ctx.moveTo( 0, 0 );
    ctx.lineTo( distToStageCentre, 0 );
    ctx.setLineDash( [5, 6] );
    ctx.stroke();
    ctx.setLineDash( [] );

    ctx.fillCircle( 0, 0, 5 );
    ctx.fillCircle( distToStageCentre, 0, 5 );

    ctx.rotate( -theSun.sunToStageCentreAngle );
    ctx.translate( -theSun.x, -theSun.y );

    let sunCtrTxt = 'Sun Centre X: '+theSun.x+' / Y: '+theSun.y;
    let stageCtrTxt = 'Stage Centre X: '+canvasCentreH+' / Y: '+canvasCentreV;

    ctx.fillText( sunCtrTxt, theSun.x + 20, theSun.y );
    ctx.fillText( stageCtrTxt, canvasCentreH + 20, canvasCentreV );

    ctx.strokeStyle = currStroke;
    ctx.fillStyle = currFill;
}

lensFlare.flareInit(
    { canvas: lensFlareCanvas, ctx: lensFlareCtx },
    { canvas: flareLayer, ctx: flareLayerCtx },
    { aperture: apertureSides }
);

lensFlare.setDisplayProps( theSun );

lensFlare.renderFlares();
// console.log( 'theSun.sunToStageCentreAngle: ', theSun.sunToStageCentreAngle );


sunSpikes.renderCfg.canvas = staticAssetCanvas;
sunSpikes.renderCfg.context = staticAssetCtx;
sunSpikes.renderCfg.debugCfg = overlayCfg;

sunSpikes.displayCfg.glareSpikesRandom.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikesRandom.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikesRandom.x = theSun.x;
sunSpikes.displayCfg.glareSpikesRandom.y = theSun.y;

sunSpikes.displayCfg.glareSpikes.canvas = coronaLayer;
sunSpikes.displayCfg.glareSpikes.context = coronaLayerCtx;
sunSpikes.displayCfg.glareSpikes.x = theSun.x;
sunSpikes.displayCfg.glareSpikes.y = theSun.y;

sunSpikes.glareSpikeOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: 2,
    majorRayLen: 200,
    minorRayLen: 200,
    majorRayWidth: 0.0005,
    minorRayWidth: 0.00005,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0,
    count: apertureSides * 2,
    blur: 5
}

sunSpikes.glareSpikeRandomOptions = {
    x: staticAssetCanvas.width / 2,
    y: staticAssetCanvas.height / 2,
    r: theSun.r / 4,
    majorRayLen: theSun.r * 1,
    minorRayLen: theSun.r * 2,
    majorRayWidth: 0.0005,
    minorRayWidth: 0.005,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0,
    count: mathUtils.randomInteger( 20, 40 ),
    blur: 10
}

sunSpikes.flareOptions = {
    canvas: flareAssetCanvas,
    context: flareAssetCtx,
    x: flareAssetCanvas.width / 2,
    y: flareAssetCanvas.height / 2,
    r: theSun.r / 1.9,
    gradientWidth: theSun.r * 10,
    rayLen: theSun.r * 10,
    rayWidth: 0.08,
    // angle: Math.PI / theSun.sunToStageCentreAngle,
    angle: 0.5,
    count: apertureSides,
    blur: 1
}

// console.log( 'sunSpikes.glareSpikeOptions.r: ', sunSpikes.glareSpikeOptions );
sunSpikes.initGlareSpikeControlInputs( canvas );

// console.log( 'sunSpikes.glareSpikeControlInputCfg: ', sunSpikes.glareSpikeControlInputCfg );

// sunSpikes.renderGlareSpikes();
// sunSpikes.renderGlareSpikesRandom();
// sunSpikes.renderFlares();

// set line widths for drawing based on scene size
theSun.lines = {
    outer: Math.floor( theSun.r / 20 ),
    inner: Math.floor( theSun.r / 40 )
}


// set corona system base size
sunCorona.rayBaseRadius = theSun.r * 1.2;


// set up proprtional measurements from face radius
var pm = proportionalMeasures.setMeasures( theSun.r );


let rainbowDot = {
    size: 100,
    x: 100 + ( 100 / 8 ),
    y: 100,
    introDotcount: 284,

    preRenderConfig: {
        canvas: secondaryStaticAssetCanvas,
        ctx: secondaryStaticAssetCtx
    },

    renderConfig: {
        canvas: canvas,
        ctx: ctx
    },

    preRender: function() {

        let c = this.preRenderConfig.ctx;
        let redX = -this.offset;
        let greenX = (this.size / 2) - this.offset;
        let blueX = this.size - this.offset;
        let groupY = this.y - ( this.size / 2 );

        c.translate( this.x, this.y );
        c.globalCompositeOperation = 'lighter';
        c.strokeStyle = 'red';

        let redGrad = c.createRadialGradient( redX, 0, 0, redX, 0, this.size );
        redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.8 )` );
        redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.8 )` );
        redGrad.addColorStop( 0.8,  `rgba( 255, 0, 0, 0.1 )` );
        redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );

        c.fillStyle = redGrad;
        c.fillCircle( redX, 0, this.size );
        // c.strokeCircle( redX, 0, this.size );

        let greenGrad = c.createRadialGradient( greenX, 0, 0, greenX, 0, this.size * 1.05 );
        greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.8 )` );
        greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.8 )` );
        greenGrad.addColorStop( 0.8,  `rgba( 0, 255, 0, 0.1 )` );
        greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );

        c.fillStyle = greenGrad; 
        c.fillCircle( greenX, 0, this.size * 1.1 );
        // c.strokeCircle( greenX, 0, this.size );

        let blueGrad = c.createRadialGradient( blueX, 0, 0, blueX, 0, this.size );
        blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.8 )` );
        blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.8 )` );
        blueGrad.addColorStop( 0.8,  `rgba( 0, 0, 255, 0.1 )` );
        blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );

        c.fillStyle = blueGrad; 
        c.fillCircle( blueX, 0, this.size );
        // c.strokeCircle( blueX, 0, this.size );

        c.translate( -this.x, -this.y );

        this.renderConfig.x = this.x - ( this.offset + this.size );
        this.renderConfig.y = this.y -this.size;
        this.renderConfig.w = this.size * 3;
        this.renderConfig.h = this.size * 2;

        // c.strokeRect( this.renderConfig.x, this.renderConfig.y, this.renderConfig.w, this.renderConfig.h );

    },

    render: function( x, y, lens, visible ) {
        let source = this.preRenderConfig.canvas;
        let renderConfig = this.renderConfig;
        let c = renderConfig.ctx;
        let count = this.introDotcount;
        let hScale = renderConfig.h;
        let lensCfg = lens;
        let lensScale = 0;
        let widthScale = 40;
        ;
        let rotationInterval = ( Math.PI * 2 ) / count;
        let opacityInterval = 1 / (count / 8);

        if ( lens.sunLensIntersectingFlag === true ) {
            lensScale = 1 - lensCfg.currOverlapScale;
            // console.log( 'lensScale: ', lensScale )
        } else {
            lensScale = 1;
        }

        let computedX = easing.easeInExpo( lensScale, 0, 1, 1 );
        let computedR = 1200 * computedX;
        // if ( visible === false ) {
            c.translate( x, y );
            c.scale( -1, 1 );
            let currRotation = 0;
            let currMix = c.globalCompositeOperation;
            c.globalCompositeOperation = 'lighter';


            // let opacityInterval = 1 / (count / 4);

            let currOpacity = 1;

            for (var i = count - 1; i >= 0; i--) {

                let currRotation = i * rotationInterval;

                if( i >= 0 && i < count / 8 ) {
                    currOpacity = 1 - ( i * opacityInterval );
                }

                if( i > count / 8 && i < count / 4  ) {
                    currOpacity = 0;
                }

                if( i >= ( (count / 4) + (count / 8) ) && i < ( count / 2 ) ) {
                    currOpacity = ( i - ( (count / 4) + (count / 8) ) ) * opacityInterval;
                }

                if( i >= ( count / 2 ) && i < ( count / 2 ) + ( count / 8 ) ) {
                    currOpacity = 1 - ( ( i - ( count / 2 ) ) * opacityInterval );
                }

                if( i > ( count / 2 ) + ( count / 8 )  && i > count - ( count / 8 ) ) {
                    currOpacity = 0;
                }

                if( i >= count - ( count / 8 ) && i < count ) {
                    currOpacity = ( i - ( count - ( count / 8 ) ) ) * opacityInterval;
                }

                c.globalAlpha = currOpacity;
                c.rotate( currRotation );
                c.drawImage(
                    source,
                    renderConfig.x, renderConfig.y, renderConfig.w, renderConfig.h,
                     100 + ( lens.maxD * computedX ), -( ( hScale * opacityInterval ) / 2 ), renderConfig.w * ( widthScale * opacityInterval ), ( hScale * opacityInterval )
                );
                

                c.globalAlpha = 1;
                

                c.rotate( -currRotation );

            }
            c.scale( -1, 1 );
            c.translate( -x, -y );
            c.globalCompositeOperation = currMix;


        // }

        
    }


}

rainbowDot.offset = rainbowDot.size / 8;

rainbowDot.preRender();

// let rainbowDotSize = 100;
// let rainbowX = 200;
// let rainbowY = 200;
// secondaryStaticAssetCtx.translate( rainbowDot.x, rainbowDot.y );
// // secondaryStaticAssetCtx.scale( 5, 1 );
// secondaryStaticAssetCtx.save();
// let offset = rainbowDotSize / 8;
// secondaryStaticAssetCtx.globalCompositeOperation = 'lighter';


// let redX = -offset;
// let redY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let greenX = (rainbowDotSize / 2) - offset;
// let greenY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let blueX = rainbowDotSize - offset;
// let blueY = rainbowY - ( rainbowDotSize / 2 ) - offset;

// let redGrad = secondaryStaticAssetCtx.createRadialGradient( redX, 0, 0, redX, 0, rainbowDot.size );
// redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.8 )` );
// redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.8 )` );
// redGrad.addColorStop( 0.8,  `rgba( 255, 0, 0, 0.1 )` );
// redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );

// secondaryStaticAssetCtx.fillStyle = redGrad; 
// secondaryStaticAssetCtx.fillCircle( redX, 0, rainbowDot.size );

// let greenGrad = secondaryStaticAssetCtx.createRadialGradient( greenX, 0, 0, greenX, 0, rainbowDot.size * 1.05 );
// greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.8 )` );
// greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.8 )` );
// greenGrad.addColorStop( 0.8,  `rgba( 0, 255, 0, 0.1 )` );
// greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );

// secondaryStaticAssetCtx.fillStyle = greenGrad; 
// secondaryStaticAssetCtx.fillCircle( greenX, 0, rainbowDot.size * 1.1 );

// let blueGrad = secondaryStaticAssetCtx.createRadialGradient( blueX, 0, 0, blueX, 0, rainbowDot.size );
// blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.8 )` );
// blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.8 )` );
// blueGrad.addColorStop( 0.8,  `rgba( 0, 0, 255, 0.1 )` );
// blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );

// secondaryStaticAssetCtx.fillStyle = blueGrad; 
// secondaryStaticAssetCtx.fillCircle( blueX, 0, rainbowDot.size );

// secondaryStaticAssetCtx.restore();



// set up modifier system and connect to proportional measurements
// var muscleModifiers = muscleModifier.createModifiers( pm );
// muscleModifier.setRangeInputs( muscleModifiers );


// init eye blink track
// trackPlayer.loadTrack( 5, 'blink', seq, muscleModifiers );


// expression events

    // $( '.expression-smile' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'smile', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'smile' );
    // } );

    // $( '.expression-smile-big' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'bigSmile', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'bigSmile' );
    // } );

    // $( '.expression-ecstatic' ).click( function( e ){
    //     trackPlayer.loadTrack( 30, 'ecstatic', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'ecstatic' );
    // } );

    // $( '.expression-sad' ).click( function( e ){
    //     trackPlayer.loadTrack( 60, 'sad', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'sad' );
    // } );

    // $( '.expression-very-sad' ).click( function( e ){
    //     trackPlayer.loadTrack( 60, 'bigSad', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'bigSad' );
    // } );

    // $( '.expression-blink' ).click( function( e ){
    //     trackPlayer.loadTrack( 10, 'blink', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'blink' );
    // } );

    // $( '.expression-reset' ).click( function( e ){
    //     trackPlayer.loadTrack( 10, 'reset', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'reset' );
    // } );


// sequence button events

    // $( '.sequence-yawn' ).click( function( e ){
    //     trackPlayer.loadTrack( 300, 'yawn', seq, muscleModifiers );
    //     trackPlayer.startTrack( 'yawn' );
    // } );


// control panel events
    

    // facial feature panel events
    // var $featurePageParent = $( '[ data-page="page-elements" ]');

    // var $featureInputs = $featurePageParent.find( '[ data-face ]' );
    // $featureInputs.on( 'input', function( e ) {
    //     var $self = $( this );
    //     var getModifier = $self.data( 'modifier' );
    //     var getMultiplier = $self.data( 'value-multiplier' );

    //     var result = parseFloat( $self.val() * getMultiplier );
    //     muscleModifiers[ getModifier ].curr = result;
    //     $self.closest( '.control--panel__item' ).find( 'output' ).html( result );
    // } );

    // spike Glare panel events

    let $spikeGlareElParent = $( '.js-glare-spike-effects' );
    let $spikeGlareInputs = $spikeGlareElParent.find( '.range-slider' );
    let spikeGlareControlInputLink = {
        spikeCountInput: 'count',
        spikeRadiusInput: 'r',
        spikeMajorSize: 'majorRayLen',
        spikeMinorSize: 'minorRayLen',
        spikeMajorWidth: 'majorRayWidth',
        spikeMinorWidth: 'minorRayWidth',
        spikeBlurAmount: 'blur'
    }

    $spikeGlareInputs.on( 'input', function( e ) {
        const $self = $( this )[ 0 ];
        
        const thisOpt = spikeGlareControlInputLink[ $self.id ];
        const thisOptCfg = sunSpikes.glareSpikeControlInputCfg[ thisOpt ];
        let $selfVal = parseFloat( $self.value );

        // console.log( '$selfVal: ', $selfVal );
        // console.log( '$self.id: ', $self.id );
        // console.log( 'thisOpt: ', thisOpt );
        // console.log( 'thisOptCfg: ', thisOptCfg );
        // console.log( 'thisOptCfg: ', result );

        sunSpikes.glareSpikeOptions[ thisOpt ] = $selfVal;
        sunSpikes.clearRenderCtx();
        sunSpikes.renderGlareSpikes();
    } );

// look target events
    // var $LookTargetInputs = $featurePageParent.find( '.range-slider[ data-control="look" ]' );
    // $LookTargetInputs.on( 'input', function( e ) {
    //     var $self = $( this );
    //     var getModifier = $self.data( 'modifier' );
    //     var getMultiplier = $self.data( 'value-multiplier' );
    //     var thisAxis = getModifier.indexOf( 'X' ) != -1 ? 'x' : getModifier.indexOf( 'Y' ) != -1 ? 'y' : getModifier.indexOf( 'Z' ) != -1 ? 'z' : false;
    //     // console.log( 'raw value: ', $self.val() );
    //     // console.log( 'getMultiplier: ', getMultiplier );
    //     // console.log( 'raw result: ', $self.val() * getMultiplier );

    //     if ( thisAxis === 'z' ) {
    //         aimConstraint.setCurrentSize();
    //     }
    //     var result = parseFloat( $self.val() * getMultiplier );
    //     aimConstraint.target.coords.curr[ thisAxis ] = result;
    //     $self.parent().find( 'output' ).html( result );
    //     // console.log( 'wrong one firing' );
    // } );


function drawOverlay() {

    if ( overlayCfg.displayOverlay ) {
        // draw reference points
        ctx.strokeStyle = theSun.colours.debug.lines;
        ctx.lineWidth = 1;
        ctx.setLineDash([1, 6]);

        if ( overlayCfg.displayCentreLines ) {

            // draw centre lines
            ctx.line(
                theSun.x - ( theSun.r * 2 ), theSun.y,
                theSun.x + ( theSun.r * 2 ), theSun.y
            );


            ctx.line(
                theSun.x, theSun.y - ( theSun.r * 2 ),
                theSun.x, theSun.y + ( theSun.r * 2 )
            );

            ctx.setLineDash( [] );

        }



        if ( overlayCfg.displaySunToStage ) {
            faceToStageCentreDebugLine( ctx );
        }

    }
}





// sunSpikes.displayGlareSpikesRandom();



function drawtheSun() {
    ctx.lineWidth = theSun.lines.outer;
    
    theSun.render(); 
}

function updateCycle() {
    // drawFaceGimbleControl();

    // if ( mouseDown ) {
    //     if ( !aimConstraint.target.renderConfig.isHit ) {
    //         aimConstraint.checkMouseHit();
    //     }
        
    //     if ( aimConstraint.target.renderConfig.isHit ) {
    //         aimConstraint.mouseMoveTarget();
    //     }
    // }

    bgCycler.updatePhaseClock();
    bgCycler.render( theSun );
    theStars.update();

    drawtheSun();
    drawOverlay();
    sineWave.modulator();
    theSun.updatePosition();
    theSun.indicator( ctx );
    // trackPlayer.updateTrackPlayer( seq, muscleModifiers );

}

function clearCanvas(ctx) {
    // cleaning
    ctx.clearRect(0, 0, canW, canH);
    // ctx.clearRect( bufferClearRegion.x, bufferClearRegion.y, bufferClearRegion.w, bufferClearRegion.h );

    // blitCtx.clearRect( 0, 0, canW, canH );


    // ctx.fillStyle = 'rgba( 0, 0, 0, 0.1 )';
    // ctx.fillRect( 0, 0, canW, canH );

    // set dirty buffer
    // resetBufferClearRegion();
}

/////////////////////////////////////////////////////////////
// runtime
/////////////////////////////////////////////////////////////
function update() {

    // loop housekeeping
    runtime = undefined;

    // mouse tracking
    lastMouseX = mouseX; 
    lastMouseY = mouseY; 

    // clean canvas
    clearCanvas( ctx );

    // updates
    updateCycle();

    // looping
    animation.state === true ? (runtimeEngine.startAnimation(runtime, update), counter++) : runtimeEngine.stopAnimation(runtime);

}
/////////////////////////////////////////////////////////////
// End runtime
/////////////////////////////////////////////////////////////

if (animation.state !== true) {
    animation.state = true;
    update();
}

$( '.js-attachFlareCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).remove( lensFlareCanvas );
    
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( lensFlareCanvas );
    
    }

} );

$( '.js-attachRainbowCanvas' ).click( function( event ){

    if ( $( this ).hasClass( 'is-active' ) ){

        $( this ).removeClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).remove( secondaryStaticAssetCanvas );
    } else {
    
        $( this ).addClass( 'is-active' );
        $( '.asset-canvas-display-layer' ).addClass( 'attachedCanvas' ).append( secondaryStaticAssetCanvas );
    
    }

} );

$( '.js-close-osc-canvas' ).click( function( event ){

    $( '.osc-canvas-display-btn' ).removeClass( 'is-active' );
    $( '.asset-canvas-display-layer' ).removeClass( 'attachedCanvas' ).find( 'canvas' ).remove();

} );

},{"./animation.js":6,"./backgroundCycler.js":8,"./canvasApiAugmentation.js":10,"./colorUtils.js":11,"./debugUtils.js":13,"./easing.js":14,"./environment.js":16,"./gears.js":18,"./lensFlare.js":19,"./mathUtils.js":20,"./overlay.js":23,"./proportionalMeasures.js":24,"./sineWaveModulator.js":25,"./sunCorona.js":26,"./sunSpikes.js":27,"./theStars.js":28,"./trigonomicUtils.js":29,"dbly-linked-list":1,"object-path":5}],8:[function(require,module,exports){
let backgrounds = require( './backgrounds.js' );
let trig = require( './trigonomicUtils.js' ).trigonomicUtils;
let backgroundData = {
	params: {},
	bgDataSet: []
};

function createBackgroundDataset() {

	backgroundData.params.len = backgrounds.length;

	for (var i = 0; i < backgroundData.params.len; i++) {
		let thisBg = backgrounds[ i ];
		backgroundData.bgDataSet.push( { len: thisBg.length } );
	}

};
createBackgroundDataset();


let backgroundCycler = {
	bgData: backgroundData,
	backgrounds: backgrounds,
	orbitCentreX: 0,
	orbitCentreY: 0,
	orbitRadius: 0,
	cycleData: {
		totalTime: 0,
		phaseTime: 0,
		remainingTime: 0,
		phaseClock: 0,
		phaseInterval: 0,
		alphaInterval: 0,
		currAlpha: 0,
		currUnderBg: 0,
		currOverBg: 0
	},
	renderParams: {},
	

	getRenderCanvas: function( canvas, context, orbitCoordinates ) {
		this.renderParams.canvas = canvas;
		this.renderParams.ctx = context;
		this.orbitCentreX = orbitCoordinates.x;
		this.orbitCentreY = orbitCoordinates.y;
		this.orbitCentreR = orbitCoordinates.r;
	},

	getCycleTime: function( cycleTime ) {
		this.cycleData.totalTime = cycleTime;
		this.cycleData.phaseTime = Math.floor( cycleTime / this.bgData.params.len );
		this.cycleData.remainingTime = cycleTime - ( this.cycleData.phaseTime * this.bgData.params.len  );
		this.cycleData.alphaInterval = 1 / this.cycleData.phaseTime;
	},


	setInitialState: function( curr ) {

		let currPhase = Math.floor( curr / this.cycleData.phaseTime );
		let phaseRemainder = curr - ( currPhase * this.cycleData.phaseTime );
		let tempCurrPhase = currPhase - 6 < 0 ? this.bgData.params.len + ( currPhase - 6 ) : currPhase - 6;
		this.cycleData.currUnderBg = tempCurrPhase === 0 ? this.bgData.params.len - 1 : tempCurrPhase - 1;
		this.cycleData.currOverBg = tempCurrPhase;
		this.cycleData.phaseClock = phaseRemainder;
		this.cycleData.phaseInterval = ( this.cycleData.totalTime / this.bgData.params.len  ) / this.cycleData.phaseTime;

	},
	
	resetCurrAlpha: function() {
		this.cycleData.currAlpha = 0;
	},
	
	updateCurrAlpha: function() {
		this.cycleData.currAlpha += this.cycleData.alphaInterval;
	},

	updatePhaseClock: function() {
		if ( this.cycleData.phaseClock > this.cycleData.phaseInterval ) {
			this.cycleData.phaseClock -= this.cycleData.phaseInterval;
			this.updateCurrAlpha();
		} else {

			this.cycleData.phaseClock = this.cycleData.phaseTime;
			this.updateBg();
			this.resetCurrAlpha();
		}
		// this.updateRemainingTime();
	},

	updateRemainingTime: function(){

		if ( this.cycleData.remainingTime === 0 ) {
			this.cycleData.remainingTime = this.cycleData.totalTime;
		} else {
			if ( this.cycleData.remainingTime >= this.cycleData.phaseTime ) {
				this.cycleData.remainingTime -= this.cycleData.phaseTime;
			}
		}

	},

	updateBg: function() {

		if ( this.cycleData.currUnderBg === this.bgData.params.len - 1 ) {
			this.cycleData.currUnderBg = 0;
		} else {
			this.cycleData.currUnderBg += 1;
		}

		if ( this.cycleData.currOverBg === this.bgData.params.len - 1 ) {
			this.cycleData.currOverBg = 0;
		} else {
			this.cycleData.currOverBg += 1;
		}

		if ( this.cycleData.currOverBg === this.bgData.params.len - 1 ) {
			this.cycleData.phaseClock = this.cycleData.phaseTime + this.cycleData.remainingTime;
		}
		// console.log( 'this.cycleData.phaseClock: ', this.cycleData.phaseClock );

	},

    render: function( sun ) {

        let c = this.renderParams.ctx;
        let canvas = this.renderParams.canvas;
        let currUnderBg = this.backgrounds[ this.cycleData.currUnderBg ];
        let currUnderBgData = this.bgData.bgDataSet[ this.cycleData.currUnderBg ].len;
        let currOverBg = this.backgrounds[ this.cycleData.currOverBg ];
        let currOverBgData = this.bgData.bgDataSet[ this.cycleData.currOverBg ].len;
        let radialDist = trig.dist( sun.x, sun.y, this.orbitCentreX, this.orbitCentreY ) * 2.5;

        c.globalCompositeOperation = 'source-over';
        c.globalAlpha = 1;

        // let underGradient = c.createLinearGradient(0, 0, 0, canvas.height );
        let underGradient = c.createRadialGradient( sun.x, sun.y, radialDist, sun.x, sun.y, 0 );

        // for (var i = 0; i < currUnderBgData; i++) {
        // 	underGradient.addColorStop( currUnderBg[ i ].pos, currUnderBg[ i ].colour );
        // }
        for (let i = currUnderBgData - 1; i >= 0; i--) {
        	underGradient.addColorStop( currUnderBg[ i ].pos, currUnderBg[ i ].colour );
        }

        c.fillStyle = underGradient;
        c.fillRect( 0, 0, canvas.width, canvas.height );

        c.globalAlpha = this.cycleData.currAlpha;

        // let overGradient = c.createLinearGradient(0, 0, 0, canvas.height );
        let overGradient = c.createRadialGradient( sun.x, sun.y, radialDist, sun.x, sun.y, 0 );
        // for (var i = 0; i < currOverBgData; i++) {
        // 	overGradient.addColorStop( currOverBg[ i ].pos, currOverBg[ i ].colour );
        // }
        for (let i = currOverBgData - 1; i >= 0; i--) {
        	overGradient.addColorStop( currOverBg[ i ].pos, currOverBg[ i ].colour );
        }
        c.fillStyle = overGradient;
        c.fillRect( 0, 0, canvas.width, canvas.height );

        c.globalAlpha = 1;
        let currBgHour = this.cycleData.currUnderBg - 1;
        let currHour = this.cycleData.currUnderBg > 12 ? true : false;
        let hourText = ( ( currHour === true ? currBgHour - 12 : currBgHour ) + 1) + ( currHour === true ? 'pm' : 'am' ); 

        c.fillStyle = 'red';
        c.font = '20px Tahoma';
        c.fillText( hourText, 100, 300 );


    
    },

    init: function( canvas, context, cycleTime, currPos, orbitData ) {
    	this.getRenderCanvas( canvas, context, orbitData );
    	this.getCycleTime( cycleTime );
    	this.setInitialState( currPos );
    }



}

module.exports = backgroundCycler;
},{"./backgrounds.js":9,"./trigonomicUtils.js":29}],9:[function(require,module,exports){
let backgrounds = [
	//// black ( mid-night )
	[
		{ colour: 'rgb(0, 0, 12)', pos: 0 },
		{ colour: 'rgb(0, 0, 12)', pos: 1 }
	],
	[
		{ colour: 'rgb(2, 1, 17)', pos: 0.85 },
		{ colour: 'rgb(25, 22, 33)', pos: 1 }
	],
	[
		{ colour: 'rgb(2, 1, 17)', pos: 0.6 },
		{ colour: 'rgb(32, 32, 44)', pos: 1 }
	],
	[
		{ colour: 'rgb(2, 1, 17)', pos: 0.1 },
		{ colour: 'rgb(58, 58, 82)', pos: 1 }
	],
	[
		{ colour: 'rgb(32, 32, 44)', pos: 0 },
		{ colour: 'rgb(81, 81, 117)', pos: 1 }
	],
	[
		{ colour: 'rgb(64, 64, 92)', pos: 0 },
		{ colour: 'rgb(111, 113, 170)', pos: 0.8 },
		{ colour: 'rgb(138, 118, 171)', pos: 1 }
	],
	[
		{ colour: 'rgb(74, 73, 105)', pos: 0 },
		{ colour: 'rgb(112, 114, 171)', pos: 0.5 },
		{ colour: 'rgb(205, 130, 160)', pos: 1 }
	],
	[
		{ colour: 'rgb(117, 122, 191)', pos: 0 },
		{ colour: 'rgb(133, 131, 190)', pos: 0.6 },
		{ colour: 'rgb(234, 176, 209)', pos: 1 }
	],
	[
		{ colour: 'rgb(130, 173, 219)', pos: 0 },
		{ colour: 'rgb(235, 178, 177)', pos: 1 }
	],
	[

		{ colour: 'rgb(148, 197, 248)', pos: 0.01 },
		{ colour: 'rgb(166, 230, 255)', pos: 0.7 },
		{ colour: 'rgb(177, 181, 234)', pos: 1 }
	],
	[
		{ colour: 'rgb(183, 234, 255)', pos: 0 },
		{ colour: 'rgb(148, 223, 255)', pos: 1 }
	],

	[
		{ colour: 'rgb(155,226,254)', pos: 0 },
		{ colour: 'rgb(103,209,251)', pos: 1 }
	],

	[
		{ colour: 'rgb(144,223,254)', pos: 0 },
		{ colour: 'rgb(56,163,209)', pos: 1 }
	],
	
	[
		{ colour: 'rgb(144,223,235)', pos: 0 },
		{ colour: 'rgb(36,111,168)', pos: 1 }
	],

	[
		{ colour: 'rgb(45,145,194)', pos: 0 },
		{ colour: 'rgb(30,82,142)', pos: 1 }
	],

	[
		{ colour: 'rgb(36,115,171)', pos: 0 },
		{ colour: 'rgb(30,82,142)', pos: 0.7 },
		{ colour: 'rgb(91,121,131)', pos: 1 }
	],

	[
		{ colour: 'rgb(30,82,142)', pos: 0 },
		{ colour: 'rgb(38,88,137)', pos: 0.5 },
		{ colour: 'rgb(157,166,113)', pos: 1 }
	],

	[
		{ colour: 'rgb(30,82,142)', pos: 0 },
		{ colour: 'rgb(114,138,124)', pos: 0.5 },
		{ colour: 'rgb(233,206,93)', pos: 1 }
	],

	[
		{ colour: 'rgb(21,66,119)', pos: 0 },
		{ colour: 'rgb(87,110,113)', pos: 0.3 },
		{ colour: 'rgb(225,196,94)', pos: 1 }
		// { colour: 'rgb(178,99,57)', pos: 1 }
	],

	[
		{ colour: 'rgb(22,60,82)', pos: 0 },
		{ colour: 'rgb(79,79,71)', pos: 0.3 },
		{ colour: 'rgb(197,117,45)', pos: 1 }
		// { colour: 'rgb(183,73,15)', pos: 1 }
		// { colour: 'rgb(47,17,7)', pos: 1 }
	],

	[
		{ colour: 'rgb(7,27,38)', pos: 0 },
		{ colour: 'rgb(7,27,38)', pos: 0.3 },
		{ colour: 'rgb(138,59,18)', pos: 1 }
		// { colour: 'rgb(36,14,3)', pos: 1 }
	],

	[
		{ colour: 'rgb(1,10,16)', pos: 0.3 },
		{ colour: 'rgb(89,35,11)', pos: 1 }
		// { colour: 'rgb(47,17,7)', pos: 1 }
	],

	[
		{ colour: 'rgb(9,4,1)', pos: 0.5 },
		{ colour: 'rgb(75,29,6)', pos: 1 }
	],

	[
		{ colour: 'rgb(0,0,12)', pos: 0.8 },
		{ colour: 'rgb(21,8,0)', pos: 1 }
	]

];

module.exports = backgrounds;
},{}],10:[function(require,module,exports){
/**
* @description extends Canvas prototype with useful drawing mixins
* @kind constant
*/
var canvasDrawingApi = CanvasRenderingContext2D.prototype;

/**
* @augments canvasDrawingApi
* @description draw circle API
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.circle = function (x, y, r) {
	this.beginPath();
	this.arc(x, y, r, 0, Math.PI * 2, true);
};

/**
* @augments canvasDrawingApi
* @description API to draw filled circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.fillCircle = function (x, y, r, context) {
	this.circle(x, y, r, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked circle
* @param {number} x - origin X of circle.
* @param {number} y - origin Y of circle.
* @param {number} r - radius of circle.
*/
canvasDrawingApi.strokeCircle = function (x, y, r) {
	this.circle(x, y, r);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.ellipse = function (x, y, w, h) {
	this.beginPath();
	for (var i = 0; i < Math.PI * 2; i += Math.PI / 16) {
		this.lineTo(x + Math.cos(i) * w / 2, y + Math.sin(i) * h / 2);
	}
	this.closePath();
};

/**
* @augments canvasDrawingApi
* @description API to draw filled ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.fillEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h, context);
	this.fill();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked ellipse.
* @param {number} x - origin X of ellipse.
* @param {number} y - ofigin Y or ellipse.
* @param {number} w - width of ellipse.
* @param {number} w - height of ellipse.
*/
canvasDrawingApi.strokeEllipse = function (x, y, w, h) {
	this.ellipse(x, y, w, h);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw line between 2 vector coordinates.
* @param {number} x1 - X coordinate of vector 1.
* @param {number} y1 - Y coordinate of vector 1.
* @param {number} x2 - X coordinate of vector 2.
* @param {number} y2 - Y coordinate of vector 2.
*/
canvasDrawingApi.line = function (x1, y1, x2, y2) {
	this.beginPath();
	this.moveTo(x1, y1);
	this.lineTo(x2, y2);
	this.stroke();
	this.beginPath();
};

/**
* @augments canvasDrawingApi
* @description API to draw stroked regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.strokePoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.stroke();
	ctx.translate( -cx, -cy );
}

/**
* @augments canvasDrawingApi
* @description API to draw filled regular polygon shape.
* @param {number} x - X coordinate of the polygon origin.
* @param {number} y - Y coordinate of the polygon origin.
* @param {number} r - Radius of the polygon.
* @param {number} s - Number of sides.
* @param {number} ctx - The canvas context to output.
*/
canvasDrawingApi.fillPoly = function ( x, y, r, s, ctx ) {
	
	var sides = s;
	var radius = r;
	var cx = x;
	var cy = y;
	var angle = 2 * Math.PI / sides;
	
	ctx.beginPath();
	ctx.translate( cx, cy );
	ctx.moveTo( radius, 0 );          
	for ( var i = 1; i <= sides; i++ ) {
		ctx.lineTo(
			radius * Math.cos( i * angle ),
			radius * Math.sin( i * angle )
		);
	}
	ctx.fill();
	ctx.translate( -cx, -cy );
	
}
module.exports = canvasDrawingApi;
},{}],11:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var colorUtils = {
	/**
 * provides color util methods.
 */
	rgb: function rgb(red, green, blue) {
		return 'rgb(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ')';
	},
	rgba: function rgba(red, green, blue, alpha) {
		return 'rgba(' + mathUtils.clamp(Math.round(red), 0, 255) + ', ' + mathUtils.clamp(Math.round(green), 0, 255) + ', ' + mathUtils.clamp(Math.round(blue), 0, 255) + ', ' + mathUtils.clamp(alpha, 0, 1) + ')';
	},
	hsl: function hsl(hue, saturation, lightness) {
		return 'hsl(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%)';
	},
	hsla: function hsla(hue, saturation, lightness, alpha) {
		return 'hsla(' + hue + ', ' + mathUtils.clamp(saturation, 0, 100) + '%, ' + mathUtils.clamp(lightness, 0, 100) + '%, ' + mathUtils.clamp(alpha, 0, 1) + ')';
	}
};

module.exports.colorUtils = colorUtils;
},{"./mathUtils.js":20}],12:[function(require,module,exports){
let overlayCfg = require('./overlay.js').overlayCfg;
let sunSpikes = require('./sunSpikes.js');



$( document ).ready( function(){

	let pageAnimClassList = 'is-active to-left from-left to-right from-right';
		$( '.js-page-select' ).click( function( e ){
		let $thisButton = $( this );
		let selectsPage = $thisButton.attr( 'data-page-select' );
		let $currentPage = $( '.control--panel__page.is-active');
		let currentPageOrder = $( '.control--panel__page' ).attr( 'data-page-order' );
		let $newPage = $( '[data-page="'+selectsPage+'"]');
		let newPageOrder = $newPage.attr( 'data-page-order' );
		let isNewPageOrderGreater = newPageOrder > currentPageOrder ? true : false;
		let introClass = isNewPageOrderGreater ? 'from-right' : 'from-left';
		let outroClass = isNewPageOrderGreater ? 'to-left' : 'to-right';
		if ( $thisButton.hasClass( 'is-active') ) {
			return;
		} else {

			$currentPage.removeClass( pageAnimClassList ).addClass( outroClass );
			$thisButton.addClass( 'is-active' ).siblings().removeClass( 'is-active' );
			$newPage.addClass( 'is-active '+introClass );
		}

	} );




	let $controlPages = $( '.control--panel__page' );
	let $controlSections = $( '.control--panel__section' );
	let numSections = $controlSections.length - 1;
	$controlSections.addClass( '.is-active' );
	$controlPages.addClass( '.is-active' );

	$controlPages.css( {
		'transition-duration': '0s',
		'height': 'auto',
		'position': 'relative',
		'overflow': 'initial'
	} );

	for (let i = numSections; i >= 0; i--) {
		let $thisSection = $controlSections.eq( i );
		let $thisAnimatedEl = $thisSection.find( 'fieldset' );
		$thisAnimatedEl.css( {
			'transition-duration': '0s',
			'height': 'auto'
		} );

		let getHeight =  $thisAnimatedEl.outerHeight();

		$thisAnimatedEl.removeAttr( 'style' );

		$thisSection.attr('data-open-height', getHeight );
	}

	$controlSections.removeClass( '.is-active' );
	$controlPages.removeClass( '.is-active' );
	$controlPages.removeAttr( 'style' );


	$( '.js-section-toggle' ).click( function( e ){
		let $parent = $( this ).closest( '.control--panel__section' );
		let parentActive = $parent.hasClass( 'is-active' ) ? true : false;
		let thisHeight = $parent.attr( 'data-open-height' );
		if ( parentActive ) {
			$parent.removeClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': '0'
			} ) ;
		} else {
			$parent.addClass( 'is-active' ).find( 'fieldset' ).css( {
				'height': thisHeight+'px'
			} );
		}

	} );


	$( '.button-list button' ).click( function( e ){
		let $el = $( this );
		let $siblings = $el.closest( '.button-list' ).find( 'button' );
		let isActive = $el.hasClass( 'is-active' ) ? true : false;

		if ( isActive ) {
			$el.removeClass( 'is-active' );
		} else {
			$siblings.removeClass( 'is-active' );
			$el.addClass( 'is-active' );
		}

	} );

	// get current selected animation speed
	// let initSpeedVal = $( '.js-speed-list button.selected').attr( 'data-anim-speed' );
	// console.log( 'initSpeedVal: ', initSpeedVal );
	// $( '.js-custom-anim-speed-input' ).val( initSpeedVal );

	// $( '.js-custom-anim-speed-input' ).on( 'blur', function( e) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get min/max value
	// 	let maxVal = $el.attr( 'max' );
	// 	let minVal = $el.attr( 'min' );
		// get value
	// 	let value = $el.val();

	// 	if ( value > maxVal ) {
	// 		$el.val( maxVal );
	// 	} else {
	// 		if ( value < minVal ) {
	// 			$el.val( minVal );
	// 		} else {
	// 			$el.val( parseFloat( value ).toFixed( 1 ) );
	// 		}
	// 	}
	// } );


	// $( '.js-anim-speed' ).click( function( e ) {
	// 	// get element
	// 	let $el = $( this );
	// 	// get value
	// 	let value = $el.attr( 'data-anim-speed' );

	// 	$( '.js-custom-anim-speed-input' ).val( value );
	// 	$el.off();

	// } );


	// slider controls for individual facial features
	$( '.page-elements .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get min/max value
		let maxVal = $el.attr( 'max' );
		let minVal = $el.attr( 'min' );
		// get value
		let value = $el.val();
		let output = 0;

		if ( minVal < 0 ) {
			value < 0 ? output = value / minVal : output = ( value / maxVal ) * -1;
		} else {
			output = value / maxVal;
		}

		$outputEl.html( parseFloat( output ).toFixed( 2 ) );
	} );


	// slider controls for glare spikes
	$( '.js-glare-spike-effects .range-slider' ).on( 'input', function( e ) {
		console.log( 'slider processing is firing' );
		// get element
		let $el = $( this );
		// 	// get output el
		let $outputEl = $el.closest( '.control--panel__item' ).find( 'output' );
		// get value
		let value = $el.val();
		// flip value if range is flipped (display purposes only)
		$outputEl.html( parseFloat( value ).toFixed( 2 ) );
	} );



	$( '.js-display-controls button' ).click( function( e ){
		var $el = $( this );
		var $siblings = $el.siblings();
		var isActive = $el.hasClass( 'is-active' ) ? true : false;

		var thisDisplayItem = $el.data( 'display-item' );

		if ( isActive ) {
			$el.removeClass( 'is-active' );
			overlayCfg[ thisDisplayItem ] = false;

			if ( !$siblings.hasClass( 'is-active' ) ) {
				overlayCfg.displayOverlay = false;
			}


		} else {
			$el.addClass( 'is-active' );

			if ( !overlayCfg.displayOverlay ) {
				overlayCfg.displayOverlay = true;
			}

			overlayCfg[ thisDisplayItem ] = true;
		}

		if ( thisDisplayItem === 'displayGlareSpikes' ) {
			sunSpikes.clearRenderCtx();
			sunSpikes.renderGlareSpikes();
		}

	} );


} );

},{"./overlay.js":23,"./sunSpikes.js":27}],13:[function(require,module,exports){
var mathUtils = require('./mathUtils.js').mathUtils;

var lastCalledTime = void 0;

var debug = {

    helpers: {
        getStyle: function getStyle(element, property) {
            return window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(property) : element.style[property.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            })];
        },
        invertColor: function invertColor(hex, bw) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            var r = parseInt(hex.slice(0, 2), 16),
                g = parseInt(hex.slice(2, 4), 16),
                b = parseInt(hex.slice(4, 6), 16);
            if (bw) {
                // http://stackoverflow.com/a/3943023/112731
                return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
            }
            // invert color components
            r = (255 - r).toString(16);
            g = (255 - g).toString(16);
            b = (255 - b).toString(16);
            // pad each with zeros and return
            return "#" + padZero(r) + padZero(g) + padZero(b);
        }

    },

    display: function display(displayFlag, message, param) {
        var self = this;
        if (self.all === true || displayFlag === true) {
            console.log(message, param);
        }
    },

    debugOutput: function debugOutput(canvas, context, label, param, outputNum, outputBounds) {
        ;

        if (outputBounds) {
            var thisRed = mathUtils.map(param, outputBounds.min, outputBounds.max, 255, 0, true);
            var thisGreen = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            // var thisBlue = mathUtils.map(param, outputBounds.min, outputBounds.max, 0, 255, true);
            var thisColor = 'rgb( ' + thisRed + ', ' + thisGreen + ', 0 )';

            // console.log( 'changing debug color of: '+param+' to: '+thisColor );
        } else {
            var thisColor = "#efefef";
        }

        var vPos = outputNum * 50 + 50;
        context.textAlign = "left";
        context.font = "14pt arial";
        context.fillStyle = thisColor;

        context.fillText(label + param, 50, vPos);
    },

    calculateFps: function calculateFps() {
        if (!lastCalledTime) {
            lastCalledTime = window.performance.now();
            return 0;
        }
        var delta = (window.performance.now() - lastCalledTime) / 1000;
        lastCalledTime = window.performance.now();
        return 1 / delta;
    },

    flags: {
        all: false,
        parts: {
            clicks: true,
            runtime: true,
            update: false,
            killConditions: false,
            animationCounter: false,
            entityStore: false,
            fps: true
        }
    }
};

module.exports.debug = debug;
module.exports.lastCalledTime = lastCalledTime;
},{"./mathUtils.js":20}],14:[function(require,module,exports){
/*
 * This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
 * praise and all of your admiration. His license is provided below.
 *
 * For information on how to use these functions in your animations, check out my following tutorial: 
 * http://bit.ly/18iHHKq
 *
 * -Kirupa
 */

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

var easingEquations = {
	/**
 * provides easing util methods.
 */
	linearEase: function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * currentIteration / totalIterations + startValue;
	},

	easeInQuad: function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
	},

	easeOutQuad: function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
	},

	easeInOutQuad: function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * currentIteration * currentIteration + startValue;
		}
		return -changeInValue / 2 * (--currentIteration * (currentIteration - 2) - 1) + startValue;
	},

	easeInCubic: function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
	},

	easeOutCubic: function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
	},

	easeInOutCubic: function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
	},

	easeInQuart: function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 4) + startValue;
	},

	easeOutQuart: function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
	},

	easeInOutQuart: function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
		}
		return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
	},

	easeInQuint: function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(currentIteration / totalIterations, 5) + startValue;
	},

	easeOutQuint: function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
	},

	easeInOutQuint: function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
		}
		return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
	},

	easeInSine: function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
	},

	easeOutSine: function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
	},

	easeInOutSine: function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
	},

	easeInExpo: function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
	},

	easeOutExpo: function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
	},

	easeInOutExpo: function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
		}
		return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
	},

	easeInCirc: function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
	},

	easeOutCirc: function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
	},

	easeInOutCirc: function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
		if ((currentIteration /= totalIterations / 2) < 1) {
			return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
		}
		return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
	},

	easeInElastic: function easeInElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function easeOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d) == 1) return b + c;if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},

	easeInOutElastic: function easeInOutElastic(t, b, c, d) {
		var s = 1.70158;var p = 0;var a = c;
		if (t == 0) return b;if ((t /= d / 2) == 2) return b + c;if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},

	easeInBack: function easeInBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},

	easeOutBack: function easeOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},

	easeInOutBack: function easeInOutBack(t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
	},

	// easeInBounce: function(t, b, c, d) {
	//     return c - easeOutBounce(d-t, 0, c, d) + b;
	// },

	easeOutBounce: function easeOutBounce(t, b, c, d) {
		if ((t /= d) < 1 / 2.75) {
			return c * (7.5625 * t * t) + b;
		} else if (t < 2 / 2.75) {
			return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
		} else if (t < 2.5 / 2.75) {
			return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
		}
	}

	// easeInOutBounce: function(t, b, c, d) {
	//     if (t < d/2) return this.easeInBounce(t*2, 0, c, d) * .5 + b;
	//     return this.easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
	// }
};

easingEquations.easeInBounce = function (t, b, c, d) {
	return c - easingEquations.easeOutBounce(d - t, 0, c, d) + b;
}, easingEquations.easeInOutBounce = function (t, b, c, d) {
	if (t < d / 2) return easingEquations.easeInBounce(t * 2, 0, c, d) * .5 + b;
	return easingEquations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};

module.exports.easingEquations = easingEquations;
},{}],15:[function(require,module,exports){
require( './app.js' );
require( './controlPanel.js' );
require( './exportOverlay.js' );
},{"./app.js":7,"./controlPanel.js":12,"./exportOverlay.js":17}],16:[function(require,module,exports){
var environment = {

		runtimeEngine: {

				startAnimation: function startAnimation(animVar, loopFn) {
						if (!animVar) {
								animVar = window.requestAnimationFrame(loopFn);
						}
				},

				stopAnimation: function stopAnimation(animVar) {
						if (animVar) {
								window.cancelAnimationFrame(animVar);
								animVar = undefined;
						}
				}

		},

		canvas: {
				// buffer clear fN
				checkClearBufferRegion: function checkClearBufferRegion(particle, canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						var entityWidth = particle.r / 2;
						var entityHeight = particle.r / 2;

						if (particle.x - entityWidth < bufferClearRegion.x) {
								bufferClearRegion.x = particle.x - entityWidth;
						}

						if (particle.x + entityWidth > bufferClearRegion.x + bufferClearRegion.w) {
								bufferClearRegion.w = particle.x + entityWidth - bufferClearRegion.x;
						}

						if (particle.y - entityHeight < bufferClearRegion.y) {
								bufferClearRegion.y = particle.y - entityHeight;
						}

						if (particle.y + entityHeight > bufferClearRegion.y + bufferClearRegion.h) {
								bufferClearRegion.h = particle.y + entityHeight - bufferClearRegion.y;
						}
				},

				resetBufferClearRegion: function resetBufferClearRegion(canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						bufferClearRegion.x = canvasConfig.centerH;
						bufferClearRegion.y = canvasConfig.centerV;
						bufferClearRegion.w = canvasConfig.width;
						bufferClearRegion.h = canvasConfig.height;
				}
		},

		forces: {
				friction: 0.01,
				bouyancy: 1,
				gravity: 0,
				wind: 1,
				turbulence: { min: -5, max: 5 }
		}

};

module.exports.environment = environment;
},{}],17:[function(require,module,exports){
$( document ).ready( function(){


	var $featurePageParent = $( '[ data-page="page-elements" ]');
    var $featureInputs = $featurePageParent.find( '.range-slider' );
    var $featureOutputs = $featurePageParent.find( 'output' );
    var $featureInputsLen = $featureInputs.length;

    console.log( 'test input: ', $featureInputs.eq( 2 ) );

    function createExpressionParameterExport() {

    	var output = '';

    	for ( var i = 0; i < $featureInputsLen; i++ ) {
    		var thisInput = $featureInputs.eq( i )[ 0 ];
    		var $thisOutput = parseFloat( $featureOutputs.eq( i ).html() ).toFixed( 2 );

    		thisInput.id === 'mouthEdgeRight' ? $thisOutput = $thisOutput * -1 : false;

    		var tempEnding = '';

    		if ( i !== $featureInputsLen - 1 ) {
    			tempEnding = ',';
    		}

    		output = `${ output }
    		{ name: "${ thisInput.id }", target: "${ $thisOutput }" }${tempEnding}`;
    	}

    	output = `[
    			${ output }
    		]`;

        console.log( 'output: ', output );
    	return output;

    }


	var $exportOverlay = $( '.export-overlay--container' );

	$( '.js-export-expression' ).click( function( e ){

		var $thisButton = $( this );

		if ( $exportOverlay.hasClass( 'is-active') ) {
			$exportOverlay.removeClass( 'is-active' );


		} else {


			$( '.export-overlay--output' ).html( createExpressionParameterExport() );
			$exportOverlay.addClass( 'is-active' );
		}

	} );

	$( '.js-close-export-overlay-limiter' ).click( function( e ){
		e.stopPropagation();
	} );


	$( '.js-close-export-overlay' ).click( function( e ){
		e.stopPropagation();
		var $this = $( this );
		$( '.export-overlay--container' ).removeClass( 'is-active' )
	} );

	


} );
},{}],18:[function(require,module,exports){
function deg2rad(d) {
    return (2 * Math.PI * d) / 360;
}

function rad2deg(r) {
    return (360 * r) / (2 * Math.PI);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

var Gear = function(x, y, connectionRadius, teeth, fillStyle, strokeStyle) {
    // Gear parameters
    this.x = x;
    this.y = y;
    this.connectionRadius = connectionRadius;
    this.teeth = teeth;

    // Render parameters
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;

    // Calculated properties
    this.diameter = teeth * 4 * connectionRadius; // Each touth is built from two circles of connectionRadius
    this.radius = this.diameter / (2 * Math.PI); // D = 2 PI r

    // Animation properties
    this.phi0 = 0; // Starting angle
    this.angularSpeed = 0; // Speed of rotation in degrees per second
    this.createdAt = new Date(); // Timestamp
}

Gear.prototype.render = function (context) {
    // Update rotation angle
    var ellapsed = new Date() - this.createdAt;
    var phiDegrees = this.angularSpeed * (ellapsed / 1000);
    var phi = this.phi0 + deg2rad(phiDegrees); // Current angle

    // Set-up rendering properties
    context.fillStyle = this.fillStyle;
    context.strokeStyle = this.strokeStyle;
    context.lineCap = 'round';
    context.lineWidth = 1;

    // Draw gear body
    context.beginPath();
    for (var i = 0; i < this.teeth * 2; i++) {
        var alpha = 2 * Math.PI * (i / (this.teeth * 2)) + phi;
        // Calculate individual touth position
        var x = this.x + Math.cos(alpha) * this.radius;
        var y = this.y + Math.sin(alpha) * this.radius;

        // Draw a half-circle, rotate it together with alpha
        // On every odd touth, invert the half-circle
        context.arc(x, y, this.connectionRadius, -Math.PI / 2 + alpha, Math.PI / 2 + alpha, i % 2 == 0);
    }
    context.fill();
    context.stroke();

    // Draw center circle
    context.beginPath();
    context.arc(this.x, this.y, this.connectionRadius, 0, 2 * Math.PI, true);
    context.fill();
    context.stroke();
}

Gear.prototype.connect = function (x, y) {
    var r = this.radius;
    var dist = distance(x, y, this.x, this.y);

    // To create new gear we have to know the number of its touth
    var newRadius = Math.max(dist - r, 10);
    var newDiam = newRadius * 2 * Math.PI;
    var newTeeth = Math.round(newDiam / (4 * this.connectionRadius));

    // Calculate the ACTUAL position for the new gear, that would allow it to interlock with this gear
    var actualDiameter = newTeeth * 4 * this.connectionRadius;
    var actualRadius = actualDiameter / (2 * Math.PI);
    var actualDist = r + actualRadius; // Actual distance from center of this gear
    var alpha = Math.atan2(y - this.y, x - this.x); // Angle between center of this gear and (x,y)
    var actualX = this.x + Math.cos(alpha) * actualDist; 
    var actualY = this.y + Math.sin(alpha) * actualDist;

    // Make new gear
    var newGear = new Gear(actualX, actualY, this.connectionRadius, newTeeth, this.fillStyle, this.strokeStyle);

    // Adjust new gear's rotation to be in direction oposite to the original
    var gearRatio = this.teeth / newTeeth;
    newGear.angularSpeed = -this.angularSpeed * gearRatio;

    // At time t=0, rotate this gear to be at angle Alpha
    this.phi0 = alpha + (this.phi0 - alpha); // = this.phi0, does nothing, for demonstration purposes only
    newGear.phi0 = alpha + Math.PI + (Math.PI / newTeeth) + (this.phi0 - alpha) * (newGear.angularSpeed / this.angularSpeed);
    // At the same time (t=0), rotate the new gear to be at (180 - Alpha), facing the first gear,
    // And add a half gear rotation to make the teeth interlock
    newGear.createdAt = this.createdAt; // Also, syncronize their clocks


    return newGear;
}

module.exports = Gear;
},{}],19:[function(require,module,exports){
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
let mathUtils = require('./mathUtils.js').mathUtils;
let easing = require('./easing.js').easingEquations;

let noiseGen = require('./noiseTextureGenerator.js'); 
let noiseCfg = require('./noiseConfig.js');

let noiseTexture = noiseGen( 256, noiseCfg );
noiseTextureW = noiseTexture.width;
noiseTextureH = noiseTexture.height;

let rand = mathUtils.random;
let randI = mathUtils.randomInteger;
let mCos = Math.cos;
let mSin = Math.sin;

var numFlares = randI( 10, 20 );
var flareSizeArr = [];

for (var i = numFlares - 1; i >= 0; i--) {

    let randomRandomiser = randI( 0, 100 );
    let smallThreshold = numFlares < 30 ? 60 : 75;
    let min = 15;
    let max = randomRandomiser < 50 ? 120 : 180;

    flareSizeArr.push(
        randI( min, max )
    );
}

var lensFlare = {
    config: {
        count: numFlares,
        sizeArr: flareSizeArr,
        flareArr: [],
        blur: 3
    },
    renderers: {
        render: {
            canvas: null,
            ctx: null,
            w: 2000,
            h: 2000,
            dX: 0,
            dY: 0,
            totTallest: 0,
            compositeArea: {
                x: 0, y: 0, w: 0, h: 0
            }
        },
        display: {
            canvas: null,
            ctx: null,
            x: 0, y: 0, w: 0, h: 0, a: 0, d: 0
        }
    },

    setRendererElements: function( renderOpts, displayOpts ) {
        let renderCfg = this.renderers.render;
        let displayCfg = this.renderers.display;

        renderCfg.canvas = renderOpts.canvas;
        renderCfg.ctx = renderOpts.ctx;
        renderCfg.canvas.width = renderCfg.w;
        renderCfg.canvas.height = renderCfg.h;

        displayCfg.canvas = displayOpts.canvas;
        displayCfg.ctx = displayOpts.ctx;
        displayCfg.w = displayCfg.canvas.width;
        displayCfg.h = displayCfg.canvas.height;
    },

    setDisplayProps: function( sun ) {
        let displayCfg = this.renderers.display;
        displayCfg.x = sun.x;
        displayCfg.y = sun.y;
        displayCfg.a = sun.localRotation;
        let sunPivot = sun.pivotPoint;
        // displayCfg.maxD = trig.dist( -( originR * 2 ), -( originR * 2 ), displayCfg.w + ( originR * 2 ), displayCfg.h + ( originR * 2 ) );
        displayCfg.maxD = displayCfg.w * 2;
        // console.log( 'displayCfg.maxD: ', displayCfg.maxD );
        displayCfg.d = ( trig.dist( displayCfg.x,  displayCfg.y, displayCfg.w / 2, displayCfg.h / 2 ) ) * 4;
        // console.log( 'displayCfg.d: ', displayCfg.d );
        displayCfg.scale = displayCfg.maxD / displayCfg.d;
        displayCfg.flareDistTotal = trig.dist( sunPivot.x,  sunPivot.y + sunPivot.r, displayCfg.w / 2, displayCfg.h / 2 );
        displayCfg.currFlareDist = trig.dist( sun.x,  sun.y, displayCfg.w / 2, displayCfg.h / 2 );
        // console.log( 'displayCfg.scale: ', displayCfg.scale );
    },

    createFlareConfigs: function( miscOpts ) {
        let cfg = this.config;
        this.config.opts = miscOpts;

        for (let i = cfg.count - 1; i >= 0; i--) {

            let thisTypeRandomiser = randI( 0, 100 );
            let thisType;

            // let thisType = thisTypeRandomiser < 10 ? 'spotShine' : thisTypeRandomiser < 55 ? 'poly' : 'circle';
            if ( i === 0 || i === 5 ) {
                thisType = 'renderRGBSpotFlare';
                cfg.sizeArr[ i ] = randI( 15, 100 );
                console.log( 'cfg.sizeArr[ i ]: ', cfg.sizeArr[ i ] );
            } else {
                thisType = thisTypeRandomiser < 8 ? 'spotShine' : 'poly';
            }
            
            let colRand = randI( 0, 100 );

            let r = colRand < 50 ? 255 : colRand < 60 ? 255 : colRand < 80 ? 200 : 200;
            let g = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 255 : 255;
            let b = colRand < 50 ? 255 : colRand < 60 ? 200 : colRand < 80 ? 200 : 255;

            let thisFlare = {
                color: {
                    r: r,
                    g: g,
                    b: b

                },
                type: thisType
            }

            if ( thisType === 'spotShine' ) {
                if ( colRand < 10 ) {
                    thisFlare.color = {
                        r: 255, g: 100, b: 100
                    }
                } else {
                    if ( colRand < 20 ) {
                        thisFlare.color = {
                            r: 100, g: 255, b: 100
                        }
                    } else {
                        thisFlare.color = {
                            r: 255, g: 255, b: 255
                        }
                    }
                }
                
            }

            thisFlare.size = thisFlare.type === 'spotShine' ? randI( 40, 80 ) : cfg.sizeArr[ i ];

            thisFlare.d = thisFlare.type === 'spotShine' ? parseFloat( rand( 0.3, 1 ).toFixed( 2 ) ) : parseFloat( rand( 0, 1 ).toFixed( 2 ) );

            thisFlare.hRand = parseFloat( rand( 1, 2 ).toFixed( 2 ) );
            cfg.flareArr.push( thisFlare );
        }
    },

    renderCircleFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let baseCfg = this.config;
        let flareCfg = cfg;
        let flareRandomiser = randI( 0, 100 );
        let flareRandomShift = randI( 20, 40 );
        let flareRandomEdge = randI( 0, 10 );
        let randomFill = randI( 0, 100 ) < 20 ? true : false;
        let grad = c.createRadialGradient( 0 - ( flareRandomShift * 3 ), 0, 0, 0, 0, flareCfg.size );
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

            // grad.addColorStop( 0, `rgba( ${ rgbColorString } 0.6 )` );
            // grad.addColorStop( 0.7,  `rgba( ${ rgbColorString } 0.8 )` );
            // grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.7 )` );

        if ( flareRandomEdge > 5 ) {
            if ( randomFill === true ) {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            } else {
                grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.8,  `rgba( ${ rgbColorString } 0 )` );
                grad.addColorStop( 0.95, `rgba( ${ rgbColorString } 0.2 )` );
            }
            
            grad.addColorStop( 0.97, `rgba( ${ rgbColorString } 0.8 )` );
            grad.addColorStop( 0.99, `rgba( ${ rgbColorString } 0.3 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0 )` );
        } else {
            grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.2 )` );
            grad.addColorStop( 1, `rgba( ${ rgbColorString } 0.3 )` );
        }
            
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderSpotFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.2,  `rgba( ${ rgbColorString } 1 )` );
        grad.addColorStop( 0.4,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0 )` );
        
        c.fillStyle = grad; 
        c.fillCircle( 0, 0, flareCfg.size );
        c.fill();
    },

    renderRGBSpotFlare: function( x, y, cfg ) {
        console.log( 'yay rendered renderRGBSpotFlare' );
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let curComp = c.globalCompositeOperation;
        c.globalCompositeOperation = 'lighten';

        let redGrad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        redGrad.addColorStop( 0,  `rgba( 255, 0, 0, 0.5 )` );
        redGrad.addColorStop( 0.2,  `rgba( 255, 0, 0, 0.5 )` );
        redGrad.addColorStop( 0.6,  `rgba( 255, 0, 0, 0.1 )` );
        redGrad.addColorStop( 1,  `rgba( 255, 0, 0, 0 )` );
        
        c.fillStyle = redGrad; 
        c.fillCircle( 0, 0, flareCfg.size );

        let greenGrad = c.createRadialGradient( flareCfg.size / 4 , 0, 0, flareCfg.size / 4 , 0, flareCfg.size );
        greenGrad.addColorStop( 0,  `rgba( 0, 255, 0, 0.5 )` );
        greenGrad.addColorStop( 0.2,  `rgba( 0, 255, 0, 0.5 )` );
        greenGrad.addColorStop( 0.6,  `rgba( 0, 255, 0, 0.1 )` );
        greenGrad.addColorStop( 1,  `rgba( 0, 255, 0, 0 )` );
        
        c.fillStyle = greenGrad; 
        c.fillCircle( flareCfg.size / 4 , 0, flareCfg.size );

        let blueGrad = c.createRadialGradient( flareCfg.size / 2, 0, 0, flareCfg.size / 2, 0, flareCfg.size );
        blueGrad.addColorStop( 0,  `rgba( 0, 0, 255, 0.5 )` );
        blueGrad.addColorStop( 0.2,  `rgba( 0, 0, 255, 0.5 )` );
        blueGrad.addColorStop( 0.6,  `rgba( 0, 0, 255, 0.1 )` );
        blueGrad.addColorStop( 1,  `rgba( 0, 0, 255, 0 )` );
        
        c.fillStyle = blueGrad; 
        c.fillCircle( flareCfg.size / 2, 0, flareCfg.size );

        c.globalCompositeOperation = curComp;

    },

    renderPolyFlare: function( x, y, cfg ) {
        
        let c = this.renderers.render.ctx;
        let flareCfg = cfg;
        let flareSize = flareCfg.size;
        let flareRandomShift = randI( 0, 40 );

        let flareRandomEdge = randI( 0, 10 );

        let rgbColorString = `${ flareCfg.color.r }, ${ flareCfg.color.g }, ${ flareCfg.color.b }, `;

        let grad = c.createRadialGradient( 0, 0, 0, 0, 0, flareCfg.size );
        grad.addColorStop( 0,  `rgba( ${ rgbColorString } 0.1 )` );
        grad.addColorStop( 1,  `rgba( ${ rgbColorString } 0.2 )` );
        
        let sides = this.config.opts.aperture;

        c.save();
        
        // c.beginPath();
        // for (let i = 0; i < sides; i++) {
        //     let alpha = twoPi * ( i / sides );
        //     if ( i === 0 ) {
        //         c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
        //     } else {
        //         c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
        //     }
        // }
        // c.closePath();
        // c.clip();

        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();

        c.fillStyle = grad; 
        c.fill();
        
        c.translate( 0, -100000 );
        c.beginPath();
        for (let i = 0; i < sides; i++) {
            let alpha = twoPi * ( i / sides );
            if ( i === 0 ) {
                c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            } else {
                c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
            }
        }
        c.closePath();
        flareRandomShift = randI( 0, 5 );
        c.strokeStyle = 'red';
        c.shadowColor = `rgba( ${ rgbColorString } 0.05 )`;
        c.shadowBlur = 5;
        c.shadowOffsetX = 0 - flareRandomShift;
        c.shadowOffsetY = 100000;
        c.lineWidth = 2;
        c.stroke();
        c.shadowBlur = 0;

        if ( flareRandomEdge > 5 ) {
            c.beginPath();
            for (let i = 0; i < sides; i++) {
                let alpha = twoPi * ( i / sides );
                if ( i === 0 ) {
                    c.moveTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                } else {
                    c.lineTo( mCos( alpha ) * flareSize, mSin( alpha ) * flareSize );
                }
            }
            c.closePath();
            c.strokeStyle = 'red';
            c.shadowColor = `rgba( ${ rgbColorString } 0.05 )`;
            c.shadowBlur = 3;
            c.shadowOffsetX = 0 - flareRandomShift;
            c.shadowOffsetY = 100000;
            c.lineWidth = 2;
            c.stroke();
            c.shadowBlur = 0;
        }

        c.translate( 0, 100000 );

        c.restore();

    },

    getCleanCoords: function( flare ) {
        
        let renderCfg = this.renderer.render;
        let blur = this.config.blur;
        let blur2 = blur * 2;
        let flareS = flare.size;
        let flareS2 = flareS * 2;
        let totalS = flareS2 + blur2;
        let cleanX = renderCfg.dX;
        let cleanY = renderCfg.dY;
    },

    renderFlares: function() {

        let baseCfg = this.config;
        let renderer = this.renderers.render;
        let compositeArea = renderer.compositeArea;
        let c = renderer.ctx;
        let cW = renderer.w;
        let cH = renderer.h;
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;
        let blur = baseCfg.blur;
        let blur2 = blur * 2;

        let currX = 0;
        let currY = 0;
        let currTallest = 0;

        let blurStr = 'blur('+blur.toString()+'px)';
        c.filter = blurStr;
        let polyCount = 0;

        // sort flares based on size - decending order to map to reverse FOR loop ( so loop starts with smallest ) 
        flares.sort( function( a, b ) {
                return b.size - a.size
            }
        );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let flareSize = thisFlare.size;
            let flareSize2 = flareSize * 2;
            let totalFlareW = flareSize2 + blur2;
            let totalFlareH = flareSize2 + blur2;

            totalFlareH > currTallest ? currTallest = totalFlareH : false;

            if ( currX + totalFlareW + blur > cW ) {
                currX = 0;
                currY += currTallest;
                currTallest = totalFlareH;
            }

            let transX = currX + flareSize + blur;
            let transY = currY + flareSize + blur;

            c.translate( transX, transY );

            if ( thisFlare.type === 'spotShine' ) {
                c.globalAlpha = 1;
                this.renderSpotFlare( 0, 0, thisFlare );
            }

            if ( thisFlare.type === 'renderRGBSpotFlare' ) {
                c.globalAlpha = 1;
                this.renderRGBSpotFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'poly' ) {
                c.globalAlpha = 1;
                this.renderPolyFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }

            if ( thisFlare.type === 'circle' ) {
                c.globalAlpha = parseFloat( rand( 0.5, 1 ).toFixed( 2 ) );
                this.renderCircleFlare( 0, 0, thisFlare );
                c.globalAlpha = 1;
            }


            // c.strokeStyle = 'red';
            // c.lineWidth = 1;
            // c.strokeRect( -( flareSize + blur ), -( flareSize + blur ), totalFlareW, totalFlareH );
            // c.stroke();

            c.translate( -transX, -transY );

            thisFlare.renderCfg = {
                x: currX,
                y: currY,
                w: totalFlareW * ( thisFlare.type === 'renderRGBSpotFlare' ? 1.5 : 1 ),

                h: totalFlareH
            }

            currX += totalFlareW * ( thisFlare.type === 'renderRGBSpotFlare' ? 1.5 : 1 );

            if ( i === 0 ) {
                compositeArea.x = 0;
                compositeArea.y = currY + totalFlareH;
                compositeArea.w = cW;
                compositeArea.h = totalFlareH;
            }

        }

        c.filter = 'blur(0px)';

        // let currMix = c.globalCompositeOperation;
        // c.globalCompositeOperation = 'lighten';

        // for (let i = flareCount - 1; i >= 0; i--) {

        //     let thisFlare = flares[ i ];
        //     flareCfg = thisFlare.renderCfg;
        //     if ( thisFlare.type === 'poly' || thisFlare.type === 'circle' ) {
        //         let noiseSize = flareCfg.w;
        //         c.drawImage(
        //             noiseTexture,
        //             0, 0, noiseTextureW, noiseTextureH,
        //             flareCfg.x, flareCfg.y, noiseSize, noiseSize
        //         );
        //     }
        // }

        // c.globalCompositeOperation = currMix;
    },


    displayFlares: function() {

        let baseCfg = this.config;
        let renderC = this.renderers.render.canvas;
        let displayCfg = this.renderers.display;
        let c = displayCfg.ctx;
        let thisEase = easing.easeInQuart;
        
        let flareCount = baseCfg.count;
        let flares = baseCfg.flareArr;

        let scale = displayCfg.scale / 2;
        let invScale = 1 - scale;
        // console.log( 'scale: ', scale );
        c.globalCompositeOperation = 'lighten';

        c.translate( displayCfg.x, displayCfg.y );
        c.rotate( displayCfg.a );

        for (let i = flareCount - 1; i >= 0; i--) {

            let thisFlare = flares[ i ];
            let thisFlareCfg = thisFlare.renderCfg;
            // console.log( 'thisFlareCfg: ', thisFlareCfg );
            let scaledCoords = ( thisFlareCfg.w / 2 ) * invScale;
            let scaledW = thisFlareCfg.w * 0.8;
            let scaledH = thisFlareCfg.h * 0.8;
            let scaledX = displayCfg.d * thisFlare.d;
            // let inverseScale = 1 - ( scaledX / displayCfg.d );
            // let scaleMultiplier = thisEase( scaledX, 1, -1, displayCfg.d );
            // console.log( 'inverseScale: ', inverseScale);
            // console.log( 'scaledSize * inverseScale: ', scaledSize * inverseScale );

            if ( thisFlare.type === "renderRGBSpotFlare" || thisFlare.type === "spotShine") {
                let scaledSize = thisFlareCfg.w * (scale / 2);
                let scaledCoords = scaledSize / 2;
                let scaledX = displayCfg.d * thisFlare.d;
                let scaleMultiplier = easing.easeInCubic( displayCfg.currFlareDist, 1, 10, displayCfg.flareDistTotal );
                c.drawImage(
                    renderC,
                    thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                    scaledX, -scaledCoords, scaledSize * scaleMultiplier , scaledSize
                );
            } else {
                c.drawImage(
                    renderC,
                    thisFlareCfg.x, thisFlareCfg.y, thisFlareCfg.w, thisFlareCfg.h,
                    scaledX, -( scaledH / 2), scaledW, scaledH
                );
            }


        }

        c.rotate( -displayCfg.a );
        c.translate( -displayCfg.x, -displayCfg.y );

    },

    

    

    update: function() {
        this.compositeFlares();
        this.displayComposite();
        this.clearCompositeArea();

    },

    flareInit: function( renderOpts, displayOpts, miscOpts ) {
        self = this;
        self.setRendererElements( renderOpts, displayOpts );
        self.createFlareConfigs( miscOpts );
    }
}

module.exports = lensFlare;
},{"./easing.js":14,"./mathUtils.js":20,"./noiseConfig.js":21,"./noiseTextureGenerator.js":22,"./trigonomicUtils.js":29}],20:[function(require,module,exports){
/**
* provides maths util methods.
*
* @mixin
*/

var mathUtils = {
	/**
 * @description Generate random integer between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	randomInteger: function randomInteger(min, max) {
		return Math.floor(Math.random() * (max + 1 - min)) + min;
	},

	/**
 * @description Generate random float between 2 values.
 * @param {number} min - minimum value.
 * @param {number} max - maximum value.
 * @returns {number} result.
 */
	random: function random(min, max) {
		if (min === undefined) {
			min = 0;
			max = 1;
		} else if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.random() * (max - min) + min;
	},

	getRandomArbitrary: function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	},
	/**
 * @description Transforms value proportionately between input range and output range.
 * @param {number} value - the value in the origin range ( min1/max1 ).
 * @param {number} min1 - minimum value in origin range.
 * @param {number} max1 - maximum value in origin range.
 * @param {number} min2 - minimum value in destination range.
 * @param {number} max2 - maximum value in destination range.
 * @param {number} clampResult - clamp result between destination range boundarys.
 * @returns {number} result.
 */
	map: function map(value, min1, max1, min2, max2, clampResult) {
		var self = this;
		var returnvalue = (value - min1) / (max1 - min1) * (max2 - min2) + min2;
		if (clampResult) return self.clamp(returnvalue, min2, max2);else return returnvalue;
	},

	/**
 * @description Clamp value between range values.
 * @param {number} value - the value in the range { min|max }.
 * @param {number} min - minimum value in the range.
 * @param {number} max - maximum value in the range.
 * @param {number} clampResult - clamp result between range boundarys.
 */
	clamp: function clamp(value, min, max) {
		if (max < min) {
			var temp = min;
			min = max;
			max = temp;
		}
		return Math.max(min, Math.min(value, max));
	}
};

module.exports.mathUtils = mathUtils;
},{}],21:[function(require,module,exports){
let noiseConfig = {
	baseColor: [ 0, 0, 0, 125 ], 
	noise: [
		{
			color: [ 255, 255, 255, 255 ], 
			attenuation: 1.5, 
			roughness: 2,
			numOctaves: 4,
			startingOctave: 2
		},
		{
			color: [ 0, 0, 0, 0 ], 
			attenuation: 1.5, 
			roughness: 6,
			numOctaves: 4,
			startingOctave: 5
		}			
	]
};

module.exports = noiseConfig;
},{}],22:[function(require,module,exports){
// ease curve
var fade = function(t)
{
	return t * t * t * (t * (t * 6 - 15) + 10);
};

// linear interpolation
var mix = function(a, b, t)
{
	return (1 - t) * a + t * b;
};
var grad3 = [[1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0], [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1], [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]];

// a special dot product function used in perlin noise calculations
var perlinDot = function(g, x, y, z)
{
	return g[0] * x + g[1] * y + g[2] * z;
};	

var NoiseGenerator = function(numOctaves, attenuation, roughness, startingOctave)
{
	var p = [];
	for (var i = 0; i < 256; i++)
	{
		p[i] = Math.floor(Math.random() * 256);
	}

	// To remove the need for index wrapping, double the permutation table length
	var perm = [];
	for (i = 0; i < 512; i++)
	{
		perm[i] = p[i & 255];
	}


    var n = function(x, y, z)
	{
		// Find unit grid cell containing point
		var X = Math.floor(x);
		var Y = Math.floor(y);
		var Z = Math.floor(z);
		
		// Get relative xyz coordinates of point within that cell
		x = x - X;
		y = y - Y;
		z = z - Z;
		
		// Wrap the integer cells at 255
		X &= 255;
		Y &= 255;
		Z &= 255;
		
		// Calculate a set of eight hashed gradient indices
		var gi000 = perm[X + perm[Y + perm[Z]]] % 12;
		var gi001 = perm[X + perm[Y + perm[Z + 1]]] % 12;
		var gi010 = perm[X + perm[Y + 1 + perm[Z]]] % 12;
		var gi011 = perm[X + perm[Y + 1 + perm[Z + 1]]] % 12;
		var gi100 = perm[X + 1 + perm[Y + perm[Z]]] % 12;
		var gi101 = perm[X + 1 + perm[Y + perm[Z + 1]]] % 12;
		var gi110 = perm[X + 1 + perm[Y + 1 + perm[Z]]] % 12;
		var gi111 = perm[X + 1 + perm[Y + 1 + perm[Z + 1]]] % 12;
		
		// Calculate noise contributions from each of the eight corners
		var n000 = perlinDot(grad3[gi000], x, y, z);
		var n100 = perlinDot(grad3[gi100], x - 1, y, z);
		var n010 = perlinDot(grad3[gi010], x, y - 1, z);
		var n110 = perlinDot(grad3[gi110], x - 1, y - 1, z);
		var n001 = perlinDot(grad3[gi001], x, y, z - 1);
		var n101 = perlinDot(grad3[gi101], x - 1, y, z - 1);
		var n011 = perlinDot(grad3[gi011], x, y - 1, z - 1);
		var n111 = perlinDot(grad3[gi111], x - 1, y - 1, z - 1);
		
		// Compute the ease curve value for each of x, y, z
		var u = fade(x);
		var v = fade(y);
		var w = fade(z);
		
		// Interpolate (along x) the contributions from each of the corners
		var nx00 = mix(n000, n100, u);
		var nx01 = mix(n001, n101, u);
		var nx10 = mix(n010, n110, u);
		var nx11 = mix(n011, n111, u);
		
		// Interpolate the four results along y
		var nxy0 = mix(nx00, nx10, v);
		var nxy1 = mix(nx01, nx11, v);
		
		// Interpolate the last two results along z
		return mix(nxy0, nxy1, w);
	};

	this.noise = function (x, y, z)
	{
		var a = Math.pow(attenuation, -startingOctave);
		var f = Math.pow(roughness, startingOctave);
		var m = 0;
		for (var i = startingOctave; i < numOctaves + startingOctave; i++)
		{
			m += n(x * f, y * f, z * f) * a;
			a /= attenuation;
			f *= roughness;
		}
		return m / numOctaves;
	};		
};

function generateTexture(size, data) {
	var canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	var context = canvas.getContext('2d');
	var imageDataObject = context.createImageData(size, size);
	var imageData = imageDataObject.data;
	for (var i = 0; i < size * size * 4; i += 4)
	{
		imageData[i] = data.baseColor[0];
		imageData[i + 1] = data.baseColor[1];
		imageData[i + 2] = data.baseColor[2];
		imageData[i + 3] = data.baseColor[3];
	}
	for (i = 0; i < data.noise.length; i++)
	{
		var k = data.noise[i];
		var n = new NoiseGenerator(k.numOctaves, k.attenuation, k.roughness, k.startingOctave);
		var p = 0;
		for (var y = 0; y < size; y++)
		{
			for (var x = 0; x < size; x++)
			{
				// generate noise at current x and y coordinates (z is set to 0)
				var v = Math.abs(n.noise(x / size, y / size, 0));
				for (var c = 0; c < 3; c++, p++)
				{
					imageData[p] = Math.floor(imageData[p] + v * k.color[c] *  k.color[3] / 255);
				}
				p++;
			}
		}
	}
	context.putImageData(imageDataObject, 0, 0);
	return canvas;
};

module.exports = generateTexture;
},{}],23:[function(require,module,exports){
var btn = {
    x: 25,
    y: 25,
    w: 125,
    h: 50,
    display: true,
    fontSize: 15,
    bg: '#666666',
    bgActive: '#aaaaaa',
    color: '#333333',
    colorActive: '#dddddd',
    content: 'Display Overlay'
};

btn.textX = btn.x + 10;
btn.textY = btn.y + ( btn.h / 2 );

function drawOverlaySwitchButton( ctx ) {
    ctx.fillStyle = btn.displayOverlay === true ? btn.bgActive : btn.bg;
    ctx.fillRect( btn.x, btn.y, btn.w, btn.h );
    ctx.fillStyle = btn.displayOverlay === true ? btn.colorActive : btn.color;
    ctx.font = btn.fontSize + 'px Tahoma';
    ctx.fillText( btn.content, btn.textX, btn.textY );
};


var overlayCfg = {
    displayOverlay: false,
    displayLookTarget: false,
    displayCentreLines: false,
    displayAnchors: false,
    displayControlPoints: false,
    displayHulls: false,
    displayGlareSpikes: false,
    displaySunToStage: false
}


module.exports.overlayBtnCfg = btn;
module.exports.drawOverlaySwitchButton = drawOverlaySwitchButton;
module.exports.overlayCfg = overlayCfg;
},{}],24:[function(require,module,exports){
var proportionalMeasures = {

	setMeasures: function( baseRadius ) {

		return {
			r2: baseRadius / 2,
			r4: baseRadius / 4,
			r8: baseRadius / 8,
			r16: baseRadius / 16,
			r32: baseRadius / 32,
			r64: baseRadius / 64,
			r128: baseRadius / 128,

			r3: baseRadius / 3,
			r6: baseRadius / 6,
			r12: baseRadius / 12,
			r24: baseRadius / 24,

			r5: baseRadius / 5,
			r10: baseRadius / 10
		}
	
	}
}

module.exports = proportionalMeasures;
},{}],25:[function(require,module,exports){
// sine wave modulation

var twoPi = require( './trigonomicUtils.js' ).trigonomicUtils.twoPi;

var sineWave = {
	count: 0,
	iterations: twoPi / 75,
	val: 0,
	invVal: 0
}

// sineWave.getClock = function( total, current ) {
// 	this.iterations = (twoPi / total) / 2;
// 	this.count = current;
// }

sineWave.modulator = function() {
	this.val = Math.sin( this.count ) / 2 + 0.5;
    this.invVal = 1 - this.val;
    this.count += this.iterations;
}

module.exports.sineWave = sineWave;
},{"./trigonomicUtils.js":29}],26:[function(require,module,exports){
var twoPi = require('./trigonomicUtils.js').trigonomicUtils.twoPi;

var numRays = 24;
var raySize = 300;

var sunCorona = {
    numRays: numRays,
    numRaysDouble: numRays * 2,
    raySize: raySize,
    raySizeDiffMax: 100,
    raySpread: 0.025,
    phi: 0
}

sunCorona.render = function( x, y, sineWave, invSineWave, ctx ) {

    const wave = sineWave;
    const invWave = invSineWave;

    const numRays = this.numRaysDouble;
    const baseR = this.rayBaseRadius / 3;
    const raySize = this.raySize;
    const raySpread = this.raySpread;
    const rayDiff = this.raySizeDiffMax;

    // straight rays
    let calculateRay = 0;

    // ctx.beginPath();
    // for ( let i = 0; i < numRays; i++ ) {
    //     let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
    //     if ( i % 2 == 0 ) {
    //         calculateRay = baseR + raySize + ( rayDiff * ( i % 4 == 0 ? invWave : wave ) );
    //         ctx.lineTo(
    //             x + Math.cos( alpha ) * calculateRay,
    //             y + Math.sin( alpha ) * calculateRay
    //         );

    //     } else {
    //         let arcMod = raySpread * wave;
    //         ctx.arc( x, y, baseR, alpha - raySpread - arcMod, alpha + raySpread + arcMod );
    //     }

    // }
    // ctx.closePath();
    // ctx.stroke();
    // end straight rays

    // curved rays
    let testCalc = 0;
    let fipper = false;

    ctx.lineCap = 'round';
    
    ctx.beginPath();
    for ( let i = 0; i < numRays; i++ ) {
        let alpha = twoPi * ( i / ( numRays ) ) + this.phi;
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRays ) ) + this.phi;

        testCalc = baseR + raySize + ( rayDiff * ( fipper == true ? invWave : wave ) );

        if ( i === 0 ) {

            ctx.moveTo(
                x + Math.cos( alpha ) * testCalc,
                y + Math.sin( alpha ) * testCalc,
                );

        } else {

            ctx.quadraticCurveTo(
                x + Math.cos( alpha ) * baseR,
                y + Math.sin( alpha ) * baseR,
                x + Math.cos( alpha2 ) * testCalc,
                y + Math.sin( alpha2 ) * testCalc,
                );

            i++;
        }
        fipper = !fipper;
    }
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
    // end curved rays

    this.phi += 0.005;

}

module.exports = sunCorona;
},{"./trigonomicUtils.js":29}],27:[function(require,module,exports){
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;

var randI = require('./mathUtils.js').mathUtils.randomInteger;
var numspike = 8;
var spikeSize = 1600;

var sunSpikes = {
    
    numspike: numspike,
    rotation: ( 2 * Math.PI / numspike ),
    halfRotation: ( 2 * Math.PI / numspike ) / 2,

    renderCfg: {
        canvas: null,
        context: null,
        debugCfg: null
    },

    displayCfg: {
        glareSpikesRandom: {
            isRendered: false,
            isDisplayed: false,
            canvas: null,
            context: null,
            x: 0,
            y: 0
        },
        glareSpikes: {
            isRendered: false,
            isDisplayed: false,
            canvas: null,
            context: null,
            x: 0,
            y: 0
        },
    },

    glareSpikeOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    glareSpikeRandomOptions: {
        x: 150,
        y: 150,
        r: 50,
        majorRayLen: 50,
        majorRayWidth: 0.5,
        minorRayWidth: 0.5,
        angle: Math.PI / 0,
        count: 16,
        blur: 15
    },

    flareOptions: {
        context: null,
        canvas: null,
        x: 150,
        y: 150,
        r: 50,
        rayLen: 800,
        flareWidth: 0.1,
        angle: Math.PI / 0,
        count: 6,
        blur: 8
    },

    flareRenderCount: 0,
    flareDisplayCount: 0,

    glareSpikeControlInputCfg: {

        r: { id: 'spikeRadiusInput', min: 0, max: 0, curr: 0, rev: false },
        majorRayLen: { id: 'spikeMajorSize', min: 0, max: 2000, curr: 0, rev: false },
        minorRayLen: { id: 'spikeMinorSize', min: 0, max: 500, curr: 0, rev: false },
        majorRayWidth: {id: 'spikeMajorWidth',  min: 0, max: 2, curr: 0, rev: true },
        minorRayWidth: { id: 'spikeMinorWidth', min: 0, max: 2, curr: 0, rev: true },
        count: { id: 'spikeCountInput', min: 4, max: 100, curr: 0, rev: false },
        blur: { id: 'spikeBlurAmount', min: 0, max: 100, curr: 10, rev: false }

    },

    initGlareSpikeControlInputs: function( stage ) {

        let thisCfg = this.glareSpikeControlInputCfg;
        let currOpts = this.glareSpikeOptions;

        thisCfg.r.curr = currOpts.r;
        thisCfg.r.max = thisCfg.r.curr * 2;

        $( '#'+thisCfg.r.id )
            .attr( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .prop( {
                    'min': thisCfg.r.min,
                    'max': thisCfg.r.max,
                    'value': thisCfg.r.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.r.curr );

        thisCfg.majorRayLen.curr = currOpts.majorRayLen;

        $( '#'+thisCfg.majorRayLen.id )
            .attr( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.majorRayLen.min,
                    'max': thisCfg.majorRayLen.max,
                    'value': thisCfg.majorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayLen.curr );

        thisCfg.minorRayLen.curr = currOpts.minorRayLen;

        $( '#'+thisCfg.minorRayLen.id )
            .attr( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .prop( {
                    'min': thisCfg.minorRayLen.min,
                    'max': thisCfg.minorRayLen.max,
                    'value': thisCfg.minorRayLen.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayLen.curr );

        thisCfg.count.curr = currOpts.count;

        $( '#'+thisCfg.count.id )
            .attr( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .prop( {
                    'min': thisCfg.count.min,
                    'max': thisCfg.count.max,
                    'value': thisCfg.count.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.count.curr );

        thisCfg.blur.curr = currOpts.blur;
        // console.log( 'currOpts.blur: ', currOpts.blur );
        // console.log( 'thisCfg.blur.curr: ', thisCfg.blur.curr );
        $( '#'+thisCfg.blur.id )
            .attr( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .prop( {
                    'min': thisCfg.blur.min,
                    'max': thisCfg.blur.max,
                    'value': thisCfg.blur.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.blur.curr );

        thisCfg.majorRayWidth.curr = currOpts.majorRayWidth * thisCfg.majorRayWidth.max;
        $( '#'+thisCfg.majorRayWidth.id )
            .attr( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.majorRayWidth.max,
                    'max': thisCfg.majorRayWidth.max,
                    'value': thisCfg.majorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.majorRayWidth.curr );

        thisCfg.minorRayWidth.curr = currOpts.minorRayWidth * thisCfg.minorRayWidth.max;
        $( '#'+thisCfg.minorRayWidth.id )
            .attr( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .prop( {
                    'min': -thisCfg.minorRayWidth.min,
                    'max': thisCfg.minorRayWidth.max,
                    'value': thisCfg.minorRayWidth.curr
                } )
                .closest( '.control--panel__item' )
                .find( 'output' )
                .html( thisCfg.minorRayWidth.curr );
    },

    clearRenderCtx: function() {
        let renderCfg = this.renderCfg;
        renderCfg.context.clearRect(
            0, 0, renderCfg.canvas.width, renderCfg.canvas.height

        );
    }
}




var randomW = [];
var randomH = [];

for (var i = 100; i >= 0; i--) {
    randomW.push( randI( 100, 200 ) );
}

for (var i = 100; i >= 0; i--) {
    randomH.push( randI( 20, 100 ) );
}

sunSpikes.render = function( x, y, imgeCfg, ctx ) {

    const image = imgeCfg;
    let currRotation = this.halfRotation;

    ctx.translate( x, y );

    for ( let i = 0; i < numspike; i++ ) {
        
        ctx.rotate( currRotation );

        ctx.drawImage(
            // source
            image.canvas, image.x, image.y, image.w, image.h,
            // destination
            0, -image.h / 2, image.w, image.h
        );
        ctx.rotate( -currRotation );
        currRotation += this.rotation;  
        
    }
    
    ctx.translate( -x, -y );
}

sunSpikes.renderRainbowSpikes = function( options, context ) {

    const ctx = context;
    const debugConfig = this.renderCfg.debugCfg;
    const baseOpts = this.glareSpikeOptions;
    const opts = options;
    console.log( 'opts: ', opts );
    // configuration
    const x = opts.x || baseOpts.x || ctx.width / 2;
    const y = opts.y || baseOpts.y;
    const a = opts.angle || baseOpts.angle;
    const d = opts.d || baseOpts.d || 200;
    const numRays = opts.count || baseOpts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || baseOpts.r || 150;
    const curveR = opts.curveR || baseOpts.curveR || baseR;

    const image = opts.imageCfg;
    const imgSrc = image.src;
    let amt = numRays;
    let rotation = ( 2 * Math.PI / amt );
    // let halfRotation = ( 2 * Math.PI / amt ) / 2;
    let currRotation = rotation;
    let widthScale = image.w * 2;
    let heightScale = image.h * 3;

    let currBlend = ctx.globalCompositeOperation;


    ctx.globalAlpha = 0.6;
    // ctx.globalCompositeOperation = 'hue';

    ctx.translate( x, y );
    ctx.rotate( -a );
    for ( let i = 0; i < amt; i++ ) {
        ctx.rotate( currRotation );
        ctx.fillStyle = 'red';
        ctx.fillCircle( 0, 0, 10 );
        ctx.drawImage(
            // source
            imgSrc, 0, 0, image.w, image.h,
            // destination
            d, -( heightScale/2 ), widthScale, heightScale
        );
        ctx.rotate( -currRotation );
        currRotation += rotation;  
        
    }
    ctx.rotate( a );
    ctx.translate( -x, -y );

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation = currBlend;

    // output config for renders
    this.displayCfg.rainbowSpikes = {
        x: x - ( d + widthScale ),
        y: y - ( d + widthScale ), 
        w: ( d * 2 ) + ( widthScale * 2 ),
        h: ( d * 2 ) + ( widthScale * 2 )
    }
}

sunSpikes.clearAssetCanvas = function( ctx, canvas ) {
    ctx.clearRect( 0, 0, canvas.width, canvas.height );
}

sunSpikes.renderGlareSpikes = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    
    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - ( flipper ? minorRayWidth : majorRayWidth );
        let curve2Alpha = alphaMidPoint + ( flipper ? majorRayWidth : minorRayWidth );

        let flippedRaySize = flipper ? majorRayLen : minorRayLen;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * flippedRaySize,
                Math.sin( alpha ) * flippedRaySize,
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * flippedRaySize,
                Math.sin( alpha2 ) * flippedRaySize
            );

            i++;
        }

        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let debugFlipper = true;
    let debugCurveR = curveR;
    let debugTextOffset = 30;

    if ( debugConfig.displayGlareSpikes ) {
        ctx.translate( x, y );
        
        ctx.font = "normal 14px Tahoma";
        ctx.fillStyle = "#666666";
        ctx.setLineDash( [ 1, 6 ] );

        ctx.strokeCircle( 0, 0, baseR );
        // ctx.fillText( 'Radius', baseR + 10, 0 );

        ctx.strokeCircle( 0, 0, debugCurveR );
        ctx.fillText( 'Curve Point Radius', debugCurveR + 10, 0 );

        ctx.strokeCircle( 0, 0, minorRayLen );
        ctx.fillText( 'Minor Spike Radius', minorRayLen + 10, 0 );

        ctx.strokeCircle( 0, 0, majorRayLen );
        let textMetrics = ctx.measureText("Major Spike Radius");
        let textW = textMetrics.width + 10;
        ctx.fillText( 'Major Spike Radius', majorRayLen - textW, 0 );

        ctx.setLineDash( [] );

        ctx.rotate( -a );

        ctx.font = "normal 14px Tahoma";

        // points and lines
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( debugFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( debugFlipper ? majorRayWidth : minorRayWidth );

            let debugLineAlpha = twoPi * ( i / numRaysMultiple );
            let debugFlippedRaySize = debugFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {

                // first point
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize,
                    5
                    );
                ctx.line( 
                    0, 0, 
                    Math.cos( alpha ) * debugFlippedRaySize,
                    Math.sin( alpha ) * debugFlippedRaySize
                )

                ctx.fillText( i, Math.cos( alpha ) * ( debugFlipper ? majorRayLen : minorRayLen + debugTextOffset ),
                    Math.sin( alpha ) * debugFlippedRaySize + debugTextOffset );

            } else {

                // centre angle of control points
                ctx.setLineDash( [ 1, 6 ] );
                ctx.line( 0, 0, Math.cos( alphaMidPoint ) * majorRayLen, Math.sin( alphaMidPoint ) * majorRayLen );
                ctx.strokeCircle( 0, 0, curveR );
                ctx.setLineDash( [] );


                // first control point of curve ( minus from centre point )
                if ( debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle( Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR,
                    3
                    );
                ctx.line( 0, 0, Math.cos( curve1Alpha ) * debugCurveR, Math.sin( curve1Alpha ) * debugCurveR );

                // ctx.fillText( i, Math.cos( curve1Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve1Alpha ) * ( debugCurveR + debugTextOffset ) );



                // second control point of curve ( plus from centre point )
                if ( !debugFlipper ) {
                    ctx.fillStyle = 'green';
                    ctx.strokeStyle = 'green';
                } else {
                    ctx.fillStyle = 'blue';
                    ctx.strokeStyle = 'blue';
                }

                ctx.fillCircle(
                    Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR,
                    3
                    );
                // ctx.fillText( i, Math.cos( curve2Alpha ) * ( debugCurveR + debugTextOffset ), Math.sin( curve2Alpha ) * ( debugCurveR + debugTextOffset ) );
                ctx.line( 0, 0, Math.cos( curve2Alpha ) * debugCurveR, Math.sin( curve2Alpha ) * debugCurveR );



                // end point of curve
                ctx.fillStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.strokeStyle = 'rgba( 255, 0, 0, 1 )';
                ctx.fillCircle(
                    Math.cos( alpha2 ) * debugFlippedRaySize, Math.sin( alpha2 ) * debugFlippedRaySize,
                    5
                    );
                ctx.fillText(
                    i + 1, 
                    Math.cos( alpha2 ) * ( debugFlippedRaySize + debugTextOffset ),
                    Math.sin( alpha2 ) * ( debugFlippedRaySize + debugTextOffset )
                );
                ctx.line(
                    0, 0,
                    Math.cos( alpha2 ) * debugFlippedRaySize,
                    Math.sin( alpha2 ) * debugFlippedRaySize
                );

                i += 1;
            }

            debugFlipper = !debugFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }

        // hulls
        ctx.strokeStyle = 'white';

        ctx.beginPath();

        let hullFlipper = true;
        for ( let i = 0; i < numRaysMultiple; i++ ) {

            let iNumRays = i / numRays;
            let iNumRaysMulti = i / numRaysMultiple;
            let alpha = twoPi * ( i / ( numRaysMultiple ) );
            let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

            let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

            let curve1Alpha = alphaMidPoint - ( hullFlipper ? minorRayWidth : majorRayWidth );
            let curve2Alpha = alphaMidPoint + ( hullFlipper ? majorRayWidth : minorRayWidth );

            let flippedRaySize = hullFlipper ? majorRayLen : minorRayLen;

            if ( i === 0 ) {
                ctx.moveTo(
                    Math.cos( alpha ) * flippedRaySize,
                    Math.sin( alpha ) * flippedRaySize,
                    );
            } else {
                ctx.lineTo( Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR );
                ctx.lineTo( Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR );
                ctx.lineTo( Math.cos( alpha2 ) * flippedRaySize, Math.sin( alpha2 ) * flippedRaySize );

                i++;
            }

            hullFlipper = !hullFlipper;

            if ( i === numRaysMultiple - 1 ) {
                break;
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash( [] );


        ctx.rotate( a );
        ctx.translate( -x, -y );
    }

    let maxRayLen = majorRayLen > minorRayLen ? majorRayLen : minorRayLen;

    // output config for renders
    this.displayCfg.glareSpikes.render = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }

    this.displayCfg.glareSpikes.isRendered = true;

}

sunSpikes.renderGlareSpikesRandom = function( options ) {

    const ctx = this.renderCfg.context;
    const debugConfig = this.renderCfg.debugCfg
    const opts = options || this.glareSpikeRandomOptions;

    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;

    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;

    let maxSize = opts.majorRayLen || 600;
    let minSize = opts.minorRayLen || 300;

    let randomSize = []; 
    for (var i = numRaysMultiple; i >= 0; i--) {
        randomSize.push( randI( minSize, maxSize ) );
    }

    // const majorRayLen = baseR + opts.majorRayLen || baseR + 300;
    // const minorRayLen = baseR + opts.minorRayLen || baseR + opts.majorRayLen / 2 || baseR + 150;

    const majorRayInputFlipped = 1 - opts.majorRayWidth;
    const minorRayInputFlipped = 1 - opts.minorRayWidth;
    const maxRayWidth = twoPi / numRaysMultiple;
    const majorRayWidth = majorRayInputFlipped * maxRayWidth;
    const minorRayWidth = minorRayInputFlipped * maxRayWidth;

    const blur = opts.blur || 10;

    const shadowRenderOffset = debugConfig.displayGlareSpikes === false ? 100000 : 0;
    


    let flipper = true;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y - shadowRenderOffset );
    ctx.rotate( -a );
 
    ctx.beginPath();
    for ( let i = 0; i < numRaysMultiple; i++ ) {

        let iNumRays = i / numRays;
        let iNumRaysMulti = i / numRaysMultiple;

        let alpha = twoPi * ( i / ( numRaysMultiple ) );
        let alpha2 = twoPi * ( ( i + 1 ) / ( numRaysMultiple ) );

        let alphaMidPoint = alpha + ( twoPi * numRaysMultiple );

        let curve1Alpha = alphaMidPoint - maxRayWidth;
        let curve2Alpha = alphaMidPoint + maxRayWidth;

        if ( i === 0 ) {
            ctx.moveTo(
                Math.cos( alpha ) * ( baseR + randomSize[ i ] ),
                Math.sin( alpha ) * ( baseR + randomSize[ i ] ),
                );
        } else {

            ctx.bezierCurveTo(
                Math.cos( curve1Alpha ) * curveR, Math.sin( curve1Alpha ) * curveR,
                Math.cos( curve2Alpha ) * curveR, Math.sin( curve2Alpha ) * curveR,
                Math.cos( alpha2 ) * ( baseR + randomSize[ i + 1 ] ),
                Math.sin( alpha2 ) * ( baseR + randomSize[ i + 1 ] )
            );

            i++;
        }
        console.log( )
        flipper = !flipper;

        if ( i === numRaysMultiple - 1 ) {
            break;
        }
    }
    ctx.closePath();


    if ( !debugConfig.displayGlareSpikes ) {
        ctx.shadowColor = 'white';
        ctx.shadowBlur = blur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadowRenderOffset;
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    ctx.rotate( a );
    ctx.translate( -x, -y + shadowRenderOffset );

    // debug display

    let maxRayLen = maxSize;

    // output config for renders
    this.displayCfg.glareSpikesRandom.render = {
        x: x - maxRayLen - 10,
        y: y - maxRayLen - 10, 
        w: maxRayLen * 2 + 20,
        h: maxRayLen * 2 + 20
    }

    this.displayCfg.glareSpikesRandom.isRendered = true;

}

sunSpikes.displayCorona = function( options ) {
    let glareSpikeOpts = this.displayCfg.glareSpikes;
    let itemCfg = glareSpikeOpts.render;
    let c = glareSpikeOpts.context;
    let originCanvas = this.renderCfg.canvas;
    let opts = options;
    let x = opts.xPos || glareSpikeOpts.x;
    let y = opts.yPos || glareSpikeOpts.y;

    if ( glareSpikeOpts.isRendered === false ) {
        this.renderGlareSpikes();
        this.renderFlares();
    }
    if ( !itemCfg ) {
        return;
    }
    if ( glareSpikeOpts.isDisplayed === false ) {
        // console.log( 'itemCfg: ', itemCfg );
        c.drawImage(
            originCanvas,
            itemCfg.x, itemCfg.y, itemCfg.w, itemCfg.h,
            -(itemCfg.w / 2 ), -(itemCfg.h / 2 ), itemCfg.w, itemCfg.h
        );
        // glareSpikeOpts.isDisplayed = true;

    }

}


sunSpikes.renderFlares = function( options ) {

    const debugConfig = this.renderCfg.debugCfg
    const opts = this.flareOptions;
    const ctx = opts.context || this.renderCfg.context;
    const renderCanvas = opts.canvas || this.renderCfg.canvas;
    const renderOffset = 100000;
    // configuration
    const x = opts.x || ctx.width / 2;
    const y = opts.y;
    const a = opts.angle || 0;
    const numRays = opts.count || 4;
    const numRaysMultiple = numRays * 2;
    const rayWidth = opts.rayWidth || 0.2;
    const gradientWidth = opts.gradientWidth || 1000;
    const baseR = opts.r || 150;
    const curveR = opts.curveR || baseR;
    const blur = opts.blur || 4;
    const rayLen = baseR + opts.rayLen || baseR + 300;

    const maxRayWidth = twoPi / numRays;
    const raySpread = maxRayWidth * rayWidth;

    // drawing
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate( x, y );
    ctx.rotate( -a );
    ctx.filter = 'blur('+blur+'px)';
    let flareGrd = ctx.createRadialGradient( 0, 0, 0, 0, 0, gradientWidth );
    flareGrd.addColorStop( 0, 'rgba( 255, 255, 255, 1' );
    flareGrd.addColorStop( 0.3, 'rgba( 255, 255, 255, 0.3' );
    flareGrd.addColorStop( 1, 'rgba( 255, 255, 255, 0' );
    
    ctx.fillStyle = flareGrd;
    
    for ( let i = 0; i < numRays; i++ ) {

        let alpha = twoPi * ( i / ( numRays ) );

        let point1Alpha = alpha - raySpread;
        let point2Alpha = alpha + raySpread;

        ctx.beginPath();
        ctx.moveTo( 0, 0 );

        // ctx.lineTo( 800, -20 );
        // ctx.lineTo( 800, 20 );

        ctx.lineTo( Math.cos( point1Alpha ) * rayLen, Math.sin( point1Alpha ) * rayLen );
        ctx.lineTo( Math.cos( point2Alpha ) * rayLen, Math.sin( point2Alpha ) * rayLen );
        ctx.closePath();
        // ctx.stroke();
        ctx.fill();

    }
    ctx.filter = 'blur(0px)';
    ctx.rotate( a );
    ctx.translate( -x, -y );

    // output config for renders
    this.displayCfg.flares = {
        canvas: renderCanvas,
        x: x - rayLen - 10,
        y: y - rayLen - 10, 
        w: rayLen * 2 + 20,
        h: rayLen * 2 + 20
    }

    this.flareRenderCount++;
    console.log( 'this.flareRenderCount: ', this.flareRenderCount );

}

module.exports = sunSpikes;
},{"./mathUtils.js":20,"./trigonomicUtils.js":29}],28:[function(require,module,exports){
var trig = require('./trigonomicUtils.js').trigonomicUtils;
var twoPi = trig.twoPi;
var randI = require('./mathUtils.js').mathUtils.randomInteger;
var rand = require('./mathUtils.js').mathUtils.random;

let theStars = {

	starsArr: [],

	config: {
		count: 3000
	},

	renderConfig: {
		canvas: null,
		ctx: null,
		x: 0,
		y: 0,
		w: 0,
		h: 0
	},

	getCanvas: function( canvas, ctx ) {
		let renderCfg = this.renderConfig;
		renderCfg.canvas = canvas;
		renderCfg.ctx = ctx;

		renderCfg.w = canvas.width;
		renderCfg.h = canvas.height;

	},

	setInitialConfig: function( sunCfg ) {

		let sunConfig = sunCfg;
		this.config.arcRadius = sunConfig.pivotPoint.r;
		this.config.totalClock = sunConfig.orbitTime;
		this.config.alphaClock = sunConfig.orbitClock;

		let tClock = this.config.totalClock;
		let tClockQ = tClock / 4;
		let tClockH = tClock / 2;

		this.config.alphaInterval = 1 / tClockQ;
		this.config.globalAlpha = 0;

		let aClock = this.config.alphaClock;
		let aInt = this.config.alphaInterval;

		if ( aClock < tClockQ ) {
			this.config.globalAlpha = aClock * aInt ;
		} else {

			if ( aClock < tClockH ) {
				this.config.globalAlpha = 1 - ( ( aClock - tClockQ ) * aInt ) ;
			} else {
				this.config.globalAlpha = 1
			}

		}


		this.config.pivot = {
			x: sunConfig.pivotPoint.x,
			y: sunConfig.pivotPoint.y,
			rVel: sunConfig.rVel
		}

		this.config.resetA = trig.angle( this.config.pivot.x, this.config.pivot.y, 0, this.renderConfig.h );
		console.log( 'this.config.resetA: ', this.config.resetA );
		console.log( 'this.config.pivot: ', this.config.pivot );
	},

	updateAlpha: function() {

		let tClock = this.config.totalClock;
		let tClockQ = tClock / 4;
		let tClockH = tClock / 2;
		let aClock = this.config.alphaClock;
		let aInt = this.config.alphaInterval;
		let gAlpha = this.config.globalAlpha;
		if ( aClock < tClockQ ) {

			if ( this.config.globalAlpha < 1 ) {
				this.config.globalAlpha += aInt;
			} else {
				this.config.globalAlpha = 1;
			}
			
		} else {

			if ( aClock < tClockH ) {

				if ( this.config.globalAlpha > aInt ) {
					this.config.globalAlpha -= aInt;
				} else {
					this.config.globalAlpha = 0;
				}

			} else {
				if ( aClock > tClockH ) {
					this.config.globalAlpha = 0;
				}
			}
			
		}

		if ( aClock === tClock ) {
			this.config.alphaClock = 0;
		} else {
			this.config.alphaClock++;
		}

	},

	populateArray: function() {

		let thisCount = this.config.count;
		let thisCanvas = this.renderConfig;
		let halfStageW =  thisCanvas.w / 2;
		let halfStageH =  thisCanvas.h / 2;
		let groupPivot = this.config.pivot;

		let distMax = trig.dist( 0, 0, groupPivot.x, groupPivot.y );
		let distMin = trig.dist( ( thisCanvas.w /2 ), thisCanvas.h, groupPivot.x, groupPivot.y );

		for (var i = thisCount - 1; i >= 0; i--) {

			let randPosition = trig.radialDistribution( groupPivot.x, groupPivot.y, randI( distMin, distMax ), rand( 0, Math.PI * 2) );		

			let randSize = randI( 0, 10 );

			let star = {
				x: randPosition.x,
				y: randPosition.y,
				r: randSize > 8 ? rand( 0.3, 3 ) : rand( 0.1, 1.5 ),
				color: {
					r: 255, g: 255, b: 255, a: 1
				}
			}

			star.d = trig.dist( star.x, star.y, this.config.pivot.x, this.config.pivot.y );
			star.a = trig.angle( star.x, star.y, this.config.pivot.x, this.config.pivot.y );
		
			this.starsArr.push( star );
		}

	},

	checkBounds: function( star ) {
		if ( star.x - star.r > this.renderConfig.w ) {
			return true;
		} else {
			return false;
		}
		
	},

	checkRenderBounds: function( star ) {
		if ( star.x - star.r > 0 ) {
			if ( star.x - star.r < this.renderConfig.w ) {
				if ( star.y - star.r > 0 ) {
					if ( star.y - star.r < this.renderConfig.h ) {
						return true;
					}
				}
			}
		}
		return false;
	},

	resetPosition: function( star ) {
		star.a = this.config.resetA;
	},

	render: function( star ) {

		c = this.renderConfig.ctx;
		c.globalAlpha = this.config.globalAlpha;
		c.fillStyle = 'white';
		c.fillCircle( star.x, star.y, star.r );
		c.globalAlpha = 1;
	},

	update: function() {

		let thisCount = this.config.count;
		let groupPivot = this.config.pivot;

		for ( let i = thisCount - 1; i >= 0; i-- ) {

			let star = this.starsArr[ i ];

			if( this.checkRenderBounds( star ) === true ) {
				this.render( star );
			}

			let newPos = trig.radialDistribution( groupPivot.x, groupPivot.y, star.d, star.a );
			

			star.x = newPos.x;
			star.y = newPos.y;

			star.a += groupPivot.rVel;

			// if( this.checkBounds( star ) === true ) {
			// 	this.resetPosition( star );
			// }

		}

		this.updateAlpha();

	}


}


module.exports = theStars;
},{"./mathUtils.js":20,"./trigonomicUtils.js":29}],29:[function(require,module,exports){
var _trigonomicUtils;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
* cached values
*/

var piByHalf = Math.Pi / 180;
var halfByPi = 180 / Math.PI;
var twoPi = 2 * Math.PI;

/**
* provides trigonmic util methods.
*
* @mixin
*/
var trigonomicUtils = (_trigonomicUtils = {

	twoPi: twoPi,
	piByHalf: piByHalf,
	halfByPi: halfByPi,

	angle: function(originX, originY, targetX, targetY) {
        var dx = originX - targetX;
        var dy = originY - targetY;
        var theta = Math.atan2(-dy, -dx);
        return theta;
    },

	/**
 * @description calculate distance between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @returns {number} result.
 */
	dist: function dist(x1, y1, x2, y2) {
		x2 -= x1;y2 -= y1;
		return Math.sqrt(x2 * x2 + y2 * y2);
	},

	/**
 * @description convert degrees to radians.
 * @param {number} degrees - the degree value to convert.
 * @returns {number} result.
 */
	degreesToRadians: function degreesToRadians(degrees) {
		return degrees * piByHalf;
	},

	/**
 * @description convert radians to degrees.
 * @param {number} radians - the degree value to convert.
 * @returns {number} result.
 */
	radiansToDegrees: function radiansToDegrees(radians) {
		return radians * halfByPi;
	},

	/*
 return useful Trigonomic values from position of 2 objects in x/y space
 where x1/y1 is the current poistion and x2/y2 is the target position
 */
	/**
 * @description calculate trigomomic values between 2 vector coordinates.
 * @param {number} x1 - X coordinate of vector 1.
 * @param {number} y1 - Y coordinate of vector 1.
 * @param {number} x2 - X coordinate of vector 2.
 * @param {number} y2 - Y coordinate of vector 2.
 * @typedef {Object} Calculation
 * @property {number} distance The distance between vectors
 * @property {number} angle The angle between vectors
 * @returns { Calculation } the calculated angle and distance between vectors
 */
	getAngleAndDistance: function getAngleAndDistance(x1, y1, x2, y2) {

		// set up base values
		var dX = x2 - x1;
		var dY = y2 - y1;
		// get the distance between the points
		var d = Math.sqrt(dX * dX + dY * dY);
		// angle in radians
		// var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;
		// angle in radians
		var r = Math.atan2(dY, dX);
		return {
			distance: d,
			angle: r
		};
	},

	/**
 * @description get new X coordinate from angle and distance.
 * @param {number} radians - the angle to transform in radians.
 * @param {number} distance - the distance to transform.
 * @returns {number} result.
 */
	getAdjacentLength: function getAdjacentLength(radians, distance) {
		return Math.cos(radians) * distance;
	}

}, _defineProperty(_trigonomicUtils, "getAdjacentLength", function getAdjacentLength(radians, distance) {
	return Math.sin(radians) * distance;
}), _defineProperty(_trigonomicUtils, "findNewPoint", function findNewPoint(x, y, angle, distance) {
	return {
		x: Math.cos(angle) * distance + x,
		y: Math.sin(angle) * distance + y
	};
}), _defineProperty(_trigonomicUtils, "calculateVelocities", function calculateVelocities(x, y, angle, impulse) {
	var a2 = Math.atan2(Math.sin(angle) * impulse + y - y, Math.cos(angle) * impulse + x - x);
	return {
		xVel: Math.cos(a2) * impulse,
		yVel: Math.sin(a2) * impulse
	};
}), _defineProperty(_trigonomicUtils, "radialDistribution", function radialDistribution(cx, cy, r, a) {
	return {
		x: cx + r * Math.cos(a),
		y: cy + r * Math.sin(a)
	};
}), _trigonomicUtils);

module.exports.trigonomicUtils = trigonomicUtils;
},{}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGJseS1saW5rZWQtbGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9kYmx5LWxpbmtlZC1saXN0L2xpYi9saXN0LW5vZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmlzZXF1YWwvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LXBhdGgvaW5kZXguanMiLCJzcmMvanMvYW5pbWF0aW9uLmpzIiwic3JjL2pzL2FwcC5qcyIsInNyYy9qcy9iYWNrZ3JvdW5kQ3ljbGVyLmpzIiwic3JjL2pzL2JhY2tncm91bmRzLmpzIiwic3JjL2pzL2NhbnZhc0FwaUF1Z21lbnRhdGlvbi5qcyIsInNyYy9qcy9jb2xvclV0aWxzLmpzIiwic3JjL2pzL2NvbnRyb2xQYW5lbC5qcyIsInNyYy9qcy9kZWJ1Z1V0aWxzLmpzIiwic3JjL2pzL2Vhc2luZy5qcyIsInNyYy9qcy9lbnRyeS5qcyIsInNyYy9qcy9lbnZpcm9ubWVudC5qcyIsInNyYy9qcy9leHBvcnRPdmVybGF5LmpzIiwic3JjL2pzL2dlYXJzLmpzIiwic3JjL2pzL2xlbnNGbGFyZS5qcyIsInNyYy9qcy9tYXRoVXRpbHMuanMiLCJzcmMvanMvbm9pc2VDb25maWcuanMiLCJzcmMvanMvbm9pc2VUZXh0dXJlR2VuZXJhdG9yLmpzIiwic3JjL2pzL292ZXJsYXkuanMiLCJzcmMvanMvcHJvcG9ydGlvbmFsTWVhc3VyZXMuanMiLCJzcmMvanMvc2luZVdhdmVNb2R1bGF0b3IuanMiLCJzcmMvanMvc3VuQ29yb25hLmpzIiwic3JjL2pzL3N1blNwaWtlcy5qcyIsInNyYy9qcy90aGVTdGFycy5qcyIsInNyYy9qcy90cmlnb25vbWljVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeHpEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ptQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pPQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2gxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAZmlsZU92ZXJ2aWV3IEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZC1saXN0IGRhdGEgc3RydWN0dXJlXG4gKiBAYXV0aG9yIEphc29uIFMuIEpvbmVzXG4gKiBAbGljZW5zZSBNSVRcbiAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBpc0VxdWFsID0gcmVxdWlyZSgnbG9kYXNoLmlzZXF1YWwnKTtcbiAgICB2YXIgTm9kZSA9IHJlcXVpcmUoJy4vbGliL2xpc3Qtbm9kZScpO1xuICAgIHZhciBJdGVyYXRvciA9IHJlcXVpcmUoJy4vbGliL2l0ZXJhdG9yJyk7XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBEb3VibHkgbGlua2VkIGxpc3QgY2xhc3NcbiAgICAgKlxuICAgICAqIEltcGxlbWVudGF0aW9uIG9mIGEgZG91Ymx5IGxpbmtlZCBsaXN0IGRhdGEgc3RydWN0dXJlLiAgVGhpc1xuICAgICAqIGltcGxlbWVudGF0aW9uIHByb3ZpZGVzIHRoZSBnZW5lcmFsIGZ1bmN0aW9uYWxpdHkgb2YgYWRkaW5nIG5vZGVzIHRvXG4gICAgICogdGhlIGZyb250IG9yIGJhY2sgb2YgdGhlIGxpc3QsIGFzIHdlbGwgYXMgcmVtb3Zpbmcgbm9kZSBmcm9tIHRoZSBmcm9udFxuICAgICAqIG9yIGJhY2suICBUaGlzIGZ1bmN0aW9uYWxpdHkgZW5hYmxlcyB0aGlzIGltcGxlbWVudGlvbiB0byBiZSB0aGVcbiAgICAgKiB1bmRlcmx5aW5nIGRhdGEgc3RydWN0dXJlIGZvciB0aGUgbW9yZSBzcGVjaWZpYyBzdGFjayBvciBxdWV1ZSBkYXRhXG4gICAgICogc3RydWN0dXJlLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBMaW5rZWRMaXN0IGluc3RhbmNlLiAgRWFjaCBpbnN0YW5jZSBoYXMgYSBoZWFkIG5vZGUsIGEgdGFpbFxuICAgICAqIG5vZGUgYW5kIGEgc2l6ZSwgd2hpY2ggcmVwcmVzZW50cyB0aGUgbnVtYmVyIG9mIG5vZGVzIGluIHRoZSBsaXN0LlxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgZnVuY3Rpb24gRG91Ymx5TGlua2VkTGlzdCgpIHtcbiAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWlsID0gbnVsbDtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcblxuICAgICAgICAvLyBhZGQgaXRlcmF0b3IgYXMgYSBwcm9wZXJ0eSBvZiB0aGlzIGxpc3QgdG8gc2hhcmUgdGhlIHNhbWVcbiAgICAgICAgLy8gaXRlcmF0b3IgaW5zdGFuY2Ugd2l0aCBhbGwgb3RoZXIgbWV0aG9kcyB0aGF0IG1heSByZXF1aXJlXG4gICAgICAgIC8vIGl0cyB1c2UuICBOb3RlOiBiZSBzdXJlIHRvIGNhbGwgdGhpcy5pdGVyYXRvci5yZXNldCgpIHRvXG4gICAgICAgIC8vIHJlc2V0IHRoaXMgaXRlcmF0b3IgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICAgIHRoaXMuaXRlcmF0b3IgPSBuZXcgSXRlcmF0b3IodGhpcyk7XG4gICAgfVxuXG4gICAgLyogRnVuY3Rpb25zIGF0dGFjaGVkIHRvIHRoZSBMaW5rZWQtbGlzdCBwcm90b3R5cGUuICBBbGwgbGlua2VkLWxpc3RcbiAgICAgKiBpbnN0YW5jZXMgd2lsbCBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllc1xuICAgICAqIG1hZGUgZm9yIGVhY2ggaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlXG4gICAgICogbWF5IGJlIHNldmVyYWwgZGlmZmVyZW50IGxpbmtlZCBsaXN0cy5cbiAgICAgKi9cbiAgICBEb3VibHlMaW5rZWRMaXN0LnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ3JlYXRlcyBhIG5ldyBOb2RlIG9iamVjdCB3aXRoICdkYXRhJyBhc3NpZ25lZCB0byB0aGUgbm9kZSdzIGRhdGFcbiAgICAgICAgICogcHJvcGVydHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSBOb2RlIG9iamVjdCBpbnRpYWxpemVkIHdpdGggJ2RhdGEnXG4gICAgICAgICAqL1xuICAgICAgICBjcmVhdGVOZXdOb2RlOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBub2RlIGluIHRoZSBsaXN0LCBjb21tb25seSByZWZlcnJlZCB0byBhcyB0aGVcbiAgICAgICAgICogJ2hlYWQnIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIGhlYWQgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0SGVhZE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhlYWQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGxhc3Qgbm9kZSBpbiB0aGUgbGlzdCwgY29tbW9ubHkgcmVmZXJyZWQgdG8gYXMgdGhlXG4gICAgICAgICAqICd0YWlsJ25vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdH0gdGhlIHRhaWwgbm9kZSBvZiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VGFpbE5vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhaWw7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERldGVybWluZXMgaWYgdGhlIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGxpc3QgaXMgZW1wdHksIGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLnNpemUgPT09IDApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBsaXN0LCBvciBudW1iZXIgb2Ygbm9kZXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge251bWJlcn0gdGhlIG51bWJlciBvZiBub2RlcyBpbiB0aGUgbGlzdFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2l6ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2xlYXJzIHRoZSBsaXN0IG9mIGFsbCBub2Rlcy9kYXRhXG4gICAgICAgICAqL1xuICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzRW1wdHkoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgSU5TRVJUIG1ldGhvZHMgIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5zZXJ0cyBhIG5vZGUgd2l0aCB0aGUgcHJvdmlkZWQgZGF0YSB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0OiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhlYWQgPSB0aGlzLnRhaWwgPSBuZXdOb2RlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5wcmV2ID0gdGhpcy50YWlsO1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbCA9IG5ld05vZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgdG8gdGhlIGZyb250IG9mIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgaW5zZXJ0IG9wZXJhdGlvbiB3YXMgc3VjY2Vzc2Z1bFxuICAgICAgICAgKi9cbiAgICAgICAgaW5zZXJ0Rmlyc3Q6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VydChkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld05vZGUgPSB0aGlzLmNyZWF0ZU5ld05vZGUoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICBuZXdOb2RlLm5leHQgPSB0aGlzLmhlYWQ7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkLnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5ld05vZGU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIHdpdGggdGhlIHByb3ZpZGVkIGRhdGEgYXQgdGhlIGluZGV4IGluZGljYXRlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBpbiB0aGUgbGlzdCB0byBpbnNlcnQgdGhlIG5ldyBub2RlXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IGRhdGEgVGhlIGRhdGEgdG8gaW5pdGlhbGl6ZSB3aXRoIHRoZSBub2RlXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBdDogZnVuY3Rpb24gKGluZGV4LCBkYXRhKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuZ2V0SGVhZE5vZGUoKSxcbiAgICAgICAgICAgICAgICBuZXdOb2RlID0gdGhpcy5jcmVhdGVOZXdOb2RlKGRhdGEpLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gMDtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGlmIGluZGV4IGlzIDAsIHdlIGp1c3QgbmVlZCB0byBpbnNlcnQgdGhlIGZpcnN0IG5vZGVcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0Rmlyc3QoZGF0YSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdXJyZW50LnByZXYubmV4dCA9IG5ld05vZGU7XG4gICAgICAgICAgICBuZXdOb2RlLnByZXYgPSBjdXJyZW50LnByZXY7XG4gICAgICAgICAgICBjdXJyZW50LnByZXYgPSBuZXdOb2RlO1xuICAgICAgICAgICAgbmV3Tm9kZS5uZXh0ID0gY3VycmVudDtcblxuICAgICAgICAgICAgdGhpcy5zaXplICs9IDE7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnNlcnRzIGEgbm9kZSBiZWZvcmUgdGhlIGZpcnN0IG5vZGUgY29udGFpbmluZyB0aGUgcHJvdmlkZWQgZGF0YVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0b1xuICAgICAgICAgKiAgICAgICAgIGZpbmQgdG8gaW5zZXJ0IHRoZSBuZXcgbm9kZSBiZWZvcmVcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRCZWZvcmU6IGZ1bmN0aW9uIChub2RlRGF0YSwgZGF0YVRvSW5zZXJ0KSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmluZGV4T2Yobm9kZURhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5zZXJ0QXQoaW5kZXgsIGRhdGFUb0luc2VydCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluc2VydHMgYSBub2RlIGFmdGVyIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG9cbiAgICAgICAgICogICAgICAgICBmaW5kIHRvIGluc2VydCB0aGUgbmV3IG5vZGUgYWZ0ZXJcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gZGF0YVRvSW5zZXJ0IFRoZSBkYXRhIHRvIGluaXRpYWxpemUgd2l0aCB0aGUgbm9kZVxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZSBpZiBpbnNlcnQgb3BlcmF0aW9uIHdhcyBzdWNjZXNzZnVsXG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnRBZnRlcjogZnVuY3Rpb24gKG5vZGVEYXRhLCBkYXRhVG9JbnNlcnQpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpO1xuXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB3ZSB3YW50IHRvIGluc2VydCBuZXcgbm9kZSBhZnRlciB0aGUgdGFpbCBub2RlXG4gICAgICAgICAgICBpZiAoaW5kZXggKyAxID09PSBzaXplKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBzbywgY2FsbCBpbnNlcnQsIHdoaWNoIHdpbGwgYXBwZW5kIHRvIHRoZSBlbmQgYnkgZGVmYXVsdFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluc2VydChkYXRhVG9JbnNlcnQpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpbmNyZW1lbnQgdGhlIGluZGV4IGFuZCBpbnNlcnQgdGhlcmVcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pbnNlcnRBdChpbmRleCArIDEsIGRhdGFUb0luc2VydCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbmNhdGVuYXRlIGFub3RoZXIgbGlua2VkIGxpc3QgdG8gdGhlIGVuZCBvZiB0aGlzIGxpbmtlZCBsaXN0LiBUaGUgcmVzdWx0IGlzIHZlcnlcbiAgICAgICAgICogc2ltaWxhciB0byBhcnJheS5jb25jYXQgYnV0IGhhcyBhIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHNpbmNlIHRoZXJlIGlzIG5vIG5lZWQgdG9cbiAgICAgICAgICogaXRlcmF0ZSBvdmVyIHRoZSBsaXN0c1xuICAgICAgICAgKiBAcGFyYW0ge0RvdWJseUxpbmtlZExpc3R9IG90aGVyTGlua2VkTGlzdFxuICAgICAgICAgKiBAcmV0dXJucyB7RG91Ymx5TGlua2VkTGlzdH1cbiAgICAgICAgICovXG4gICAgICAgIGNvbmNhdDogZnVuY3Rpb24gKG90aGVyTGlua2VkTGlzdCkge1xuICAgICAgICAgICAgaWYgKG90aGVyTGlua2VkTGlzdCBpbnN0YW5jZW9mIERvdWJseUxpbmtlZExpc3QpIHtcbiAgICAgICAgICAgICAgICAvL2NyZWF0ZSBuZXcgbGlzdCBzbyB0aGUgY2FsbGluZyBsaXN0IGlzIGltbXV0YWJsZSAobGlrZSBhcnJheS5jb25jYXQpXG4gICAgICAgICAgICAgICAgdmFyIG5ld0xpc3QgPSBuZXcgRG91Ymx5TGlua2VkTGlzdCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNpemUoKSA+IDApIHsgLy90aGlzIGxpc3QgaXMgTk9UIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QuaGVhZCA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnRhaWwubmV4dCA9IG90aGVyTGlua2VkTGlzdC5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3Quc2l6ZSA9IHRoaXMuZ2V0U2l6ZSgpICsgb3RoZXJMaW5rZWRMaXN0LmdldFNpemUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7IC8vJ3RoaXMnIGxpc3QgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICAgICAgbmV3TGlzdC5oZWFkID0gb3RoZXJMaW5rZWRMaXN0LmdldEhlYWROb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIG5ld0xpc3QudGFpbCA9IG90aGVyTGlua2VkTGlzdC5nZXRUYWlsTm9kZSgpO1xuICAgICAgICAgICAgICAgICAgICBuZXdMaXN0LnNpemUgPSBvdGhlckxpbmtlZExpc3QuZ2V0U2l6ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3TGlzdDtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuIG9ubHkgY29uY2F0IGFub3RoZXIgaW5zdGFuY2Ugb2YgRG91Ymx5TGlua2VkTGlzdFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyMjIyMjIyMjIyMjIyMjIyMjIyBSRU1PVkUgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmVzIHRoZSB0YWlsIG5vZGUgZnJvbSB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGVyZSBpcyBhIHNpZ25pZmljYW50IHBlcmZvcm1hbmNlIGltcHJvdmVtZW50IHdpdGggdGhlIG9wZXJhdGlvblxuICAgICAgICAgKiBvdmVyIGl0cyBzaW5nbHkgbGlua2VkIGxpc3QgY291bnRlcnBhcnQuICBUaGUgbWVyZSBmYWN0IG9mIGhhdmluZ1xuICAgICAgICAgKiBhIHJlZmVyZW5jZSB0byB0aGUgcHJldmlvdXMgbm9kZSBpbXByb3ZlcyB0aGlzIG9wZXJhdGlvbiBmcm9tIE8obilcbiAgICAgICAgICogKGluIHRoZSBjYXNlIG9mIHNpbmdseSBsaW5rZWQgbGlzdCkgdG8gTygxKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZ2V0IGhhbmRsZSBmb3IgdGhlIHRhaWwgbm9kZVxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZ2V0VGFpbE5vZGUoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgaXMgb25seSBvbmUgbm9kZSBpbiB0aGUgbGlzdCwgc2V0IGhlYWQgYW5kIHRhaWxcbiAgICAgICAgICAgIC8vIHByb3BlcnRpZXMgdG8gbnVsbFxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwgPSBudWxsO1xuXG4gICAgICAgICAgICAvLyBtb3JlIHRoYW4gb25lIG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsID0gdGhpcy5nZXRUYWlsTm9kZSgpLnByZXY7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsLm5leHQgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaXplIC09IDE7XG5cbiAgICAgICAgICAgIHJldHVybiBub2RlVG9SZW1vdmU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGhlYWQgbm9kZSBmcm9tIHRoZSBsaXN0XG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIHRoYXQgd2FzIHJlbW92ZWRcbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U2l6ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlID0gdGhpcy5nZXRIZWFkTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZCA9IHRoaXMuaGVhZC5uZXh0O1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZC5wcmV2ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgbm9kZSBhdCB0aGUgaW5kZXggcHJvdmlkZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgbm9kZSB0byByZW1vdmVcbiAgICAgICAgICogQHJldHVybnMgdGhlIG5vZGUgdGhhdCB3YXMgcmVtb3ZlZFxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlQXQ6IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICAgICAgdmFyIG5vZGVUb1JlbW92ZSA9IHRoaXMuZmluZEF0KGluZGV4KTtcblxuICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGluZGV4IG91dC1vZi1ib3VuZHNcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPiB0aGlzLmdldFNpemUoKSAtIDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgMCwgd2UganVzdCBuZWVkIHRvIHJlbW92ZSB0aGUgZmlyc3Qgbm9kZVxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlRmlyc3QoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgaW5kZXggaXMgc2l6ZS0xLCB3ZSBqdXN0IG5lZWQgdG8gcmVtb3ZlIHRoZSBsYXN0IG5vZGUsXG4gICAgICAgICAgICAvLyB3aGljaCByZW1vdmUoKSBkb2VzIGJ5IGRlZmF1bHRcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5nZXRTaXplKCkgLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5wcmV2Lm5leHQgPSBub2RlVG9SZW1vdmUubmV4dDtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0LnByZXYgPSBub2RlVG9SZW1vdmUucHJldjtcbiAgICAgICAgICAgIG5vZGVUb1JlbW92ZS5uZXh0ID0gbm9kZVRvUmVtb3ZlLnByZXYgPSBudWxsO1xuXG4gICAgICAgICAgICB0aGlzLnNpemUgLT0gMTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vZGVUb1JlbW92ZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlcyB0aGUgZmlyc3Qgbm9kZSB0aGF0IGNvbnRhaW5zIHRoZSBkYXRhIHByb3ZpZGVkXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fHN0cmluZ3xudW1iZXJ9IG5vZGVEYXRhIFRoZSBkYXRhIG9mIHRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSB0aGF0IHdhcyByZW1vdmVkXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVOb2RlOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuaW5kZXhPZihub2RlRGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW1vdmVBdChpbmRleCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8jIyMjIyMjIyMjIyMjIyMjIyMgRklORCBtZXRob2RzICMjIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBub2RlIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEuICBJZlxuICAgICAgICAgKiBhIG5vZGUgY2Fubm90IGJlIGZvdW5kIGNvbnRhaW5pbmcgdGhlIHByb3ZpZGVkIGRhdGEsIC0xIGlzIHJldHVybmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdHxzdHJpbmd8bnVtYmVyfSBub2RlRGF0YSBUaGUgZGF0YSBvZiB0aGUgbm9kZSB0byBmaW5kXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBpbmRleE9mOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50O1xuXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgdGhlIGxpc3QgKGtlZXBpbmcgdHJhY2sgb2YgdGhlIGluZGV4IHZhbHVlKSB1bnRpbFxuICAgICAgICAgICAgLy8gd2UgZmluZCB0aGUgbm9kZSBjb250YWluZyB0aGUgbm9kZURhdGEgd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIGZpc3Qgbm9kZSBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLiAgSWYgYSBub2RlXG4gICAgICAgICAqIGNhbm5vdCBiZSBmb3VuZCBjb250YWluaW5nIHRoZSBwcm92aWRlZCBkYXRhLCAtMSBpcyByZXR1cm5lZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgb2YgdGhlIG5vZGUgdG8gZmluZFxuICAgICAgICAgKiBAcmV0dXJucyB0aGUgbm9kZSBpZiBmb3VuZCwgLTEgb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBmaW5kOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIC8vIHN0YXJ0IGF0IHRoZSBoZWFkIG9mIHRoZSBsaXN0XG4gICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0KCk7XG4gICAgICAgICAgICB2YXIgY3VycmVudDtcblxuICAgICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIHRoZSBsaXN0IHVudGlsIHdlIGZpbmQgdGhlIG5vZGUgY29udGFpbmluZyB0aGUgZGF0YVxuICAgICAgICAgICAgLy8gd2UgYXJlIGxvb2tpbmcgZm9yXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5pdGVyYXRvci5oYXNOZXh0KCkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzRXF1YWwoY3VycmVudC5nZXREYXRhKCksIG5vZGVEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIG9ubHkgZ2V0IGhlcmUgaWYgd2UgZGlkbid0IGZpbmQgYSBub2RlIGNvbnRhaW5pbmcgdGhlIG5vZGVEYXRhXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5vZGUgYXQgdGhlIGxvY2F0aW9uIHByb3ZpZGVkIGJ5IGluZGV4XG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIG5vZGUgdG8gcmV0dXJuXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSBub2RlIGxvY2F0ZWQgYXQgdGhlIGluZGV4IHByb3ZpZGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZmluZEF0OiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgICAgIC8vIGlmIGlkeCBpcyBvdXQgb2YgYm91bmRzIG9yIGZuIGNhbGxlZCBvbiBlbXB0eSBsaXN0LCByZXR1cm4gLTFcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSB8fCBpbmRleCA+IHRoaXMuZ2V0U2l6ZSgpIC0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZWxzZSwgbG9vcCB0aHJvdWdoIHRoZSBsaXN0IGFuZCByZXR1cm4gdGhlIG5vZGUgaW4gdGhlXG4gICAgICAgICAgICAvLyBwb3NpdGlvbiBwcm92aWRlZCBieSBpZHguICBBc3N1bWUgemVyby1iYXNlZCBwb3NpdGlvbnMuXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXMuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IDA7XG5cbiAgICAgICAgICAgIHdoaWxlIChwb3NpdGlvbiA8IGluZGV4KSB7XG4gICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCB0aGUgbGlzdCBjb250YWlucyB0aGUgcHJvdmlkZWQgbm9kZURhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R8c3RyaW5nfG51bWJlcn0gbm9kZURhdGEgVGhlIGRhdGEgdG8gY2hlY2sgaWYgdGhlIGxpc3RcbiAgICAgICAgICogICAgICAgIGNvbnRhaW5zXG4gICAgICAgICAqIEByZXR1cm5zIHRoZSB0cnVlIGlmIHRoZSBsaXN0IGNvbnRhaW5zIG5vZGVEYXRhLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRhaW5zOiBmdW5jdGlvbiAobm9kZURhdGEpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGV4T2Yobm9kZURhdGEpID4gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIyMjIyMjIyMjIyMjIyMjIyMjIFVUSUxJVFkgbWV0aG9kcyAjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVdGlsaXR5IGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciB0aGUgbGlzdCBhbmQgY2FsbCB0aGUgZm4gcHJvdmlkZWRcbiAgICAgICAgICogb24gZWFjaCBub2RlLCBvciBlbGVtZW50LCBvZiB0aGUgbGlzdFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgb24gZWFjaCBub2RlIG9mIHRoZSBsaXN0XG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gcmV2ZXJzZSBVc2Ugb3Igbm90IHJldmVyc2UgaXRlcmF0aW9uICh0YWlsIHRvIGhlYWQpLCBkZWZhdWx0IHRvIGZhbHNlXG4gICAgICAgICAqL1xuICAgICAgICBmb3JFYWNoOiBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICAgICAgICAgIHJldmVyc2UgPSByZXZlcnNlIHx8IGZhbHNlO1xuICAgICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLnJlc2V0X3JldmVyc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2hfcmV2ZXJzZShmbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0b3IucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdG9yLmVhY2goZm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCB0aGUgZGF0YSBjb250YWluZWQgaW4gdGhlIGxpc3RcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2FycmF5fSB0aGUgYXJyYXkgb2YgYWxsIHRoZSBkYXRhIGZyb20gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsaXN0QXJyYXkgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgICAgIGxpc3RBcnJheS5wdXNoKG5vZGUuZ2V0RGF0YSgpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gbGlzdEFycmF5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbnRlcnJ1cHRzIGl0ZXJhdGlvbiBvdmVyIHRoZSBsaXN0XG4gICAgICAgICAqL1xuICAgICAgICBpbnRlcnJ1cHRFbnVtZXJhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pdGVyYXRvci5pbnRlcnJ1cHQoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IERvdWJseUxpbmtlZExpc3Q7XG5cbn0oKSk7XG4iLCIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgSW1wbGVtZW50YXRpb24gb2YgYW4gaXRlcmF0b3IgZm9yIGEgbGlua2VkIGxpc3RcbiAqICAgICAgICAgICAgICAgZGF0YSBzdHJ1Y3R1cmVcbiAqIEBhdXRob3IgSmFzb24gUy4gSm9uZXNcbiAqIEBsaWNlbnNlIE1JVFxuICovXG5cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogSXRlcmF0b3IgY2xhc3NcbiAgICAgKlxuICAgICAqIFJlcHJlc2VudHMgYW4gaW5zdGFudGlhdGlvbiBvZiBhbiBpdGVyYXRvciB0byBiZSB1c2VkXG4gICAgICogd2l0aGluIGEgbGlua2VkIGxpc3QuICBUaGUgaXRlcmF0b3Igd2lsbCBwcm92aWRlIHRoZSBhYmlsaXR5XG4gICAgICogdG8gaXRlcmF0ZSBvdmVyIGFsbCBub2RlcyBpbiBhIGxpc3QgYnkga2VlcGluZyB0cmFjayBvZiB0aGVcbiAgICAgKiBwb3N0aXRpb24gb2YgYSAnY3VycmVudE5vZGUnLiAgVGhpcyAnY3VycmVudE5vZGUnIHBvaW50ZXJcbiAgICAgKiB3aWxsIGtlZXAgc3RhdGUgdW50aWwgYSByZXNldCgpIG9wZXJhdGlvbiBpcyBjYWxsZWQgYXQgd2hpY2hcbiAgICAgKiB0aW1lIGl0IHdpbGwgcmVzZXQgdG8gcG9pbnQgdGhlIGhlYWQgb2YgdGhlIGxpc3QuXG4gICAgICpcbiAgICAgKiBFdmVuIHRob3VnaCB0aGlzIGl0ZXJhdG9yIGNsYXNzIGlzIGluZXh0cmljYWJseSBsaW5rZWRcbiAgICAgKiAobm8gcHVuIGludGVuZGVkKSB0byBhIGxpbmtlZCBsaXN0IGluc3RhdGlhdGlvbiwgaXQgd2FzIHJlbW92ZWRcbiAgICAgKiBmcm9tIHdpdGhpbiB0aGUgbGlua2VkIGxpc3QgY29kZSB0byBhZGhlcmUgdG8gdGhlIGJlc3QgcHJhY3RpY2VcbiAgICAgKiBvZiBzZXBhcmF0aW9uIG9mIGNvbmNlcm5zLlxuICAgICAqXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaXRlcmF0b3IgaW5zdGFuY2UgdG8gaXRlcmF0ZSBvdmVyIHRoZSBsaW5rZWQgbGlzdCBwcm92aWRlZC5cbiAgICAgKlxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBJdGVyYXRvcih0aGVMaXN0KSB7XG4gICAgICAgIHRoaXMubGlzdCA9IHRoZUxpc3QgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIGEgcG9pbnRlciB0aGUgY3VycmVudCBub2RlIGluIHRoZSBsaXN0IHRoYXQgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgICAgLy8gaW5pdGlhbGx5IHRoaXMgd2lsbCBiZSBudWxsIHNpbmNlIHRoZSAnbGlzdCcgd2lsbCBiZSBlbXB0eVxuICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIEl0ZXJhdG9yIHByb3RvdHlwZS4gIEFsbCBpdGVyYXRvciBpbnN0YW5jZXNcbiAgICAgKiB3aWxsIHNoYXJlIHRoZXNlIG1ldGhvZHMsIG1lYW5pbmcgdGhlcmUgd2lsbCBOT1QgYmUgY29waWVzIG1hZGUgZm9yIGVhY2hcbiAgICAgKiBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBJdGVyYXRvci5wcm90b3R5cGUgPSB7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudE5vZGU7XG4gICAgICAgICAgICAvLyBhIGNoZWNrIHRvIHByZXZlbnQgZXJyb3IgaWYgcmFuZG9tbHkgY2FsbGluZyBuZXh0KCkgd2hlblxuICAgICAgICAgICAgLy8gaXRlcmF0b3IgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCwgbWVhaW5pbmcgdGhlIGN1cnJlbnROb2RlXG4gICAgICAgICAgICAvLyB3aWxsIGJlIHBvaW50aW5nIHRvIG51bGwuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gV2hlbiB0aGlzIGZ1bmN0aW9uIGlzIGNhbGxlZCwgaXQgd2lsbCByZXR1cm4gdGhlIG5vZGUgY3VycmVudGx5XG4gICAgICAgICAgICAvLyBhc3NpZ25lZCB0byB0aGlzLmN1cnJlbnROb2RlIGFuZCBtb3ZlIHRoZSBwb2ludGVyIHRvIHRoZSBuZXh0XG4gICAgICAgICAgICAvLyBub2RlIGluIHRoZSBsaXN0IChpZiBpdCBleGlzdHMpXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmN1cnJlbnROb2RlLm5leHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVyblxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBpdGVyYXRvciBoYXMgYSBub2RlIHRvIHJldHVybiwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICAgICAqL1xuICAgICAgICBoYXNOZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50Tm9kZSAhPT0gbnVsbDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVzZXRzIHRoZSBpdGVyYXRvciB0byB0aGUgYmVnaW5uaW5nIG9mIHRoZSBsaXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE5vZGUgPSB0aGlzLmxpc3QuZ2V0SGVhZE5vZGUoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGZpcnN0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0KCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0aGVMaXN0IHRoZSBsaW5rZWQgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgICAgICovXG4gICAgICAgIHNldExpc3Q6IGZ1bmN0aW9uICh0aGVMaXN0KSB7XG4gICAgICAgICAgICB0aGlzLmxpc3QgPSB0aGVMaXN0O1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJdGVyYXRlcyBvdmVyIGFsbCBub2RlcyBpbiB0aGUgbGlzdCBhbmQgY2FsbHMgdGhlIHByb3ZpZGVkIGNhbGxiYWNrXG4gICAgICAgICAqIGZ1bmN0aW9uIHdpdGggZWFjaCBub2RlIGFzIGFuIGFyZ3VtZW50LlxuICAgICAgICAgKiBJdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aXRoXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgIGVhY2ggbm9kZSBvZiB0aGUgbGlzdCBhcyBhbiBhcmdcbiAgICAgICAgICovXG4gICAgICAgIGVhY2g6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdmFyIGVsO1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuaGFzTmV4dCgpICYmICF0aGlzLnN0b3BJdGVyYXRpb25GbGFnKSB7XG4gICAgICAgICAgICAgICAgZWwgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnN0b3BJdGVyYXRpb25GbGFnID0gZmFsc2U7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLypcbiAgICAgICAgICogIyMjIFJFVkVSU0UgSVRFUkFUSU9OIChUQUlMIC0+IEhFQUQpICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZmlyc3Qgbm9kZSBpbiB0aGUgbGlzdCBhbmQgbW92ZXMgdGhlIGl0ZXJhdG9yIHRvXG4gICAgICAgICAqIHBvaW50IHRvIHRoZSBzZWNvbmQgbm9kZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMgdGhlIGZpcnN0IG5vZGUgaW4gdGhlIGxpc3RcbiAgICAgICAgICovXG4gICAgICAgIGxhc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRfcmV2ZXJzZSgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlc2V0cyB0aGUgaXRlcmF0b3IgdG8gdGhlIHRhaWwgb2YgdGhlIGxpc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXNldF9yZXZlcnNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb2RlID0gdGhpcy5saXN0LmdldFRhaWxOb2RlKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIG5leHQgbm9kZSBpbiB0aGUgaXRlcmF0aW9uLCB3aGVuIGl0ZXJhdGluZyBmcm9tIHRhaWwgdG8gaGVhZFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgbmV4dCBub2RlIGluIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBuZXh0X3JldmVyc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnROb2RlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm9kZSA9IHRoaXMuY3VycmVudE5vZGUucHJldjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEl0ZXJhdGVzIG92ZXIgYWxsIG5vZGVzIGluIHRoZSBsaXN0IGFuZCBjYWxscyB0aGUgcHJvdmlkZWQgY2FsbGJhY2tcbiAgICAgICAgICogZnVuY3Rpb24gd2l0aCBlYWNoIG5vZGUgYXMgYW4gYXJndW1lbnQsXG4gICAgICAgICAqIHN0YXJ0aW5nIGZyb20gdGhlIHRhaWwgYW5kIGdvaW5nIHRvd2FyZHMgdGhlIGhlYWQuXG4gICAgICAgICAqIFRoZSBpdGVyYXRpb24gd2lsbCBicmVhayBpZiBpbnRlcnJ1cHQoKSBpcyBjYWxsZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aGluXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgICBlYWNoIG5vZGUgYXMgYW4gYXJnXG4gICAgICAgICAqL1xuICAgICAgICBlYWNoX3JldmVyc2U6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5yZXNldF9yZXZlcnNlKCk7XG4gICAgICAgICAgICB2YXIgZWw7XG4gICAgICAgICAgICB3aGlsZSAodGhpcy5oYXNOZXh0KCkgJiYgIXRoaXMuc3RvcEl0ZXJhdGlvbkZsYWcpIHtcbiAgICAgICAgICAgICAgICBlbCA9IHRoaXMubmV4dF9yZXZlcnNlKCk7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IGZhbHNlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qXG4gICAgICAgICAqICMjIyBJTlRFUlJVUFQgSVRFUkFUSU9OICMjI1xuICAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmFpc2VzIGludGVycnVwdCBmbGFnICh0aGF0IHdpbGwgc3RvcCBlYWNoKCkgb3IgZWFjaF9yZXZlcnNlKCkpXG4gICAgICAgICAqL1xuXG4gICAgICAgIGludGVycnVwdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wSXRlcmF0aW9uRmxhZyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBJdGVyYXRvcjtcblxufSgpKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogTGlua2VkIGxpc3Qgbm9kZSBjbGFzc1xuICAgICAqXG4gICAgICogSW50ZXJuYWwgcHJpdmF0ZSBjbGFzcyB0byByZXByZXNlbnQgYSBub2RlIHdpdGhpblxuICAgICAqIGEgbGlua2VkIGxpc3QuICBFYWNoIG5vZGUgaGFzIGEgJ2RhdGEnIHByb3BlcnR5IGFuZFxuICAgICAqIGEgcG9pbnRlciB0aGUgcHJldmlvdXMgbm9kZSBhbmQgdGhlIG5leHQgbm9kZSBpbiB0aGUgbGlzdC5cbiAgICAgKlxuICAgICAqIFNpbmNlIHRoZSAnTm9kZScgZnVuY3Rpb24gaXMgbm90IGFzc2lnbmVkIHRvXG4gICAgICogbW9kdWxlLmV4cG9ydHMgaXQgaXMgbm90IHZpc2libGUgb3V0c2lkZSBvZiB0aGlzXG4gICAgICogZmlsZSwgdGhlcmVmb3JlLCBpdCBpcyBwcml2YXRlIHRvIHRoZSBMaW5rZWRMaXN0XG4gICAgICogY2xhc3MuXG4gICAgICpcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5vZGUgb2JqZWN0IHdpdGggYSBkYXRhIHByb3BlcnR5IGFuZCBwb2ludGVyXG4gICAgICogdG8gdGhlIG5leHQgbm9kZVxuICAgICAqXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R8bnVtYmVyfHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBpbml0aWFsaXplIHdpdGggdGhlIG5vZGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgdGhpcy5uZXh0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKiBGdW5jdGlvbnMgYXR0YWNoZWQgdG8gdGhlIE5vZGUgcHJvdG90eXBlLiAgQWxsIG5vZGUgaW5zdGFuY2VzIHdpbGxcbiAgICAgKiBzaGFyZSB0aGVzZSBtZXRob2RzLCBtZWFuaW5nIHRoZXJlIHdpbGwgTk9UIGJlIGNvcGllcyBtYWRlIGZvciBlYWNoXG4gICAgICogaW5zdGFuY2UuICBUaGlzIHdpbGwgYmUgYSBodWdlIG1lbW9yeSBzYXZpbmdzIHNpbmNlIHRoZXJlIHdpbGwgbGlrZWx5XG4gICAgICogYmUgYSBsYXJnZSBudW1iZXIgb2YgaW5kaXZpZHVhbCBub2Rlcy5cbiAgICAgKi9cbiAgICBOb2RlLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgbm9kZSBoYXMgYSBwb2ludGVyIHRvIHRoZSBuZXh0IG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBuZXh0IG5vZGU7IGZhbHNlIG90aGVyd2lzZVxuICAgICAgICAgKi9cbiAgICAgICAgaGFzTmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICh0aGlzLm5leHQgIT09IG51bGwpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBub2RlIGhhcyBhIHBvaW50ZXIgdG8gdGhlIHByZXZpb3VzIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgaXMgYSBwcmV2aW91cyBub2RlOyBmYWxzZSBvdGhlcndpc2VcbiAgICAgICAgICovXG4gICAgICAgIGhhc1ByZXY6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5wcmV2ICE9PSBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgZGF0YSBvZiB0aGUgdGhlIG5vZGVcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybnMge29iamVjdHxzdHJpbmd8bnVtYmVyfSB0aGUgZGF0YSBvZiB0aGUgbm9kZVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0RGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyBhIHN0cmluZyByZXByZXNlbmF0aW9uIG9mIHRoZSBub2RlLiAgSWYgdGhlIGRhdGEgaXMgYW5cbiAgICAgICAgICogb2JqZWN0LCBpdCByZXR1cm5zIHRoZSBKU09OLnN0cmluZ2lmeSB2ZXJzaW9uIG9mIHRoZSBvYmplY3QuXG4gICAgICAgICAqIE90aGVyd2lzZSwgaXQgc2ltcGx5IHJldHVybnMgdGhlIGRhdGFcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc3RyaW5nIHJlcHJlc2VuYXRpb24gb2YgdGhlIG5vZGUgZGF0YVxuICAgICAgICAgKi9cbiAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmRhdGEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuXG59KCkpO1xuIiwiLyoqXG4gKiBMb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBKUyBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanMuZm91bmRhdGlvbi8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgU3ltYm9sID0gcm9vdC5TeW1ib2wsXG4gICAgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheSxcbiAgICBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLFxuICAgIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlLFxuICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gICAgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKSxcbiAgICBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpLFxuICAgIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKSxcbiAgICBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpLFxuICAgIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKSxcbiAgICBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3RMaWtlKHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gb2JqSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvYmplY3QpLFxuICAgICAgb3RoVGFnID0gb3RoSXNBcnIgPyBhcnJheVRhZyA6IGdldFRhZyhvdGhlcik7XG5cbiAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuXG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGdldEFsbEtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0gZ2V0QWxsS2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBhcnJheUZpbHRlcihuYXRpdmVHZXRTeW1ib2xzKG9iamVjdCksIGZ1bmN0aW9uKHN5bWJvbCkge1xuICAgIHJldHVybiBwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgY29tcGFyZWQgYnkgc3RyaWN0IGVxdWFsaXR5LCBpLmUuIGA9PT1gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3Rvcnkpe1xuICAndXNlIHN0cmljdCc7XG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dDpjYW50IHRlc3QqL1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIHJvb3Qub2JqZWN0UGF0aCA9IGZhY3RvcnkoKTtcbiAgfVxufSkodGhpcywgZnVuY3Rpb24oKXtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciB0b1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgIGlmKG9iaiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgLy90byBoYW5kbGUgb2JqZWN0cyB3aXRoIG51bGwgcHJvdG90eXBlcyAodG9vIGVkZ2UgY2FzZT8pXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApXG4gIH1cblxuICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKXtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgZm9yICh2YXIgaSBpbiB2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9TdHJpbmcodHlwZSl7XG4gICAgcmV0dXJuIHRvU3RyLmNhbGwodHlwZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc09iamVjdChvYmope1xuICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiB0b1N0cmluZyhvYmopID09PSBcIltvYmplY3QgT2JqZWN0XVwiO1xuICB9XG5cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uKG9iail7XG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgbmV4dDpjYW50IHRlc3QqL1xuICAgIHJldHVybiB0b1N0ci5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKXtcbiAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Jvb2xlYW4nIHx8IHRvU3RyaW5nKG9iaikgPT09ICdbb2JqZWN0IEJvb2xlYW5dJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEtleShrZXkpe1xuICAgIHZhciBpbnRLZXkgPSBwYXJzZUludChrZXkpO1xuICAgIGlmIChpbnRLZXkudG9TdHJpbmcoKSA9PT0ga2V5KSB7XG4gICAgICByZXR1cm4gaW50S2V5O1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9XG5cbiAgZnVuY3Rpb24gZmFjdG9yeShvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAgIHZhciBvYmplY3RQYXRoID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0UGF0aCkucmVkdWNlKGZ1bmN0aW9uKHByb3h5LCBwcm9wKSB7XG4gICAgICAgIGlmKHByb3AgPT09ICdjcmVhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICB9XG5cbiAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZWxzZSovXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0UGF0aFtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHByb3h5W3Byb3BdID0gb2JqZWN0UGF0aFtwcm9wXS5iaW5kKG9iamVjdFBhdGgsIG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgICB9LCB7fSk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhhc1NoYWxsb3dQcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgICAgIHJldHVybiAob3B0aW9ucy5pbmNsdWRlSW5oZXJpdGVkUHJvcHMgfHwgKHR5cGVvZiBwcm9wID09PSAnbnVtYmVyJyAmJiBBcnJheS5pc0FycmF5KG9iaikpIHx8IGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0U2hhbGxvd1Byb3BlcnR5KG9iaiwgcHJvcCkge1xuICAgICAgaWYgKGhhc1NoYWxsb3dQcm9wZXJ0eShvYmosIHByb3ApKSB7XG4gICAgICAgIHJldHVybiBvYmpbcHJvcF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIGRvTm90UmVwbGFjZSl7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgICB9XG4gICAgICBpZiAoIXBhdGggfHwgcGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIHNldChvYmosIHBhdGguc3BsaXQoJy4nKS5tYXAoZ2V0S2V5KSwgdmFsdWUsIGRvTm90UmVwbGFjZSk7XG4gICAgICB9XG4gICAgICB2YXIgY3VycmVudFBhdGggPSBwYXRoWzBdO1xuICAgICAgdmFyIGN1cnJlbnRWYWx1ZSA9IGdldFNoYWxsb3dQcm9wZXJ0eShvYmosIGN1cnJlbnRQYXRoKTtcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlID09PSB2b2lkIDAgfHwgIWRvTm90UmVwbGFjZSkge1xuICAgICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoY3VycmVudFZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgICAgLy9jaGVjayBpZiB3ZSBhc3N1bWUgYW4gYXJyYXlcbiAgICAgICAgaWYodHlwZW9mIHBhdGhbMV0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgb2JqW2N1cnJlbnRQYXRoXSA9IFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9ialtjdXJyZW50UGF0aF0gPSB7fTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2V0KG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSksIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICAgIH1cblxuICAgIG9iamVjdFBhdGguaGFzID0gZnVuY3Rpb24gKG9iaiwgcGF0aCkge1xuICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnbnVtYmVyJykge1xuICAgICAgICBwYXRoID0gW3BhdGhdO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcGF0aCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFwYXRoIHx8IHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAhIW9iajtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXRoLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBqID0gZ2V0S2V5KHBhdGhbaV0pO1xuXG4gICAgICAgIGlmKCh0eXBlb2YgaiA9PT0gJ251bWJlcicgJiYgaXNBcnJheShvYmopICYmIGogPCBvYmoubGVuZ3RoKSB8fFxuICAgICAgICAgIChvcHRpb25zLmluY2x1ZGVJbmhlcml0ZWRQcm9wcyA/IChqIGluIE9iamVjdChvYmopKSA6IGhhc093blByb3BlcnR5KG9iaiwgaikpKSB7XG4gICAgICAgICAgb2JqID0gb2JqW2pdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5lbnN1cmVFeGlzdHMgPSBmdW5jdGlvbiAob2JqLCBwYXRoLCB2YWx1ZSl7XG4gICAgICByZXR1cm4gc2V0KG9iaiwgcGF0aCwgdmFsdWUsIHRydWUpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLnNldCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2Upe1xuICAgICAgcmV0dXJuIHNldChvYmosIHBhdGgsIHZhbHVlLCBkb05vdFJlcGxhY2UpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmluc2VydCA9IGZ1bmN0aW9uIChvYmosIHBhdGgsIHZhbHVlLCBhdCl7XG4gICAgICB2YXIgYXJyID0gb2JqZWN0UGF0aC5nZXQob2JqLCBwYXRoKTtcbiAgICAgIGF0ID0gfn5hdDtcbiAgICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICAgIGFyciA9IFtdO1xuICAgICAgICBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIGFycik7XG4gICAgICB9XG4gICAgICBhcnIuc3BsaWNlKGF0LCAwLCB2YWx1ZSk7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguZW1wdHkgPSBmdW5jdGlvbihvYmosIHBhdGgpIHtcbiAgICAgIGlmIChpc0VtcHR5KHBhdGgpKSB7XG4gICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICB9XG4gICAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbHVlLCBpO1xuICAgICAgaWYgKCEodmFsdWUgPSBvYmplY3RQYXRoLmdldChvYmosIHBhdGgpKSkge1xuICAgICAgICByZXR1cm4gdm9pZCAwO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCAnJyk7XG4gICAgICB9IGVsc2UgaWYgKGlzQm9vbGVhbih2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguc2V0KG9iaiwgcGF0aCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIDApO1xuICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZS5sZW5ndGggPSAwO1xuICAgICAgfSBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgZm9yIChpIGluIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGhhc1NoYWxsb3dQcm9wZXJ0eSh2YWx1ZSwgaSkpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLnNldChvYmosIHBhdGgsIG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLnB1c2ggPSBmdW5jdGlvbiAob2JqLCBwYXRoIC8qLCB2YWx1ZXMgKi8pe1xuICAgICAgdmFyIGFyciA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aCk7XG4gICAgICBpZiAoIWlzQXJyYXkoYXJyKSkge1xuICAgICAgICBhcnIgPSBbXTtcbiAgICAgICAgb2JqZWN0UGF0aC5zZXQob2JqLCBwYXRoLCBhcnIpO1xuICAgICAgfVxuXG4gICAgICBhcnIucHVzaC5hcHBseShhcnIsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpO1xuICAgIH07XG5cbiAgICBvYmplY3RQYXRoLmNvYWxlc2NlID0gZnVuY3Rpb24gKG9iaiwgcGF0aHMsIGRlZmF1bHRWYWx1ZSkge1xuICAgICAgdmFyIHZhbHVlO1xuXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGF0aHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKCh2YWx1ZSA9IG9iamVjdFBhdGguZ2V0KG9iaiwgcGF0aHNbaV0pKSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfTtcblxuICAgIG9iamVjdFBhdGguZ2V0ID0gZnVuY3Rpb24gKG9iaiwgcGF0aCwgZGVmYXVsdFZhbHVlKXtcbiAgICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcGF0aCA9IFtwYXRoXTtcbiAgICAgIH1cbiAgICAgIGlmICghcGF0aCB8fCBwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLmdldChvYmosIHBhdGguc3BsaXQoJy4nKSwgZGVmYXVsdFZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGN1cnJlbnRQYXRoID0gZ2V0S2V5KHBhdGhbMF0pO1xuICAgICAgdmFyIG5leHRPYmogPSBnZXRTaGFsbG93UHJvcGVydHkob2JqLCBjdXJyZW50UGF0aClcbiAgICAgIGlmIChuZXh0T2JqID09PSB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBuZXh0T2JqO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqZWN0UGF0aC5nZXQob2JqW2N1cnJlbnRQYXRoXSwgcGF0aC5zbGljZSgxKSwgZGVmYXVsdFZhbHVlKTtcbiAgICB9O1xuXG4gICAgb2JqZWN0UGF0aC5kZWwgPSBmdW5jdGlvbiBkZWwob2JqLCBwYXRoKSB7XG4gICAgICBpZiAodHlwZW9mIHBhdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgIHBhdGggPSBbcGF0aF07XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFbXB0eShwYXRoKSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgICAgaWYodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RQYXRoLmRlbChvYmosIHBhdGguc3BsaXQoJy4nKSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjdXJyZW50UGF0aCA9IGdldEtleShwYXRoWzBdKTtcbiAgICAgIGlmICghaGFzU2hhbGxvd1Byb3BlcnR5KG9iaiwgY3VycmVudFBhdGgpKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmKHBhdGgubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICBvYmouc3BsaWNlKGN1cnJlbnRQYXRoLCAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgb2JqW2N1cnJlbnRQYXRoXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFBhdGguZGVsKG9ialtjdXJyZW50UGF0aF0sIHBhdGguc2xpY2UoMSkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cblxuICAgIHJldHVybiBvYmplY3RQYXRoO1xuICB9XG5cbiAgdmFyIG1vZCA9IGZhY3RvcnkoKTtcbiAgbW9kLmNyZWF0ZSA9IGZhY3Rvcnk7XG4gIG1vZC53aXRoSW5oZXJpdGVkUHJvcHMgPSBmYWN0b3J5KHtpbmNsdWRlSW5oZXJpdGVkUHJvcHM6IHRydWV9KVxuICByZXR1cm4gbW9kO1xufSk7XG4iLCJ2YXIgYW5pbWF0aW9uID0ge1xyXG4gICAgc3RhdGU6IGZhbHNlLFxyXG4gICAgY291bnRlcjogMCxcclxuICAgIGR1cmF0aW9uOiAyNDBcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLmFuaW1hdGlvbiA9IGFuaW1hdGlvbjsiLCIvLyBkZXBlbmRlbmNpZXNcclxuLy8gU1BcclxuLy8gRklMMTUzMzgrQFxyXG5cclxuLy8gTlBNXHJcbiAgICB2YXIgTGlua2VkTGlzdCA9IHJlcXVpcmUoJ2RibHktbGlua2VkLWxpc3QnKTtcclxuICAgIHZhciBvYmplY3RQYXRoID0gcmVxdWlyZShcIm9iamVjdC1wYXRoXCIpO1xyXG5cclxuLy8gQ3VzdG9tIFJlcXVpcmVzXHJcbiAgICB2YXIgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbiAgICB2YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG4gICAgcmVxdWlyZSgnLi9jYW52YXNBcGlBdWdtZW50YXRpb24uanMnKTtcclxuICAgIHZhciBjb2xvcmluZyA9IHJlcXVpcmUoJy4vY29sb3JVdGlscy5qcycpLmNvbG9yVXRpbHM7XHJcbiAgICB2YXIgZWFzaW5nID0gcmVxdWlyZSgnLi9lYXNpbmcuanMnKS5lYXNpbmdFcXVhdGlvbnM7XHJcbiAgICB2YXIgYW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24uanMnKS5hbmltYXRpb247XHJcbiAgICB2YXIgZGVidWdDb25maWcgPSByZXF1aXJlKCcuL2RlYnVnVXRpbHMuanMnKTtcclxuICAgIHZhciBkZWJ1ZyA9IGRlYnVnQ29uZmlnLmRlYnVnO1xyXG4gICAgdmFyIGxhc3RDYWxsZWRUaW1lID0gZGVidWdDb25maWcubGFzdENhbGxlZFRpbWU7XHJcbiAgICB2YXIgZW52aXJvbm1lbnQgPSByZXF1aXJlKCcuL2Vudmlyb25tZW50LmpzJykuZW52aXJvbm1lbnQ7XHJcbiAgICB2YXIgcGh5c2ljcyA9IGVudmlyb25tZW50LmZvcmNlcztcclxuICAgIHZhciBydW50aW1lRW5naW5lID0gZW52aXJvbm1lbnQucnVudGltZUVuZ2luZTtcclxuICAgIFxyXG4gICAgcmVxdWlyZSgnLi9nZWFycy5qcycpO1xyXG4gICAgXHJcbiAgICB2YXIgb3ZlcmxheUNmZyA9IHJlcXVpcmUoJy4vb3ZlcmxheS5qcycpLm92ZXJsYXlDZmc7XHJcblxyXG4gICAgdmFyIHN1bkNvcm9uYSA9IHJlcXVpcmUoJy4vc3VuQ29yb25hLmpzJyk7XHJcbiAgICB2YXIgc3VuU3Bpa2VzID0gcmVxdWlyZSgnLi9zdW5TcGlrZXMuanMnKTtcclxuICAgIHZhciBsZW5zRmxhcmUgPSByZXF1aXJlKCcuL2xlbnNGbGFyZS5qcycpO1xyXG4gICAgdmFyIHNpbmVXYXZlID0gcmVxdWlyZSgnLi9zaW5lV2F2ZU1vZHVsYXRvci5qcycpLnNpbmVXYXZlO1xyXG4gICAgdmFyIHByb3BvcnRpb25hbE1lYXN1cmVzID0gcmVxdWlyZSgnLi9wcm9wb3J0aW9uYWxNZWFzdXJlcy5qcycpO1xyXG4gICAgdmFyIGJnQ3ljbGVyID0gcmVxdWlyZSgnLi9iYWNrZ3JvdW5kQ3ljbGVyLmpzJyk7XHJcbiAgICB2YXIgdGhlU3RhcnMgPSByZXF1aXJlKCcuL3RoZVN0YXJzLmpzJyk7XHJcbiAgICAvLyB2YXIgbXVzY2xlTW9kaWZpZXIgPSByZXF1aXJlKCcuL211c2NsZU1vZGlmaWVyLmpzJykubXVzY2xlTW9kaWZpZXI7XHJcbiAgICAvLyB2YXIgc2VxID0gcmVxdWlyZSgnLi9zZXF1ZW5jZXIuanMnKTtcclxuICAgIC8vIHZhciBzZXFMaXN0ID0gc2VxLnNlcUxpc3Q7XHJcbiAgICAvLyB2YXIgdHJhY2tQbGF5ZXIgPSByZXF1aXJlKCcuL3RyYWNrUGxheWVyLmpzJyk7XHJcblxyXG4vLyBiYXNlIHZhcmlhYmxlc1xyXG4gICAgdmFyIG1vdXNlWCA9IDAsIFxyXG4gICAgICAgIG1vdXNlWSA9IDAsIFxyXG4gICAgICAgIGxhc3RNb3VzZVggPSAwLCBcclxuICAgICAgICBsYXN0TW91c2VZID0gMCwgXHJcbiAgICAgICAgZnJhbWVSYXRlID0gNjAsIFxyXG4gICAgICAgIGxhc3RVcGRhdGUgPSBEYXRlLm5vdygpLFxyXG4gICAgICAgIG1vdXNlRG93biA9IGZhbHNlLFxyXG4gICAgICAgIHJ1bnRpbWUgPSAwLFxyXG4gICAgICAgIHBMaXZlID0gMCxcclxuICAgICAgICBnbG9iYWxDbG9jayA9IDAsXHJcbiAgICAgICAgY291bnRlciA9IDAsXHJcbiAgICAgICAgZGlzcGxheU92ZXJsYXkgPSBmYWxzZTtcclxuXHJcbi8vIGNyZWF0ZSB3aW5kb3cgbG9hZCBmdW5jdGlvbiwgaW5pdGlhbGlzZSBtb3VzZSB0cmFja2luZ1xyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICBcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBtb3VzZVggPSBlLmNsaWVudFg7XHJcbiAgICAgICAgICAgIG1vdXNlWSA9IGUuY2xpZW50WTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uKGUpe21vdXNlRG93biA9dHJ1ZTsgaWYodHlwZW9mIG9uTW91c2VEb3duID09ICdmdW5jdGlvbicpIG9uTW91c2VEb3duKCkgO30pO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24oZSl7bW91c2VEb3duID0gZmFsc2U7aWYodHlwZW9mIG9uTW91c2VVcCA9PSAnZnVuY3Rpb24nKSBvbk1vdXNlVXAoKSAgO30pO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSl7aWYodHlwZW9mIG9uS2V5RG93biA9PSAnZnVuY3Rpb24nKSBvbktleURvd24oZSkgIDt9KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBpZih0eXBlb2Ygd2luZG93LnNldHVwID09ICdmdW5jdGlvbicpIHdpbmRvdy5zZXR1cCgpO1xyXG4gICAgICAgIC8vIGNqc2xvb3AoKTsgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vIHdpbmRvdyBsb2FkIGZ1bmN0aW9uXHJcbiAgICAvLyBpbmNsdWRlcyBtb3VzZSB0cmFja2luZ1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLGluaXQpO1xyXG5cclxuLy8gc3RhdGljIGFzc2V0IGNhbnZhc2VzXHJcbmxldCBzdGF0aWNBc3NldENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5sZXQgc3RhdGljQXNzZXRDdHggPSBzdGF0aWNBc3NldENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbnN0YXRpY0Fzc2V0Q2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAyO1xyXG5zdGF0aWNBc3NldENhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAyO1xyXG5cclxudmFyIHN0YXRpY0Fzc2V0Q29uZmlncyA9IHt9O1xyXG52YXIgaW1hZ2VBc3NldENvbmZpZ3MgPSB7fTtcclxuXHJcbmxldCBzZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5sZXQgc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHggPSBzZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbnNlY29uZGFyeVN0YXRpY0Fzc2V0Q2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiAyO1xyXG5zZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAyO1xyXG5cclxubGV0IGZsYXJlQXNzZXRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxubGV0IGZsYXJlQXNzZXRDdHggPSBmbGFyZUFzc2V0Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuZmxhcmVBc3NldENhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoICogMjtcclxuZmxhcmVBc3NldENhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAyO1xyXG5mbGFyZUFzc2V0Q2FudmFzLmlkID0gJ2ZsYXJlQXNzZXRDYW52YXMnO1xyXG5cclxubGV0IGJnR2xhcmVDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxubGV0IGJnR2xhcmVDdHggPSBiZ0dsYXJlQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuYmdHbGFyZUNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG5iZ0dsYXJlQ2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHJcbmxldCBsZW5zRmxhcmVDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxubGV0IGxlbnNGbGFyZUN0eCA9IGxlbnNGbGFyZUNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG5cclxuXHJcbi8vIHN0YW5kYXJkIGNhbnZhcyByZW5kZXJpbmdcclxuLy8gY2FudmFzIGhvdXNla2VlcGluZ1xyXG5cclxuLy8vLyBTY3JlZW4gUmVuZGVyZXJzXHJcblxyXG4vLyBmYWNlIGxheWVyXHJcbnZhciBjYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2ZhY2UtbGF5ZXJcIik7XHJcbnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5jdHguaW1hZ2VTbW9vdGhpbmdRdWFsaXR5ID0gXCJoaWdoXCI7XHJcblxyXG52YXIgZmxhcmVMYXllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZmxhcmUtbGF5ZXJcIik7XHJcbnZhciBmbGFyZUxheWVyQ3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcbnZhciBjb3JvbmFMYXllciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29yb25hLWxheWVyXCIpO1xyXG52YXIgY29yb25hTGF5ZXJDdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuXHJcbi8vIGNhY2hlIGNhbnZhcyB3L2hcclxudmFyIGNhblcgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxudmFyIGNhbkggPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbnZhciBjYW52YXNDZW50cmVIID0gY2FuVyAvIDI7XHJcbnZhciBjYW52YXNDZW50cmVWID0gY2FuSCAvIDI7XHJcblxyXG4vLyBzZXQgY2FudmFzZXMgdG8gZnVsbC1zY3JlZW5cclxuY2FudmFzLndpZHRoID0gY2FuVztcclxuY2FudmFzLmhlaWdodCA9IGNhbkg7XHJcbmZsYXJlTGF5ZXIud2lkdGggPSBjYW5XO1xyXG5mbGFyZUxheWVyLmhlaWdodCA9IGNhbkg7XHJcbmNvcm9uYUxheWVyLndpZHRoID0gY2FuVztcclxuY29yb25hTGF5ZXIuaGVpZ2h0ID0gY2FuSDtcclxuXHJcblxyXG4vLyBzZXQgYmFzZSBjYW52YXMgY29uZmlnXHJcbnZhciBjYW52YXNDb25maWcgPSB7XHJcbiAgICB3aWR0aDogY2FuVyxcclxuICAgIGhlaWdodDogY2FuSCxcclxuICAgIGNlbnRlckg6IGNhbnZhc0NlbnRyZUgsXHJcbiAgICBjZW50ZXJWOiBjYW52YXNDZW50cmVWLFxyXG5cclxuICAgIGJ1ZmZlckNsZWFyUmVnaW9uOiB7XHJcbiAgICAgICAgeDogY2FudmFzQ2VudHJlSCxcclxuICAgICAgICB5OiBjYW52YXNDZW50cmVWLFxyXG4gICAgICAgIHc6IDAsXHJcbiAgICAgICAgaDogMFxyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbi8vIHNldCBidWZmZXIgY29uZmlnIGZvciB1c2UgaW4gY29uc3RyYWluZWQgY2FudmFzIGNsZWFyIHJlZ2lvblxyXG52YXIgYnVmZmVyQ2xlYXJSZWdpb24gPSB7XHJcbiAgICB4OiBjYW52YXNDZW50cmVILFxyXG4gICAgeTogY2FudmFzQ2VudHJlVixcclxuICAgIHc6IDAsXHJcbiAgICBoOiAwXHJcbn07XHJcblxyXG4vLyBzZXQgYXBlcnR1cmUgc2lkZXMgZnBvciBsaWdodCBlZmZlY3RzIGFjcm9zcyBhbmltYXRpb25cclxubGV0IGFwZXJ0dXJlU2lkZXMgPSA2O1xyXG5cclxuLy8gc2V0IGJhc2UgY29uZmlnIGZvciBzdW5cclxudmFyIHRoZVN1biA9IHtcclxuICAgIGNvbG91cnM6IHtcclxuICAgICAgICBiYXNlOiB7XHJcbiAgICAgICAgICAgIHJlZDogJyNhYTAwMDAnLFxyXG4gICAgICAgICAgICBvcmFuZ2U6ICcjRkY5QzBEJyxcclxuICAgICAgICAgICAgeWVsbG93OiAnI2JiYmIwMCcsXHJcbiAgICAgICAgICAgIHdoaXRlOiAnI0ZGRkZGRicsXHJcbiAgICAgICAgICAgIHdoaXRlU2hhZG93OiAnI0RERERGRidcclxuICAgICAgICB9LFxyXG4gICAgICAgIHJnYjoge1xyXG4gICAgICAgICAgICBvcmFuZ2U6ICcyNTUsIDE1NiwgMTMnLFxyXG4gICAgICAgICAgICB3aGl0ZVNoYWRvdzoge1xyXG4gICAgICAgICAgICAgICAgcjogMjIxLFxyXG4gICAgICAgICAgICAgICAgZzogMjIxLFxyXG4gICAgICAgICAgICAgICAgYjogMjU1XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHJnYmE6IHtcclxuICAgICAgICAgICAgb3JhbmdlU2hhZG93OiAncmdiYSggMjU1LCAxNTYsIDEzLCAwLjMgKScsXHJcbiAgICAgICAgICAgIG9yYW5nZVNoYWRvd0xpZ2h0OiAncmdiYSggMjU1LCAxNTYsIDEzLCAwLjIgKScsXHJcbiAgICAgICAgICAgIG9yYW5nZVNoYWRvd0xpZ2h0ZXN0OiAncmdiYSggMjU1LCAxNTYsIDEzLCAwLjEgKScsXHJcbiAgICAgICAgICAgIG9yYW5nZVNoYWRvd0RhcmtMaXA6ICdyZ2JhKCAyNTUsIDE1NiwgMTMsIDAuNCApJyxcclxuICAgICAgICAgICAgb3JhbmdlU2hhZG93RGFyazogJ3JnYmEoIDI1NSwgMTU2LCAxMywgMSApJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGVidWc6IHtcclxuICAgICAgICAgICAgcG9pbnRzOiAnIzAwYWEwMCcsXHJcbiAgICAgICAgICAgIGhhbmRsZXM6ICcjMDAwMGFhJyxcclxuICAgICAgICAgICAgbGluZXM6ICcjMDA1NWZmJyxcclxuICAgICAgICAgICAgb3JhbmdlOiAncmdiKCAyNTUsIDE1NiwgMTMsIDAuMiApJyxcclxuICAgICAgICAgICAgZGltbWVkOiAncmdiYSggMjU1LCAxNTAsIDQwLCAwLjIgKScsXHJcbiAgICAgICAgICAgIGZpbGxzOiAncmdiYSggMjU1LCAxNTAsIDQwLCAwLjIgKScsXHJcbiAgICAgICAgICAgIGZpbGxzVGVldGg6ICdyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwLjEgKSdcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZGVidWc6IHtcclxuICAgICAgICBwb2ludFI6IDQsXHJcbiAgICAgICAgaGFuZGxlUjogMlxyXG4gICAgfSxcclxuICAgIHI6IDMwLFxyXG4gICAgeDogMzAwLFxyXG4gICAgeTogODUwLFxyXG4gICAgclZlbDogMCxcclxuICAgIGE6IE1hdGguUEkgLyAxLjIsXHJcbiAgICBmdWxsUm90YXRpb246IE1hdGguUEkgKiAyLFxyXG4gICAgb3JiaXRTZWNvbmRzOiAzMCxcclxuICAgIG9yYml0VGltZTogMCxcclxuICAgIG9yYml0Q2xvY2s6IDAsXHJcbiAgICBsb2NhbFJvdGF0aW9uOiAwLFxyXG4gICAgbGVuczoge30sXHJcbiAgICBsZW5zRmxhcmVPcGFjaXR5OiAwLFxyXG4gICAgbGVuc0ZsYXJlT3BhY2l0eUludGVydmFsOiAwLjAyLFxyXG4gICAgaW5kaWNhdG9yUGFyYW1zOiB7XHJcbiAgICAgICAgcjogMTAwLFxyXG4gICAgICAgIHg6IDE1MCxcclxuICAgICAgICB5OiAxNTBcclxuICAgIH0sXHJcbiAgICBwaXZvdFBvaW50OiB7XHJcbiAgICAgICAgaE11bHRpcGxpZXI6IDAuNSxcclxuICAgICAgICB2TXVsdGlwbGllcjogMVxyXG4gICAgfSxcclxuICAgIGlzVmlzaWJsZTogZmFsc2UsXHJcblxyXG4gICAgZ2V0Q2FudmFzRGltZW50aW9uczogZnVuY3Rpb24oIGNhbnZhcyApIHtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB7XHJcbiAgICAgICAgICAgIHc6IGNhbnZhcy53aWR0aCxcclxuICAgICAgICAgICAgaDogY2FudmFzLmhlaWdodCxcclxuICAgICAgICAgICAgY2VudHJlSDogY2FudmFzLndpZHRoIC8gMixcclxuICAgICAgICAgICAgY2VudHJlVjogY2FudmFzLmhlaWdodCAvIDJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubGVucy5yYWRpdXMgPSB0aGlzLmNhbnZhcy5jZW50cmVIO1xyXG4gICAgICAgIHRoaXMubGVucy5tYXhEID0gdHJpZy5kaXN0KCAwLCAwLCB0aGlzLmNhbnZhcy53ICogMywgdGhpcy5jYW52YXMuaCAqIDMgKTtcclxuICAgICAgICB0aGlzLmxlbnMuc3VuTGVuc0ludGVyc2VjdGluZ0ZsYWcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxlbnMuY3VyckludGVyc2VjdERpc3QgPSAwO1xyXG4gICAgICAgIHRoaXMubGVucy5jdXJyT3ZlcmxhcCA9IDA7XHJcbiAgICAgICAgdGhpcy5sZW5zLmN1cnJPdmVybGFwU2NhbGUgPSAwO1xyXG4gICAgICAgIHRoaXMubGVucy5zdW5MZW5zVGFuZ2VudERpc3QgPSAwO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgY2FsY3VsYXRlU3VuTGVuc0ludGVyc2VjdERpc3Q6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpcy54OiAnLCB0aGlzLnggKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXMuWTogJywgdGhpcy5ZICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzLng6ICcsIHRoaXMueCApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAndGhpcy54OiAnLCB0aGlzLnggKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMubGVucy5jdXJySW50ZXJzZWN0RGlzdCA9IHRyaWcuZGlzdCggdGhpcy54LCB0aGlzLnksIHRoaXMuY2FudmFzLmNlbnRyZUgsIHRoaXMuY2FudmFzLmNlbnRyZVYgKTtcclxuICAgICAgICBpZiAoIHRoaXMubGVucy5jdXJySW50ZXJzZWN0RGlzdCA8IHRoaXMuciArIHRoaXMubGVucy5yYWRpdXMgKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGVucy5zdW5MZW5zSW50ZXJzZWN0aW5nRmxhZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubGVucy5jdXJyT3ZlcmxhcCA9ICggdGhpcy5yICsgdGhpcy5sZW5zLnJhZGl1cyApIC0gdGhpcy5sZW5zLmN1cnJJbnRlcnNlY3REaXN0O1xyXG4gICAgICAgICAgICBpZiggdGhpcy5sZW5zLmN1cnJPdmVybGFwID49IDAgJiYgdGhpcy5sZW5zLmN1cnJPdmVybGFwIDwgdGhpcy5yICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZW5zLmN1cnJPdmVybGFwU2NhbGUgPSB0aGlzLmxlbnMuY3Vyck92ZXJsYXAgLyB0aGlzLnI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5sZW5zLnN1bkxlbnNJbnRlcnNlY3RpbmdGbGFnID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0SW50ZXJuYWxDb29yZGluYXRlczogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCBjYW52YXMgPSB0aGlzLmNhbnZhcztcclxuICAgICAgICBsZXQgcGl2b3QgPSB0aGlzLnBpdm90UG9pbnQ7XHJcblxyXG4gICAgICAgIHBpdm90LnggPSBjYW52YXMudyAqIHBpdm90LmhNdWx0aXBsaWVyO1xyXG4gICAgICAgIHBpdm90LnkgPSBjYW52YXMuaCAqIHBpdm90LnZNdWx0aXBsaWVyO1xyXG4gICAgICAgIHBpdm90LnIgPSB0cmlnLmRpc3QoIGNhbnZhcy53IC8gMywgY2FudmFzLmggLyAzLCBwaXZvdC54LCBwaXZvdC55ICk7XHJcbiAgICAgICAgdGhpcy5zdW5Ub1N0YWdlQ2VudHJlQW5nbGUgPSB0cmlnLmFuZ2xlKCB0aGlzLngsIHRoaXMueSwgY2FudmFzLmNlbnRyZUgsIGNhbnZhcy5jZW50cmVWICk7XHJcbiAgICAgICAgdGhpcy5vcmJpdFRpbWUgPSB0aGlzLm9yYml0U2Vjb25kcyAqIDYwO1xyXG4gICAgICAgIHRoaXMub3JiaXRDbG9jayA9IE1hdGgucm91bmQoICggdGhpcy5hIC8gdGhpcy5mdWxsUm90YXRpb24gKSAqIHRoaXMub3JiaXRUaW1lICk7XHJcbiAgICAgICAgdGhpcy5yVmVsID0gdGhpcy5mdWxsUm90YXRpb24gLyB0aGlzLm9yYml0VGltZTtcclxuXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgc2V0U3VuVG9TdGFnZUNlbnRyZUFuZ2xlOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuY2FudmFzO1xyXG4gICAgICAgIHRoaXMuc3VuVG9TdGFnZUNlbnRyZUFuZ2xlID0gdHJpZy5hbmdsZSggdGhpcy54LCB0aGlzLnksIGNhbnZhcy5jZW50cmVILCBjYW52YXMuY2VudHJlViApO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCBwaXZvdCA9IHRoaXMucGl2b3RQb2ludDtcclxuICAgICAgICBsZXQgbmV3UG9zID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIHBpdm90LngsIHBpdm90LnksIHBpdm90LnIsIHRoaXMuYSApO1xyXG4gICAgICAgIHRoaXMubG9jYWxSb3RhdGlvbiA9IHRyaWcuYW5nbGUoIHRoaXMueCwgdGhpcy55LCB0aGlzLmNhbnZhcy5jZW50cmVILCB0aGlzLmNhbnZhcy5jZW50cmVWICk7XHJcbiAgICAgICAgdGhpcy54ID0gbmV3UG9zLng7XHJcbiAgICAgICAgdGhpcy55ID0gbmV3UG9zLnk7XHJcbiAgICAgICAgdGhpcy5pc1Zpc2libGUgPSB0aGlzLmNoZWNrSWZWaXNpYmxlKCk7XHJcbiAgICAgICAgdGhpcy5hICs9IHRoaXMuclZlbDtcclxuICAgICAgICB0aGlzLmNhbGN1bGF0ZVN1bkxlbnNJbnRlcnNlY3REaXN0KCk7XHJcblxyXG4gICAgICAgIGlmICggdGhpcy5vcmJpdENsb2NrIDwgdGhpcy5vcmJpdFRpbWUgKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JiaXRDbG9jaysrO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JiaXRDbG9jayA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBjaGVja0lmVmlzaWJsZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgbGV0IGlzVmlzaWJsZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICBpZiAoIHRoaXMueCArIHRoaXMuciA+IDAgKSB7XHJcbiAgICAgICAgICAgIGlmICggdGhpcy54IC0gdGhpcy5yIDwgdGhpcy5jYW52YXMudyApIHtcclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy55ICsgdGhpcy5yID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHRoaXMueSAtIHRoaXMuciA8IHRoaXMuY2FudmFzLmggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9LFxyXG5cclxuICAgIGluZGljYXRvckNvb3JkaW5hdGVzOiB7XHJcbiAgICAgICAgc3Bva2VzOiBbXVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRpbmRpY2F0b3JDb29yZGluYXRlczogZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGxldCBpbmRQYXJhbSA9IHNlbGYuaW5kaWNhdG9yUGFyYW1zO1xyXG4gICAgICAgIGxldCBudW0gPSAyNDtcclxuXHJcbiAgICAgICAgbGV0IHNlZ21lbnQgPSAoIE1hdGguUEkgKiAyICkgLyBudW07XHJcbiAgICAgICAgbGV0IHR4dENvdW50ZXIgPSAxODtcclxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW07IGkrKyApIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzdGFydE11bHRpcGxpZXIgPSBpICUgNiA9PT0gMCA/IDEuMjUgOiAxLjE7XHJcblxyXG4gICAgICAgICAgICBsZXQgc3RhcnRQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBpbmRQYXJhbS54LCBpbmRQYXJhbS55LCBpbmRQYXJhbS5yIC8gc3RhcnRNdWx0aXBsaWVyLCBzZWdtZW50ICogaSApO1xyXG4gICAgICAgICAgICBsZXQgZW5kUG9pbnQgPSB0cmlnLnJhZGlhbERpc3RyaWJ1dGlvbiggaW5kUGFyYW0ueCwgaW5kUGFyYW0ueSwgaW5kUGFyYW0uciwgc2VnbWVudCAqIGkgKTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0eHRQb2ludCA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBpbmRQYXJhbS54LCBpbmRQYXJhbS55LCBpbmRQYXJhbS5yICogMS4yLCBzZWdtZW50ICogaSApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3JDb29yZGluYXRlcy5zcG9rZXMucHVzaChcclxuICAgICAgICAgICAgICAgIHsgc3RhcnQ6IHN0YXJ0UG9pbnQsIGVuZDogZW5kUG9pbnQsIHR4dDogdHh0UG9pbnQsIHQ6IHR4dENvdW50ZXIgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0eHRDb3VudGVyID09PSAyMyApIHtcclxuICAgICAgICAgICAgICAgIHR4dENvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdHh0Q291bnRlcisrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGluZGljYXRvcjogZnVuY3Rpb24oIGN0eCApIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGluZFBhcmFtID0gc2VsZi5pbmRpY2F0b3JQYXJhbXM7XHJcbiAgICAgICAgbGV0IGluZGljYXRvciA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBpbmRQYXJhbS54LCBpbmRQYXJhbS55LCBpbmRQYXJhbS5yLCBzZWxmLmEgKTtcclxuICAgICAgICBsZXQgaW5kQ29vcmRzID0gc2VsZi5pbmRpY2F0b3JDb29yZGluYXRlcztcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2luZFBhcmFtOiAnLCBpbmRQYXJhbSApO1xyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmVkJztcclxuICAgICAgICBcclxuICAgICAgICBjdHgubGluZVdpZHRoID0gMTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoIDI1NSwgMCwgMCwgMC41ICknO1xyXG5cclxuICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JnYmEoIDI1NSwgMCwgMCwgMC4yKSc7XHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG4gICAgICAgIGN0eC50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICBjdHgudGV4dEJhc2VsaW5lID0gXCJtaWRkbGVcIjtcclxuICAgICAgICBjdHguZm9udCA9ICcxNnB4IFRhaG9tYSc7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMjQ7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgdGhpc1Nwb2tlID0gaW5kQ29vcmRzLnNwb2tlc1sgaSBdO1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oIHRoaXNTcG9rZS5zdGFydC54LCB0aGlzU3Bva2Uuc3RhcnQueSApO1xyXG4gICAgICAgICAgICBjdHgubGluZVRvKCB0aGlzU3Bva2UuZW5kLngsIHRoaXNTcG9rZS5lbmQueSApO1xyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgIGN0eC5zdHJva2UoKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCggdGhpc1Nwb2tlLnQsIHRoaXNTcG9rZS50eHQueCwgdGhpc1Nwb2tlLnR4dC55ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggaW5kUGFyYW0ueCwgaW5kUGFyYW0ueSwgaW5kUGFyYW0uciApO1xyXG5cclxuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgY3R4Lm1vdmVUbyggaW5kUGFyYW0ueCwgaW5kUGFyYW0ueSApO1xyXG4gICAgICAgIGN0eC5saW5lVG8oIGluZGljYXRvci54LCBpbmRpY2F0b3IueSApO1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCBpbmRQYXJhbS54LCBpbmRQYXJhbS55LCA1ICk7XHJcbiAgICAgICAgY3R4LmZpbGxDaXJjbGUoIGluZGljYXRvci54LCBpbmRpY2F0b3IueSwgMTAgKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggc2VsZi5waXZvdFBvaW50LngsIHNlbGYucGl2b3RQb2ludC55LCBzZWxmLnBpdm90UG9pbnQuciApO1xyXG5cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgY3R4LmZvbnQgPSAnMjBweCBUYWhvbWEnO1xyXG5cclxuICAgICAgICBjdHguZmlsbFRleHQoIHRoaXMub3JiaXRDbG9jaysnIC8gJyt0aGlzLm9yYml0VGltZSwgMTAwLCAzMzAgKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIHZhciBjb3JvbmFHcmFkaWVudCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCh0aGlzLngsIHRoaXMueSwgdGhpcy5yLCB0aGlzLngsIHRoaXMueSwgdGhpcy5yICogMiApO1xyXG4gICAgICAgICAgICBjb3JvbmFHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgXCJyZ2JhKCAyNTUsIDI1NSwgMTgwLCAxIClcIik7XHJcbiAgICAgICAgICAgIGNvcm9uYUdyYWRpZW50LmFkZENvbG9yU3RvcCgwLjMsIFwicmdiYSggMjU1LCAyNTUsIDE4MCwgMC41IClcIik7XHJcbiAgICAgICAgICAgIGNvcm9uYUdyYWRpZW50LmFkZENvbG9yU3RvcCgxLCBcInJnYmEoIDI1NSwgMjU1LCAxODAsIDAgKVwiKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBjb3JvbmFHcmFkaWVudDIgPSBjdHguY3JlYXRlUmFkaWFsR3JhZGllbnQodGhpcy54LCB0aGlzLnksIHRoaXMuciwgdGhpcy54LCB0aGlzLnksIHRoaXMuciAqIDEwICk7XHJcbiAgICAgICAgICAgIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMSApXCIgKTtcclxuICAgICAgICAgICAgY29yb25hR3JhZGllbnQyLmFkZENvbG9yU3RvcCggMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIiApO1xyXG5cclxuICAgICAgICB2YXIgY29yb25hR3JhZGllbnQzID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KHRoaXMueCwgdGhpcy55LCB0aGlzLnIsIHRoaXMueCwgdGhpcy55LCB0aGlzLnIgKiA1ICk7XHJcbiAgICAgICAgICAgIGNvcm9uYUdyYWRpZW50Mi5hZGRDb2xvclN0b3AoIDAsIFwicmdiYSggMjU1LCAyNTUsIDI1NSwgMSApXCIgKTtcclxuICAgICAgICAgICAgY29yb25hR3JhZGllbnQyLmFkZENvbG9yU3RvcCggMSwgXCJyZ2JhKCAyNTUsIDI1NSwgMjU1LCAwIClcIiApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICggIW92ZXJsYXlDZmcuZGlzcGxheUdsYXJlU3Bpa2VzICkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdmVyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvcm9uYUdyYWRpZW50MjtcclxuICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoIHRoaXMueCwgdGhpcy55LCB0aGlzLnIgKiAxMCApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvcm9uYUdyYWRpZW50MztcclxuICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoIHRoaXMueCwgdGhpcy55LCB0aGlzLnIgKiA1ICk7XHJcblxyXG4gICAgICAgICAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvcm9uYUdyYWRpZW50O1xyXG4gICAgICAgICAgICBjdHguZmlsbENpcmNsZSggdGhpcy54LCB0aGlzLnksIHRoaXMuciAqIDMgKTtcclxuXHJcblxyXG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKCB0aGlzLngsIHRoaXMueSApO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY3R4LnJvdGF0ZSggdGhpcy5sb2NhbFJvdGF0aW9uICk7XHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcbiAgICAgICAgICAgIHN1blNwaWtlcy5kaXNwbGF5Q29yb25hKCB7IHhQb3M6IDAsIHlQb3M6IDAgfSApO1xyXG5cclxuICAgICAgICAgICAgLy8gY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICAgICAgICAgIC8vIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlbic7XHJcbiAgICAgICAgICAgIHZhciByZW5kZXJGbGFyZXMgPSBzdW5TcGlrZXMuZGlzcGxheUNmZy5mbGFyZXM7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICBzdW5TcGlrZXMuZmxhcmVPcHRpb25zLmNhbnZhcyxcclxuICAgICAgICAgICAgICAgIHJlbmRlckZsYXJlcy54LCByZW5kZXJGbGFyZXMueSwgcmVuZGVyRmxhcmVzLncsIHJlbmRlckZsYXJlcy5oLFxyXG4gICAgICAgICAgICAgICAgLShyZW5kZXJGbGFyZXMudyAvIDIgKSwgLShyZW5kZXJGbGFyZXMuaCAvIDIgKSwgcmVuZGVyRmxhcmVzLncsIHJlbmRlckZsYXJlcy5oXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBjdHgucm90YXRlKCAtdGhpcy5sb2NhbFJvdGF0aW9uICk7XHJcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUoIC10aGlzLngsIC10aGlzLnkgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGRyYXdGZWF0dXJlcygpO1xyXG4gICAgICAgICAgICBpZiAoIHRoaXMuaXNWaXNpYmxlID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCB0aGlzLmxlbnNGbGFyZU9wYWNpdHkgPCAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVuc0ZsYXJlT3BhY2l0eSArPSB0aGlzLmxlbnNGbGFyZU9wYWNpdHlJbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZW5zRmxhcmVPcGFjaXR5ID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzLmlzVmlzaWJsZSA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMubGVuc0ZsYXJlT3BhY2l0eSA+IHRoaXMubGVuc0ZsYXJlT3BhY2l0eUludGVydmFsICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVuc0ZsYXJlT3BhY2l0eSAtPSB0aGlzLmxlbnNGbGFyZU9wYWNpdHlJbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZW5zRmxhcmVPcGFjaXR5ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ3RoaXMubGVuc0ZsYXJlT3BhY2l0eTogJywgdGhpcy5sZW5zRmxhcmVPcGFjaXR5ICk7XHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHRoaXMubGVuc0ZsYXJlT3BhY2l0eTtcclxuXHJcbiAgICAgICAgICAgIGxlbnNGbGFyZS5zZXREaXNwbGF5UHJvcHMoIHRoZVN1biApO1xyXG4gICAgICAgICAgICBsZW5zRmxhcmUuZGlzcGxheUZsYXJlcyggIHRyaWcuZGlzdCggY2FudmFzLncgLyAyLCBjYW52YXMuaCAvIDIsIHRoaXMueCwgdGhpcy55ICkgKTtcclxuXHJcbiAgICAgICAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcblxyXG4gICAgICAgICAgICByYWluYm93RG90LnJlbmRlciggdGhpcy54LCB0aGlzLnksIHRoaXMubGVucywgdGhpcy5pc1Zpc2libGUgKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24oIGNhbnZhcyApIHtcclxuICAgICAgICB0aGlzLmdldENhbnZhc0RpbWVudGlvbnMoIGNhbnZhcyApO1xyXG4gICAgICAgIHRoaXMuc2V0SW50ZXJuYWxDb29yZGluYXRlcygpO1xyXG4gICAgICAgIHRoaXMuc2V0aW5kaWNhdG9yQ29vcmRpbmF0ZXMoKTtcclxuICAgICAgICAvLyBzaW5lV2F2ZS5nZXRDbG9jayggdGhpcy5vcmJpdFRpbWUsIHRoaXMub3JiaXRDbG9jayApO1xyXG4gICAgfVxyXG59XHJcblxyXG50aGVTdW4uaW5pdCggY2FudmFzICk7XHJcblxyXG5iZ0N5Y2xlci5pbml0KCBjYW52YXMsIGN0eCwgdGhlU3VuLm9yYml0VGltZSwgdGhlU3VuLm9yYml0Q2xvY2ssIHRoZVN1bi5waXZvdFBvaW50ICk7XHJcblxyXG50aGVTdGFycy5nZXRDYW52YXMoIGNhbnZhcywgY3R4ICk7XHJcbnRoZVN0YXJzLnNldEluaXRpYWxDb25maWcoIHRoZVN1biApO1xyXG50aGVTdGFycy5wb3B1bGF0ZUFycmF5KCk7XHJcblxyXG5sZXQgZGlzdFRvU3RhZ2VDZW50cmUgPSB0cmlnLmRpc3QoIHRoZVN1bi54LCB0aGVTdW4ueSwgY2FudmFzQ2VudHJlSCwgY2FudmFzQ2VudHJlViApO1xyXG5cclxuZnVuY3Rpb24gZmFjZVRvU3RhZ2VDZW50cmVEZWJ1Z0xpbmUoIGN0eCApIHtcclxuICAgIGxldCBjdXJyU3Ryb2tlID0gY3R4LnN0cm9rZVN0eWxlO1xyXG4gICAgbGV0IGN1cnJGaWxsID0gY3R4LmZpbGxTdHlsZTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSggMTUwLCAxNTAsIDE1MCwgMC42ICknO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAxNTAsIDE1MCwgMTUwLCAxICknO1xyXG5cclxuICAgIGN0eC50cmFuc2xhdGUoIHRoZVN1bi54LCB0aGVTdW4ueSApO1xyXG4gICAgY3R4LnJvdGF0ZSggdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG5cclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oIDAsIDAgKTtcclxuICAgIGN0eC5saW5lVG8oIGRpc3RUb1N0YWdlQ2VudHJlLCAwICk7XHJcbiAgICBjdHguc2V0TGluZURhc2goIFs1LCA2XSApO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG5cclxuICAgIGN0eC5maWxsQ2lyY2xlKCAwLCAwLCA1ICk7XHJcbiAgICBjdHguZmlsbENpcmNsZSggZGlzdFRvU3RhZ2VDZW50cmUsIDAsIDUgKTtcclxuXHJcbiAgICBjdHgucm90YXRlKCAtdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSggLXRoZVN1bi54LCAtdGhlU3VuLnkgKTtcclxuXHJcbiAgICBsZXQgc3VuQ3RyVHh0ID0gJ1N1biBDZW50cmUgWDogJyt0aGVTdW4ueCsnIC8gWTogJyt0aGVTdW4ueTtcclxuICAgIGxldCBzdGFnZUN0clR4dCA9ICdTdGFnZSBDZW50cmUgWDogJytjYW52YXNDZW50cmVIKycgLyBZOiAnK2NhbnZhc0NlbnRyZVY7XHJcblxyXG4gICAgY3R4LmZpbGxUZXh0KCBzdW5DdHJUeHQsIHRoZVN1bi54ICsgMjAsIHRoZVN1bi55ICk7XHJcbiAgICBjdHguZmlsbFRleHQoIHN0YWdlQ3RyVHh0LCBjYW52YXNDZW50cmVIICsgMjAsIGNhbnZhc0NlbnRyZVYgKTtcclxuXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjdXJyU3Ryb2tlO1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGN1cnJGaWxsO1xyXG59XHJcblxyXG5sZW5zRmxhcmUuZmxhcmVJbml0KFxyXG4gICAgeyBjYW52YXM6IGxlbnNGbGFyZUNhbnZhcywgY3R4OiBsZW5zRmxhcmVDdHggfSxcclxuICAgIHsgY2FudmFzOiBmbGFyZUxheWVyLCBjdHg6IGZsYXJlTGF5ZXJDdHggfSxcclxuICAgIHsgYXBlcnR1cmU6IGFwZXJ0dXJlU2lkZXMgfVxyXG4pO1xyXG5cclxubGVuc0ZsYXJlLnNldERpc3BsYXlQcm9wcyggdGhlU3VuICk7XHJcblxyXG5sZW5zRmxhcmUucmVuZGVyRmxhcmVzKCk7XHJcbi8vIGNvbnNvbGUubG9nKCAndGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZTogJywgdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSApO1xyXG5cclxuXHJcbnN1blNwaWtlcy5yZW5kZXJDZmcuY2FudmFzID0gc3RhdGljQXNzZXRDYW52YXM7XHJcbnN1blNwaWtlcy5yZW5kZXJDZmcuY29udGV4dCA9IHN0YXRpY0Fzc2V0Q3R4O1xyXG5zdW5TcGlrZXMucmVuZGVyQ2ZnLmRlYnVnQ2ZnID0gb3ZlcmxheUNmZztcclxuXHJcbnN1blNwaWtlcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzUmFuZG9tLmNhbnZhcyA9IGNvcm9uYUxheWVyO1xyXG5zdW5TcGlrZXMuZGlzcGxheUNmZy5nbGFyZVNwaWtlc1JhbmRvbS5jb250ZXh0ID0gY29yb25hTGF5ZXJDdHg7XHJcbnN1blNwaWtlcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzUmFuZG9tLnggPSB0aGVTdW4ueDtcclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20ueSA9IHRoZVN1bi55O1xyXG5cclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXMuY2FudmFzID0gY29yb25hTGF5ZXI7XHJcbnN1blNwaWtlcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzLmNvbnRleHQgPSBjb3JvbmFMYXllckN0eDtcclxuc3VuU3Bpa2VzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXMueCA9IHRoZVN1bi54O1xyXG5zdW5TcGlrZXMuZGlzcGxheUNmZy5nbGFyZVNwaWtlcy55ID0gdGhlU3VuLnk7XHJcblxyXG5zdW5TcGlrZXMuZ2xhcmVTcGlrZU9wdGlvbnMgPSB7XHJcbiAgICB4OiBzdGF0aWNBc3NldENhbnZhcy53aWR0aCAvIDIsXHJcbiAgICB5OiBzdGF0aWNBc3NldENhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgcjogMixcclxuICAgIG1ham9yUmF5TGVuOiAyMDAsXHJcbiAgICBtaW5vclJheUxlbjogMjAwLFxyXG4gICAgbWFqb3JSYXlXaWR0aDogMC4wMDA1LFxyXG4gICAgbWlub3JSYXlXaWR0aDogMC4wMDAwNSxcclxuICAgIC8vIGFuZ2xlOiBNYXRoLlBJIC8gdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSxcclxuICAgIGFuZ2xlOiAwLFxyXG4gICAgY291bnQ6IGFwZXJ0dXJlU2lkZXMgKiAyLFxyXG4gICAgYmx1cjogNVxyXG59XHJcblxyXG5zdW5TcGlrZXMuZ2xhcmVTcGlrZVJhbmRvbU9wdGlvbnMgPSB7XHJcbiAgICB4OiBzdGF0aWNBc3NldENhbnZhcy53aWR0aCAvIDIsXHJcbiAgICB5OiBzdGF0aWNBc3NldENhbnZhcy5oZWlnaHQgLyAyLFxyXG4gICAgcjogdGhlU3VuLnIgLyA0LFxyXG4gICAgbWFqb3JSYXlMZW46IHRoZVN1bi5yICogMSxcclxuICAgIG1pbm9yUmF5TGVuOiB0aGVTdW4uciAqIDIsXHJcbiAgICBtYWpvclJheVdpZHRoOiAwLjAwMDUsXHJcbiAgICBtaW5vclJheVdpZHRoOiAwLjAwNSxcclxuICAgIC8vIGFuZ2xlOiBNYXRoLlBJIC8gdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSxcclxuICAgIGFuZ2xlOiAwLFxyXG4gICAgY291bnQ6IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyKCAyMCwgNDAgKSxcclxuICAgIGJsdXI6IDEwXHJcbn1cclxuXHJcbnN1blNwaWtlcy5mbGFyZU9wdGlvbnMgPSB7XHJcbiAgICBjYW52YXM6IGZsYXJlQXNzZXRDYW52YXMsXHJcbiAgICBjb250ZXh0OiBmbGFyZUFzc2V0Q3R4LFxyXG4gICAgeDogZmxhcmVBc3NldENhbnZhcy53aWR0aCAvIDIsXHJcbiAgICB5OiBmbGFyZUFzc2V0Q2FudmFzLmhlaWdodCAvIDIsXHJcbiAgICByOiB0aGVTdW4uciAvIDEuOSxcclxuICAgIGdyYWRpZW50V2lkdGg6IHRoZVN1bi5yICogMTAsXHJcbiAgICByYXlMZW46IHRoZVN1bi5yICogMTAsXHJcbiAgICByYXlXaWR0aDogMC4wOCxcclxuICAgIC8vIGFuZ2xlOiBNYXRoLlBJIC8gdGhlU3VuLnN1blRvU3RhZ2VDZW50cmVBbmdsZSxcclxuICAgIGFuZ2xlOiAwLjUsXHJcbiAgICBjb3VudDogYXBlcnR1cmVTaWRlcyxcclxuICAgIGJsdXI6IDFcclxufVxyXG5cclxuLy8gY29uc29sZS5sb2coICdzdW5TcGlrZXMuZ2xhcmVTcGlrZU9wdGlvbnMucjogJywgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VPcHRpb25zICk7XHJcbnN1blNwaWtlcy5pbml0R2xhcmVTcGlrZUNvbnRyb2xJbnB1dHMoIGNhbnZhcyApO1xyXG5cclxuLy8gY29uc29sZS5sb2coICdzdW5TcGlrZXMuZ2xhcmVTcGlrZUNvbnRyb2xJbnB1dENmZzogJywgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmcgKTtcclxuXHJcbi8vIHN1blNwaWtlcy5yZW5kZXJHbGFyZVNwaWtlcygpO1xyXG4vLyBzdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXNSYW5kb20oKTtcclxuLy8gc3VuU3Bpa2VzLnJlbmRlckZsYXJlcygpO1xyXG5cclxuLy8gc2V0IGxpbmUgd2lkdGhzIGZvciBkcmF3aW5nIGJhc2VkIG9uIHNjZW5lIHNpemVcclxudGhlU3VuLmxpbmVzID0ge1xyXG4gICAgb3V0ZXI6IE1hdGguZmxvb3IoIHRoZVN1bi5yIC8gMjAgKSxcclxuICAgIGlubmVyOiBNYXRoLmZsb29yKCB0aGVTdW4uciAvIDQwIClcclxufVxyXG5cclxuXHJcbi8vIHNldCBjb3JvbmEgc3lzdGVtIGJhc2Ugc2l6ZVxyXG5zdW5Db3JvbmEucmF5QmFzZVJhZGl1cyA9IHRoZVN1bi5yICogMS4yO1xyXG5cclxuXHJcbi8vIHNldCB1cCBwcm9wcnRpb25hbCBtZWFzdXJlbWVudHMgZnJvbSBmYWNlIHJhZGl1c1xyXG52YXIgcG0gPSBwcm9wb3J0aW9uYWxNZWFzdXJlcy5zZXRNZWFzdXJlcyggdGhlU3VuLnIgKTtcclxuXHJcblxyXG5sZXQgcmFpbmJvd0RvdCA9IHtcclxuICAgIHNpemU6IDEwMCxcclxuICAgIHg6IDEwMCArICggMTAwIC8gOCApLFxyXG4gICAgeTogMTAwLFxyXG4gICAgaW50cm9Eb3Rjb3VudDogMjg0LFxyXG5cclxuICAgIHByZVJlbmRlckNvbmZpZzoge1xyXG4gICAgICAgIGNhbnZhczogc2Vjb25kYXJ5U3RhdGljQXNzZXRDYW52YXMsXHJcbiAgICAgICAgY3R4OiBzZWNvbmRhcnlTdGF0aWNBc3NldEN0eFxyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXJDb25maWc6IHtcclxuICAgICAgICBjYW52YXM6IGNhbnZhcyxcclxuICAgICAgICBjdHg6IGN0eFxyXG4gICAgfSxcclxuXHJcbiAgICBwcmVSZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICBsZXQgYyA9IHRoaXMucHJlUmVuZGVyQ29uZmlnLmN0eDtcclxuICAgICAgICBsZXQgcmVkWCA9IC10aGlzLm9mZnNldDtcclxuICAgICAgICBsZXQgZ3JlZW5YID0gKHRoaXMuc2l6ZSAvIDIpIC0gdGhpcy5vZmZzZXQ7XHJcbiAgICAgICAgbGV0IGJsdWVYID0gdGhpcy5zaXplIC0gdGhpcy5vZmZzZXQ7XHJcbiAgICAgICAgbGV0IGdyb3VwWSA9IHRoaXMueSAtICggdGhpcy5zaXplIC8gMiApO1xyXG5cclxuICAgICAgICBjLnRyYW5zbGF0ZSggdGhpcy54LCB0aGlzLnkgKTtcclxuICAgICAgICBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVyJztcclxuICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcblxyXG4gICAgICAgIGxldCByZWRHcmFkID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggcmVkWCwgMCwgMCwgcmVkWCwgMCwgdGhpcy5zaXplICk7XHJcbiAgICAgICAgcmVkR3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggMjU1LCAwLCAwLCAwLjggKWAgKTtcclxuICAgICAgICByZWRHcmFkLmFkZENvbG9yU3RvcCggMC4yLCAgYHJnYmEoIDI1NSwgMCwgMCwgMC44IClgICk7XHJcbiAgICAgICAgcmVkR3JhZC5hZGRDb2xvclN0b3AoIDAuOCwgIGByZ2JhKCAyNTUsIDAsIDAsIDAuMSApYCApO1xyXG4gICAgICAgIHJlZEdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoIDI1NSwgMCwgMCwgMCApYCApO1xyXG5cclxuICAgICAgICBjLmZpbGxTdHlsZSA9IHJlZEdyYWQ7XHJcbiAgICAgICAgYy5maWxsQ2lyY2xlKCByZWRYLCAwLCB0aGlzLnNpemUgKTtcclxuICAgICAgICAvLyBjLnN0cm9rZUNpcmNsZSggcmVkWCwgMCwgdGhpcy5zaXplICk7XHJcblxyXG4gICAgICAgIGxldCBncmVlbkdyYWQgPSBjLmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBncmVlblgsIDAsIDAsIGdyZWVuWCwgMCwgdGhpcy5zaXplICogMS4wNSApO1xyXG4gICAgICAgIGdyZWVuR3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggMCwgMjU1LCAwLCAwLjggKWAgKTtcclxuICAgICAgICBncmVlbkdyYWQuYWRkQ29sb3JTdG9wKCAwLjIsICBgcmdiYSggMCwgMjU1LCAwLCAwLjggKWAgKTtcclxuICAgICAgICBncmVlbkdyYWQuYWRkQ29sb3JTdG9wKCAwLjgsICBgcmdiYSggMCwgMjU1LCAwLCAwLjEgKWAgKTtcclxuICAgICAgICBncmVlbkdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoIDAsIDI1NSwgMCwgMCApYCApO1xyXG5cclxuICAgICAgICBjLmZpbGxTdHlsZSA9IGdyZWVuR3JhZDsgXHJcbiAgICAgICAgYy5maWxsQ2lyY2xlKCBncmVlblgsIDAsIHRoaXMuc2l6ZSAqIDEuMSApO1xyXG4gICAgICAgIC8vIGMuc3Ryb2tlQ2lyY2xlKCBncmVlblgsIDAsIHRoaXMuc2l6ZSApO1xyXG5cclxuICAgICAgICBsZXQgYmx1ZUdyYWQgPSBjLmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBibHVlWCwgMCwgMCwgYmx1ZVgsIDAsIHRoaXMuc2l6ZSApO1xyXG4gICAgICAgIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAwLCAwLCAyNTUsIDAuOCApYCApO1xyXG4gICAgICAgIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMC4yLCAgYHJnYmEoIDAsIDAsIDI1NSwgMC44IClgICk7XHJcbiAgICAgICAgYmx1ZUdyYWQuYWRkQ29sb3JTdG9wKCAwLjgsICBgcmdiYSggMCwgMCwgMjU1LCAwLjEgKWAgKTtcclxuICAgICAgICBibHVlR3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggMCwgMCwgMjU1LCAwIClgICk7XHJcblxyXG4gICAgICAgIGMuZmlsbFN0eWxlID0gYmx1ZUdyYWQ7IFxyXG4gICAgICAgIGMuZmlsbENpcmNsZSggYmx1ZVgsIDAsIHRoaXMuc2l6ZSApO1xyXG4gICAgICAgIC8vIGMuc3Ryb2tlQ2lyY2xlKCBibHVlWCwgMCwgdGhpcy5zaXplICk7XHJcblxyXG4gICAgICAgIGMudHJhbnNsYXRlKCAtdGhpcy54LCAtdGhpcy55ICk7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyQ29uZmlnLnggPSB0aGlzLnggLSAoIHRoaXMub2Zmc2V0ICsgdGhpcy5zaXplICk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJDb25maWcueSA9IHRoaXMueSAtdGhpcy5zaXplO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ29uZmlnLncgPSB0aGlzLnNpemUgKiAzO1xyXG4gICAgICAgIHRoaXMucmVuZGVyQ29uZmlnLmggPSB0aGlzLnNpemUgKiAyO1xyXG5cclxuICAgICAgICAvLyBjLnN0cm9rZVJlY3QoIHRoaXMucmVuZGVyQ29uZmlnLngsIHRoaXMucmVuZGVyQ29uZmlnLnksIHRoaXMucmVuZGVyQ29uZmlnLncsIHRoaXMucmVuZGVyQ29uZmlnLmggKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlcjogZnVuY3Rpb24oIHgsIHksIGxlbnMsIHZpc2libGUgKSB7XHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IHRoaXMucHJlUmVuZGVyQ29uZmlnLmNhbnZhcztcclxuICAgICAgICBsZXQgcmVuZGVyQ29uZmlnID0gdGhpcy5yZW5kZXJDb25maWc7XHJcbiAgICAgICAgbGV0IGMgPSByZW5kZXJDb25maWcuY3R4O1xyXG4gICAgICAgIGxldCBjb3VudCA9IHRoaXMuaW50cm9Eb3Rjb3VudDtcclxuICAgICAgICBsZXQgaFNjYWxlID0gcmVuZGVyQ29uZmlnLmg7XHJcbiAgICAgICAgbGV0IGxlbnNDZmcgPSBsZW5zO1xyXG4gICAgICAgIGxldCBsZW5zU2NhbGUgPSAwO1xyXG4gICAgICAgIGxldCB3aWR0aFNjYWxlID0gNDA7XHJcbiAgICAgICAgO1xyXG4gICAgICAgIGxldCByb3RhdGlvbkludGVydmFsID0gKCBNYXRoLlBJICogMiApIC8gY291bnQ7XHJcbiAgICAgICAgbGV0IG9wYWNpdHlJbnRlcnZhbCA9IDEgLyAoY291bnQgLyA4KTtcclxuXHJcbiAgICAgICAgaWYgKCBsZW5zLnN1bkxlbnNJbnRlcnNlY3RpbmdGbGFnID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICBsZW5zU2NhbGUgPSAxIC0gbGVuc0NmZy5jdXJyT3ZlcmxhcFNjYWxlO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2xlbnNTY2FsZTogJywgbGVuc1NjYWxlIClcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZW5zU2NhbGUgPSAxO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbXB1dGVkWCA9IGVhc2luZy5lYXNlSW5FeHBvKCBsZW5zU2NhbGUsIDAsIDEsIDEgKTtcclxuICAgICAgICBsZXQgY29tcHV0ZWRSID0gMTIwMCAqIGNvbXB1dGVkWDtcclxuICAgICAgICAvLyBpZiAoIHZpc2libGUgPT09IGZhbHNlICkge1xyXG4gICAgICAgICAgICBjLnRyYW5zbGF0ZSggeCwgeSApO1xyXG4gICAgICAgICAgICBjLnNjYWxlKCAtMSwgMSApO1xyXG4gICAgICAgICAgICBsZXQgY3VyclJvdGF0aW9uID0gMDtcclxuICAgICAgICAgICAgbGV0IGN1cnJNaXggPSBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbjtcclxuICAgICAgICAgICAgYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gbGV0IG9wYWNpdHlJbnRlcnZhbCA9IDEgLyAoY291bnQgLyA0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyT3BhY2l0eSA9IDE7XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gY291bnQgLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBjdXJyUm90YXRpb24gPSBpICogcm90YXRpb25JbnRlcnZhbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiggaSA+PSAwICYmIGkgPCBjb3VudCAvIDggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyck9wYWNpdHkgPSAxIC0gKCBpICogb3BhY2l0eUludGVydmFsICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoIGkgPiBjb3VudCAvIDggJiYgaSA8IGNvdW50IC8gNCAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyck9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBpID49ICggKGNvdW50IC8gNCkgKyAoY291bnQgLyA4KSApICYmIGkgPCAoIGNvdW50IC8gMiApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJPcGFjaXR5ID0gKCBpIC0gKCAoY291bnQgLyA0KSArIChjb3VudCAvIDgpICkgKSAqIG9wYWNpdHlJbnRlcnZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiggaSA+PSAoIGNvdW50IC8gMiApICYmIGkgPCAoIGNvdW50IC8gMiApICsgKCBjb3VudCAvIDggKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyT3BhY2l0eSA9IDEgLSAoICggaSAtICggY291bnQgLyAyICkgKSAqIG9wYWNpdHlJbnRlcnZhbCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBpID4gKCBjb3VudCAvIDIgKSArICggY291bnQgLyA4ICkgICYmIGkgPiBjb3VudCAtICggY291bnQgLyA4ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyck9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBpID49IGNvdW50IC0gKCBjb3VudCAvIDggKSAmJiBpIDwgY291bnQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3Vyck9wYWNpdHkgPSAoIGkgLSAoIGNvdW50IC0gKCBjb3VudCAvIDggKSApICkgKiBvcGFjaXR5SW50ZXJ2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IGN1cnJPcGFjaXR5O1xyXG4gICAgICAgICAgICAgICAgYy5yb3RhdGUoIGN1cnJSb3RhdGlvbiApO1xyXG4gICAgICAgICAgICAgICAgYy5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckNvbmZpZy54LCByZW5kZXJDb25maWcueSwgcmVuZGVyQ29uZmlnLncsIHJlbmRlckNvbmZpZy5oLFxyXG4gICAgICAgICAgICAgICAgICAgICAxMDAgKyAoIGxlbnMubWF4RCAqIGNvbXB1dGVkWCApLCAtKCAoIGhTY2FsZSAqIG9wYWNpdHlJbnRlcnZhbCApIC8gMiApLCByZW5kZXJDb25maWcudyAqICggd2lkdGhTY2FsZSAqIG9wYWNpdHlJbnRlcnZhbCApLCAoIGhTY2FsZSAqIG9wYWNpdHlJbnRlcnZhbCApXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgICAgICBjLnJvdGF0ZSggLWN1cnJSb3RhdGlvbiApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLnNjYWxlKCAtMSwgMSApO1xyXG4gICAgICAgICAgICBjLnRyYW5zbGF0ZSggLXgsIC15ICk7XHJcbiAgICAgICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gY3Vyck1peDtcclxuXHJcblxyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxucmFpbmJvd0RvdC5vZmZzZXQgPSByYWluYm93RG90LnNpemUgLyA4O1xyXG5cclxucmFpbmJvd0RvdC5wcmVSZW5kZXIoKTtcclxuXHJcbi8vIGxldCByYWluYm93RG90U2l6ZSA9IDEwMDtcclxuLy8gbGV0IHJhaW5ib3dYID0gMjAwO1xyXG4vLyBsZXQgcmFpbmJvd1kgPSAyMDA7XHJcbi8vIHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LnRyYW5zbGF0ZSggcmFpbmJvd0RvdC54LCByYWluYm93RG90LnkgKTtcclxuLy8gLy8gc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHguc2NhbGUoIDUsIDEgKTtcclxuLy8gc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHguc2F2ZSgpO1xyXG4vLyBsZXQgb2Zmc2V0ID0gcmFpbmJvd0RvdFNpemUgLyA4O1xyXG4vLyBzZWNvbmRhcnlTdGF0aWNBc3NldEN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlcic7XHJcblxyXG5cclxuLy8gbGV0IHJlZFggPSAtb2Zmc2V0O1xyXG4vLyBsZXQgcmVkWSA9IHJhaW5ib3dZIC0gKCByYWluYm93RG90U2l6ZSAvIDIgKSAtIG9mZnNldDtcclxuXHJcbi8vIGxldCBncmVlblggPSAocmFpbmJvd0RvdFNpemUgLyAyKSAtIG9mZnNldDtcclxuLy8gbGV0IGdyZWVuWSA9IHJhaW5ib3dZIC0gKCByYWluYm93RG90U2l6ZSAvIDIgKSAtIG9mZnNldDtcclxuXHJcbi8vIGxldCBibHVlWCA9IHJhaW5ib3dEb3RTaXplIC0gb2Zmc2V0O1xyXG4vLyBsZXQgYmx1ZVkgPSByYWluYm93WSAtICggcmFpbmJvd0RvdFNpemUgLyAyICkgLSBvZmZzZXQ7XHJcblxyXG4vLyBsZXQgcmVkR3JhZCA9IHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCByZWRYLCAwLCAwLCByZWRYLCAwLCByYWluYm93RG90LnNpemUgKTtcclxuLy8gcmVkR3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggMjU1LCAwLCAwLCAwLjggKWAgKTtcclxuLy8gcmVkR3JhZC5hZGRDb2xvclN0b3AoIDAuMiwgIGByZ2JhKCAyNTUsIDAsIDAsIDAuOCApYCApO1xyXG4vLyByZWRHcmFkLmFkZENvbG9yU3RvcCggMC44LCAgYHJnYmEoIDI1NSwgMCwgMCwgMC4xIClgICk7XHJcbi8vIHJlZEdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoIDI1NSwgMCwgMCwgMCApYCApO1xyXG5cclxuLy8gc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHguZmlsbFN0eWxlID0gcmVkR3JhZDsgXHJcbi8vIHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmZpbGxDaXJjbGUoIHJlZFgsIDAsIHJhaW5ib3dEb3Quc2l6ZSApO1xyXG5cclxuLy8gbGV0IGdyZWVuR3JhZCA9IHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KCBncmVlblgsIDAsIDAsIGdyZWVuWCwgMCwgcmFpbmJvd0RvdC5zaXplICogMS4wNSApO1xyXG4vLyBncmVlbkdyYWQuYWRkQ29sb3JTdG9wKCAwLCAgYHJnYmEoIDAsIDI1NSwgMCwgMC44IClgICk7XHJcbi8vIGdyZWVuR3JhZC5hZGRDb2xvclN0b3AoIDAuMiwgIGByZ2JhKCAwLCAyNTUsIDAsIDAuOCApYCApO1xyXG4vLyBncmVlbkdyYWQuYWRkQ29sb3JTdG9wKCAwLjgsICBgcmdiYSggMCwgMjU1LCAwLCAwLjEgKWAgKTtcclxuLy8gZ3JlZW5HcmFkLmFkZENvbG9yU3RvcCggMSwgIGByZ2JhKCAwLCAyNTUsIDAsIDAgKWAgKTtcclxuXHJcbi8vIHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmZpbGxTdHlsZSA9IGdyZWVuR3JhZDsgXHJcbi8vIHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmZpbGxDaXJjbGUoIGdyZWVuWCwgMCwgcmFpbmJvd0RvdC5zaXplICogMS4xICk7XHJcblxyXG4vLyBsZXQgYmx1ZUdyYWQgPSBzZWNvbmRhcnlTdGF0aWNBc3NldEN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggYmx1ZVgsIDAsIDAsIGJsdWVYLCAwLCByYWluYm93RG90LnNpemUgKTtcclxuLy8gYmx1ZUdyYWQuYWRkQ29sb3JTdG9wKCAwLCAgYHJnYmEoIDAsIDAsIDI1NSwgMC44IClgICk7XHJcbi8vIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMC4yLCAgYHJnYmEoIDAsIDAsIDI1NSwgMC44IClgICk7XHJcbi8vIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMC44LCAgYHJnYmEoIDAsIDAsIDI1NSwgMC4xIClgICk7XHJcbi8vIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMSwgIGByZ2JhKCAwLCAwLCAyNTUsIDAgKWAgKTtcclxuXHJcbi8vIHNlY29uZGFyeVN0YXRpY0Fzc2V0Q3R4LmZpbGxTdHlsZSA9IGJsdWVHcmFkOyBcclxuLy8gc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHguZmlsbENpcmNsZSggYmx1ZVgsIDAsIHJhaW5ib3dEb3Quc2l6ZSApO1xyXG5cclxuLy8gc2Vjb25kYXJ5U3RhdGljQXNzZXRDdHgucmVzdG9yZSgpO1xyXG5cclxuXHJcblxyXG4vLyBzZXQgdXAgbW9kaWZpZXIgc3lzdGVtIGFuZCBjb25uZWN0IHRvIHByb3BvcnRpb25hbCBtZWFzdXJlbWVudHNcclxuLy8gdmFyIG11c2NsZU1vZGlmaWVycyA9IG11c2NsZU1vZGlmaWVyLmNyZWF0ZU1vZGlmaWVycyggcG0gKTtcclxuLy8gbXVzY2xlTW9kaWZpZXIuc2V0UmFuZ2VJbnB1dHMoIG11c2NsZU1vZGlmaWVycyApO1xyXG5cclxuXHJcbi8vIGluaXQgZXllIGJsaW5rIHRyYWNrXHJcbi8vIHRyYWNrUGxheWVyLmxvYWRUcmFjayggNSwgJ2JsaW5rJywgc2VxLCBtdXNjbGVNb2RpZmllcnMgKTtcclxuXHJcblxyXG4vLyBleHByZXNzaW9uIGV2ZW50c1xyXG5cclxuICAgIC8vICQoICcuZXhwcmVzc2lvbi1zbWlsZScgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgIC8vICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDMwLCAnc21pbGUnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdzbWlsZScgKTtcclxuICAgIC8vIH0gKTtcclxuXHJcbiAgICAvLyAkKCAnLmV4cHJlc3Npb24tc21pbGUtYmlnJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMzAsICdiaWdTbWlsZScsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAvLyAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ2JpZ1NtaWxlJyApO1xyXG4gICAgLy8gfSApO1xyXG5cclxuICAgIC8vICQoICcuZXhwcmVzc2lvbi1lY3N0YXRpYycgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgIC8vICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDMwLCAnZWNzdGF0aWMnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdlY3N0YXRpYycgKTtcclxuICAgIC8vIH0gKTtcclxuXHJcbiAgICAvLyAkKCAnLmV4cHJlc3Npb24tc2FkJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggNjAsICdzYWQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdzYWQnICk7XHJcbiAgICAvLyB9ICk7XHJcblxyXG4gICAgLy8gJCggJy5leHByZXNzaW9uLXZlcnktc2FkJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggNjAsICdiaWdTYWQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdiaWdTYWQnICk7XHJcbiAgICAvLyB9ICk7XHJcblxyXG4gICAgLy8gJCggJy5leHByZXNzaW9uLWJsaW5rJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMTAsICdibGluaycsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAvLyAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ2JsaW5rJyApO1xyXG4gICAgLy8gfSApO1xyXG5cclxuICAgIC8vICQoICcuZXhwcmVzc2lvbi1yZXNldCcgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuICAgIC8vICAgICB0cmFja1BsYXllci5sb2FkVHJhY2soIDEwLCAncmVzZXQnLCBzZXEsIG11c2NsZU1vZGlmaWVycyApO1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLnN0YXJ0VHJhY2soICdyZXNldCcgKTtcclxuICAgIC8vIH0gKTtcclxuXHJcblxyXG4vLyBzZXF1ZW5jZSBidXR0b24gZXZlbnRzXHJcblxyXG4gICAgLy8gJCggJy5zZXF1ZW5jZS15YXduJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG4gICAgLy8gICAgIHRyYWNrUGxheWVyLmxvYWRUcmFjayggMzAwLCAneWF3bicsIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcbiAgICAvLyAgICAgdHJhY2tQbGF5ZXIuc3RhcnRUcmFjayggJ3lhd24nICk7XHJcbiAgICAvLyB9ICk7XHJcblxyXG5cclxuLy8gY29udHJvbCBwYW5lbCBldmVudHNcclxuICAgIFxyXG5cclxuICAgIC8vIGZhY2lhbCBmZWF0dXJlIHBhbmVsIGV2ZW50c1xyXG4gICAgLy8gdmFyICRmZWF0dXJlUGFnZVBhcmVudCA9ICQoICdbIGRhdGEtcGFnZT1cInBhZ2UtZWxlbWVudHNcIiBdJyk7XHJcblxyXG4gICAgLy8gdmFyICRmZWF0dXJlSW5wdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICdbIGRhdGEtZmFjZSBdJyApO1xyXG4gICAgLy8gJGZlYXR1cmVJbnB1dHMub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBlICkge1xyXG4gICAgLy8gICAgIHZhciAkc2VsZiA9ICQoIHRoaXMgKTtcclxuICAgIC8vICAgICB2YXIgZ2V0TW9kaWZpZXIgPSAkc2VsZi5kYXRhKCAnbW9kaWZpZXInICk7XHJcbiAgICAvLyAgICAgdmFyIGdldE11bHRpcGxpZXIgPSAkc2VsZi5kYXRhKCAndmFsdWUtbXVsdGlwbGllcicgKTtcclxuXHJcbiAgICAvLyAgICAgdmFyIHJlc3VsdCA9IHBhcnNlRmxvYXQoICRzZWxmLnZhbCgpICogZ2V0TXVsdGlwbGllciApO1xyXG4gICAgLy8gICAgIG11c2NsZU1vZGlmaWVyc1sgZ2V0TW9kaWZpZXIgXS5jdXJyID0gcmVzdWx0O1xyXG4gICAgLy8gICAgICRzZWxmLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nICkuZmluZCggJ291dHB1dCcgKS5odG1sKCByZXN1bHQgKTtcclxuICAgIC8vIH0gKTtcclxuXHJcbiAgICAvLyBzcGlrZSBHbGFyZSBwYW5lbCBldmVudHNcclxuXHJcbiAgICBsZXQgJHNwaWtlR2xhcmVFbFBhcmVudCA9ICQoICcuanMtZ2xhcmUtc3Bpa2UtZWZmZWN0cycgKTtcclxuICAgIGxldCAkc3Bpa2VHbGFyZUlucHV0cyA9ICRzcGlrZUdsYXJlRWxQYXJlbnQuZmluZCggJy5yYW5nZS1zbGlkZXInICk7XHJcbiAgICBsZXQgc3Bpa2VHbGFyZUNvbnRyb2xJbnB1dExpbmsgPSB7XHJcbiAgICAgICAgc3Bpa2VDb3VudElucHV0OiAnY291bnQnLFxyXG4gICAgICAgIHNwaWtlUmFkaXVzSW5wdXQ6ICdyJyxcclxuICAgICAgICBzcGlrZU1ham9yU2l6ZTogJ21ham9yUmF5TGVuJyxcclxuICAgICAgICBzcGlrZU1pbm9yU2l6ZTogJ21pbm9yUmF5TGVuJyxcclxuICAgICAgICBzcGlrZU1ham9yV2lkdGg6ICdtYWpvclJheVdpZHRoJyxcclxuICAgICAgICBzcGlrZU1pbm9yV2lkdGg6ICdtaW5vclJheVdpZHRoJyxcclxuICAgICAgICBzcGlrZUJsdXJBbW91bnQ6ICdibHVyJ1xyXG4gICAgfVxyXG5cclxuICAgICRzcGlrZUdsYXJlSW5wdXRzLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuICAgICAgICBjb25zdCAkc2VsZiA9ICQoIHRoaXMgKVsgMCBdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHRoaXNPcHQgPSBzcGlrZUdsYXJlQ29udHJvbElucHV0TGlua1sgJHNlbGYuaWQgXTtcclxuICAgICAgICBjb25zdCB0aGlzT3B0Q2ZnID0gc3VuU3Bpa2VzLmdsYXJlU3Bpa2VDb250cm9sSW5wdXRDZmdbIHRoaXNPcHQgXTtcclxuICAgICAgICBsZXQgJHNlbGZWYWwgPSBwYXJzZUZsb2F0KCAkc2VsZi52YWx1ZSApO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJyRzZWxmVmFsOiAnLCAkc2VsZlZhbCApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnJHNlbGYuaWQ6ICcsICRzZWxmLmlkICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0OiAnLCB0aGlzT3B0ICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0Q2ZnOiAnLCB0aGlzT3B0Q2ZnICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzT3B0Q2ZnOiAnLCByZXN1bHQgKTtcclxuXHJcbiAgICAgICAgc3VuU3Bpa2VzLmdsYXJlU3Bpa2VPcHRpb25zWyB0aGlzT3B0IF0gPSAkc2VsZlZhbDtcclxuICAgICAgICBzdW5TcGlrZXMuY2xlYXJSZW5kZXJDdHgoKTtcclxuICAgICAgICBzdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXMoKTtcclxuICAgIH0gKTtcclxuXHJcbi8vIGxvb2sgdGFyZ2V0IGV2ZW50c1xyXG4gICAgLy8gdmFyICRMb29rVGFyZ2V0SW5wdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICcucmFuZ2Utc2xpZGVyWyBkYXRhLWNvbnRyb2w9XCJsb29rXCIgXScgKTtcclxuICAgIC8vICRMb29rVGFyZ2V0SW5wdXRzLm9uKCAnaW5wdXQnLCBmdW5jdGlvbiggZSApIHtcclxuICAgIC8vICAgICB2YXIgJHNlbGYgPSAkKCB0aGlzICk7XHJcbiAgICAvLyAgICAgdmFyIGdldE1vZGlmaWVyID0gJHNlbGYuZGF0YSggJ21vZGlmaWVyJyApO1xyXG4gICAgLy8gICAgIHZhciBnZXRNdWx0aXBsaWVyID0gJHNlbGYuZGF0YSggJ3ZhbHVlLW11bHRpcGxpZXInICk7XHJcbiAgICAvLyAgICAgdmFyIHRoaXNBeGlzID0gZ2V0TW9kaWZpZXIuaW5kZXhPZiggJ1gnICkgIT0gLTEgPyAneCcgOiBnZXRNb2RpZmllci5pbmRleE9mKCAnWScgKSAhPSAtMSA/ICd5JyA6IGdldE1vZGlmaWVyLmluZGV4T2YoICdaJyApICE9IC0xID8gJ3onIDogZmFsc2U7XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coICdyYXcgdmFsdWU6ICcsICRzZWxmLnZhbCgpICk7XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coICdnZXRNdWx0aXBsaWVyOiAnLCBnZXRNdWx0aXBsaWVyICk7XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coICdyYXcgcmVzdWx0OiAnLCAkc2VsZi52YWwoKSAqIGdldE11bHRpcGxpZXIgKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKCB0aGlzQXhpcyA9PT0gJ3onICkge1xyXG4gICAgLy8gICAgICAgICBhaW1Db25zdHJhaW50LnNldEN1cnJlbnRTaXplKCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICAgIHZhciByZXN1bHQgPSBwYXJzZUZsb2F0KCAkc2VsZi52YWwoKSAqIGdldE11bHRpcGxpZXIgKTtcclxuICAgIC8vICAgICBhaW1Db25zdHJhaW50LnRhcmdldC5jb29yZHMuY3VyclsgdGhpc0F4aXMgXSA9IHJlc3VsdDtcclxuICAgIC8vICAgICAkc2VsZi5wYXJlbnQoKS5maW5kKCAnb3V0cHV0JyApLmh0bWwoIHJlc3VsdCApO1xyXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCAnd3Jvbmcgb25lIGZpcmluZycgKTtcclxuICAgIC8vIH0gKTtcclxuXHJcblxyXG5mdW5jdGlvbiBkcmF3T3ZlcmxheSgpIHtcclxuXHJcbiAgICBpZiAoIG92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcbiAgICAgICAgLy8gZHJhdyByZWZlcmVuY2UgcG9pbnRzXHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gdGhlU3VuLmNvbG91cnMuZGVidWcubGluZXM7XHJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKFsxLCA2XSk7XHJcblxyXG4gICAgICAgIGlmICggb3ZlcmxheUNmZy5kaXNwbGF5Q2VudHJlTGluZXMgKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBkcmF3IGNlbnRyZSBsaW5lc1xyXG4gICAgICAgICAgICBjdHgubGluZShcclxuICAgICAgICAgICAgICAgIHRoZVN1bi54IC0gKCB0aGVTdW4uciAqIDIgKSwgdGhlU3VuLnksXHJcbiAgICAgICAgICAgICAgICB0aGVTdW4ueCArICggdGhlU3VuLnIgKiAyICksIHRoZVN1bi55XHJcbiAgICAgICAgICAgICk7XHJcblxyXG5cclxuICAgICAgICAgICAgY3R4LmxpbmUoXHJcbiAgICAgICAgICAgICAgICB0aGVTdW4ueCwgdGhlU3VuLnkgLSAoIHRoZVN1bi5yICogMiApLFxyXG4gICAgICAgICAgICAgICAgdGhlU3VuLngsIHRoZVN1bi55ICsgKCB0aGVTdW4uciAqIDIgKVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG5cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgaWYgKCBvdmVybGF5Q2ZnLmRpc3BsYXlTdW5Ub1N0YWdlICkge1xyXG4gICAgICAgICAgICBmYWNlVG9TdGFnZUNlbnRyZURlYnVnTGluZSggY3R4ICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcbi8vIHN1blNwaWtlcy5kaXNwbGF5R2xhcmVTcGlrZXNSYW5kb20oKTtcclxuXHJcblxyXG5cclxuZnVuY3Rpb24gZHJhd3RoZVN1bigpIHtcclxuICAgIGN0eC5saW5lV2lkdGggPSB0aGVTdW4ubGluZXMub3V0ZXI7XHJcbiAgICBcclxuICAgIHRoZVN1bi5yZW5kZXIoKTsgXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUN5Y2xlKCkge1xyXG4gICAgLy8gZHJhd0ZhY2VHaW1ibGVDb250cm9sKCk7XHJcblxyXG4gICAgLy8gaWYgKCBtb3VzZURvd24gKSB7XHJcbiAgICAvLyAgICAgaWYgKCAhYWltQ29uc3RyYWludC50YXJnZXQucmVuZGVyQ29uZmlnLmlzSGl0ICkge1xyXG4gICAgLy8gICAgICAgICBhaW1Db25zdHJhaW50LmNoZWNrTW91c2VIaXQoKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAvLyAgICAgaWYgKCBhaW1Db25zdHJhaW50LnRhcmdldC5yZW5kZXJDb25maWcuaXNIaXQgKSB7XHJcbiAgICAvLyAgICAgICAgIGFpbUNvbnN0cmFpbnQubW91c2VNb3ZlVGFyZ2V0KCk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIGJnQ3ljbGVyLnVwZGF0ZVBoYXNlQ2xvY2soKTtcclxuICAgIGJnQ3ljbGVyLnJlbmRlciggdGhlU3VuICk7XHJcbiAgICB0aGVTdGFycy51cGRhdGUoKTtcclxuXHJcbiAgICBkcmF3dGhlU3VuKCk7XHJcbiAgICBkcmF3T3ZlcmxheSgpO1xyXG4gICAgc2luZVdhdmUubW9kdWxhdG9yKCk7XHJcbiAgICB0aGVTdW4udXBkYXRlUG9zaXRpb24oKTtcclxuICAgIHRoZVN1bi5pbmRpY2F0b3IoIGN0eCApO1xyXG4gICAgLy8gdHJhY2tQbGF5ZXIudXBkYXRlVHJhY2tQbGF5ZXIoIHNlcSwgbXVzY2xlTW9kaWZpZXJzICk7XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBjbGVhckNhbnZhcyhjdHgpIHtcclxuICAgIC8vIGNsZWFuaW5nXHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhblcsIGNhbkgpO1xyXG4gICAgLy8gY3R4LmNsZWFyUmVjdCggYnVmZmVyQ2xlYXJSZWdpb24ueCwgYnVmZmVyQ2xlYXJSZWdpb24ueSwgYnVmZmVyQ2xlYXJSZWdpb24udywgYnVmZmVyQ2xlYXJSZWdpb24uaCApO1xyXG5cclxuICAgIC8vIGJsaXRDdHguY2xlYXJSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG5cclxuICAgIC8vIGN0eC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC4xICknO1xyXG4gICAgLy8gY3R4LmZpbGxSZWN0KCAwLCAwLCBjYW5XLCBjYW5IICk7XHJcblxyXG4gICAgLy8gc2V0IGRpcnR5IGJ1ZmZlclxyXG4gICAgLy8gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbigpO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIHJ1bnRpbWVcclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5mdW5jdGlvbiB1cGRhdGUoKSB7XHJcblxyXG4gICAgLy8gbG9vcCBob3VzZWtlZXBpbmdcclxuICAgIHJ1bnRpbWUgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgLy8gbW91c2UgdHJhY2tpbmdcclxuICAgIGxhc3RNb3VzZVggPSBtb3VzZVg7IFxyXG4gICAgbGFzdE1vdXNlWSA9IG1vdXNlWTsgXHJcblxyXG4gICAgLy8gY2xlYW4gY2FudmFzXHJcbiAgICBjbGVhckNhbnZhcyggY3R4ICk7XHJcblxyXG4gICAgLy8gdXBkYXRlc1xyXG4gICAgdXBkYXRlQ3ljbGUoKTtcclxuXHJcbiAgICAvLyBsb29waW5nXHJcbiAgICBhbmltYXRpb24uc3RhdGUgPT09IHRydWUgPyAocnVudGltZUVuZ2luZS5zdGFydEFuaW1hdGlvbihydW50aW1lLCB1cGRhdGUpLCBjb3VudGVyKyspIDogcnVudGltZUVuZ2luZS5zdG9wQW5pbWF0aW9uKHJ1bnRpbWUpO1xyXG5cclxufVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIEVuZCBydW50aW1lXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbmlmIChhbmltYXRpb24uc3RhdGUgIT09IHRydWUpIHtcclxuICAgIGFuaW1hdGlvbi5zdGF0ZSA9IHRydWU7XHJcbiAgICB1cGRhdGUoKTtcclxufVxyXG5cclxuJCggJy5qcy1hdHRhY2hGbGFyZUNhbnZhcycgKS5jbGljayggZnVuY3Rpb24oIGV2ZW50ICl7XHJcblxyXG4gICAgaWYgKCAkKCB0aGlzICkuaGFzQ2xhc3MoICdpcy1hY3RpdmUnICkgKXtcclxuXHJcbiAgICAgICAgJCggdGhpcyApLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG4gICAgICAgICQoICcuYXNzZXQtY2FudmFzLWRpc3BsYXktbGF5ZXInICkucmVtb3ZlQ2xhc3MoICdhdHRhY2hlZENhbnZhcycgKS5yZW1vdmUoIGxlbnNGbGFyZUNhbnZhcyApO1xyXG4gICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgXHJcbiAgICAgICAgJCggdGhpcyApLmFkZENsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG4gICAgICAgICQoICcuYXNzZXQtY2FudmFzLWRpc3BsYXktbGF5ZXInICkuYWRkQ2xhc3MoICdhdHRhY2hlZENhbnZhcycgKS5hcHBlbmQoIGxlbnNGbGFyZUNhbnZhcyApO1xyXG4gICAgXHJcbiAgICB9XHJcblxyXG59ICk7XHJcblxyXG4kKCAnLmpzLWF0dGFjaFJhaW5ib3dDYW52YXMnICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cclxuICAgIGlmICggJCggdGhpcyApLmhhc0NsYXNzKCAnaXMtYWN0aXZlJyApICl7XHJcblxyXG4gICAgICAgICQoIHRoaXMgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuICAgICAgICAkKCAnLmFzc2V0LWNhbnZhcy1kaXNwbGF5LWxheWVyJyApLnJlbW92ZUNsYXNzKCAnYXR0YWNoZWRDYW52YXMnICkucmVtb3ZlKCBzZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcyApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgIFxyXG4gICAgICAgICQoIHRoaXMgKS5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuICAgICAgICAkKCAnLmFzc2V0LWNhbnZhcy1kaXNwbGF5LWxheWVyJyApLmFkZENsYXNzKCAnYXR0YWNoZWRDYW52YXMnICkuYXBwZW5kKCBzZWNvbmRhcnlTdGF0aWNBc3NldENhbnZhcyApO1xyXG4gICAgXHJcbiAgICB9XHJcblxyXG59ICk7XHJcblxyXG4kKCAnLmpzLWNsb3NlLW9zYy1jYW52YXMnICkuY2xpY2soIGZ1bmN0aW9uKCBldmVudCApe1xyXG5cclxuICAgICQoICcub3NjLWNhbnZhcy1kaXNwbGF5LWJ0bicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuICAgICQoICcuYXNzZXQtY2FudmFzLWRpc3BsYXktbGF5ZXInICkucmVtb3ZlQ2xhc3MoICdhdHRhY2hlZENhbnZhcycgKS5maW5kKCAnY2FudmFzJyApLnJlbW92ZSgpO1xyXG5cclxufSApO1xyXG4iLCJsZXQgYmFja2dyb3VuZHMgPSByZXF1aXJlKCAnLi9iYWNrZ3JvdW5kcy5qcycgKTtcclxubGV0IHRyaWcgPSByZXF1aXJlKCAnLi90cmlnb25vbWljVXRpbHMuanMnICkudHJpZ29ub21pY1V0aWxzO1xyXG5sZXQgYmFja2dyb3VuZERhdGEgPSB7XHJcblx0cGFyYW1zOiB7fSxcclxuXHRiZ0RhdGFTZXQ6IFtdXHJcbn07XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVCYWNrZ3JvdW5kRGF0YXNldCgpIHtcclxuXHJcblx0YmFja2dyb3VuZERhdGEucGFyYW1zLmxlbiA9IGJhY2tncm91bmRzLmxlbmd0aDtcclxuXHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBiYWNrZ3JvdW5kRGF0YS5wYXJhbXMubGVuOyBpKyspIHtcclxuXHRcdGxldCB0aGlzQmcgPSBiYWNrZ3JvdW5kc1sgaSBdO1xyXG5cdFx0YmFja2dyb3VuZERhdGEuYmdEYXRhU2V0LnB1c2goIHsgbGVuOiB0aGlzQmcubGVuZ3RoIH0gKTtcclxuXHR9XHJcblxyXG59O1xyXG5jcmVhdGVCYWNrZ3JvdW5kRGF0YXNldCgpO1xyXG5cclxuXHJcbmxldCBiYWNrZ3JvdW5kQ3ljbGVyID0ge1xyXG5cdGJnRGF0YTogYmFja2dyb3VuZERhdGEsXHJcblx0YmFja2dyb3VuZHM6IGJhY2tncm91bmRzLFxyXG5cdG9yYml0Q2VudHJlWDogMCxcclxuXHRvcmJpdENlbnRyZVk6IDAsXHJcblx0b3JiaXRSYWRpdXM6IDAsXHJcblx0Y3ljbGVEYXRhOiB7XHJcblx0XHR0b3RhbFRpbWU6IDAsXHJcblx0XHRwaGFzZVRpbWU6IDAsXHJcblx0XHRyZW1haW5pbmdUaW1lOiAwLFxyXG5cdFx0cGhhc2VDbG9jazogMCxcclxuXHRcdHBoYXNlSW50ZXJ2YWw6IDAsXHJcblx0XHRhbHBoYUludGVydmFsOiAwLFxyXG5cdFx0Y3VyckFscGhhOiAwLFxyXG5cdFx0Y3VyclVuZGVyQmc6IDAsXHJcblx0XHRjdXJyT3ZlckJnOiAwXHJcblx0fSxcclxuXHRyZW5kZXJQYXJhbXM6IHt9LFxyXG5cdFxyXG5cclxuXHRnZXRSZW5kZXJDYW52YXM6IGZ1bmN0aW9uKCBjYW52YXMsIGNvbnRleHQsIG9yYml0Q29vcmRpbmF0ZXMgKSB7XHJcblx0XHR0aGlzLnJlbmRlclBhcmFtcy5jYW52YXMgPSBjYW52YXM7XHJcblx0XHR0aGlzLnJlbmRlclBhcmFtcy5jdHggPSBjb250ZXh0O1xyXG5cdFx0dGhpcy5vcmJpdENlbnRyZVggPSBvcmJpdENvb3JkaW5hdGVzLng7XHJcblx0XHR0aGlzLm9yYml0Q2VudHJlWSA9IG9yYml0Q29vcmRpbmF0ZXMueTtcclxuXHRcdHRoaXMub3JiaXRDZW50cmVSID0gb3JiaXRDb29yZGluYXRlcy5yO1xyXG5cdH0sXHJcblxyXG5cdGdldEN5Y2xlVGltZTogZnVuY3Rpb24oIGN5Y2xlVGltZSApIHtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLnRvdGFsVGltZSA9IGN5Y2xlVGltZTtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZSA9IE1hdGguZmxvb3IoIGN5Y2xlVGltZSAvIHRoaXMuYmdEYXRhLnBhcmFtcy5sZW4gKTtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLnJlbWFpbmluZ1RpbWUgPSBjeWNsZVRpbWUgLSAoIHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZSAqIHRoaXMuYmdEYXRhLnBhcmFtcy5sZW4gICk7XHJcblx0XHR0aGlzLmN5Y2xlRGF0YS5hbHBoYUludGVydmFsID0gMSAvIHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZTtcclxuXHR9LFxyXG5cclxuXHJcblx0c2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiggY3VyciApIHtcclxuXHJcblx0XHRsZXQgY3VyclBoYXNlID0gTWF0aC5mbG9vciggY3VyciAvIHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZSApO1xyXG5cdFx0bGV0IHBoYXNlUmVtYWluZGVyID0gY3VyciAtICggY3VyclBoYXNlICogdGhpcy5jeWNsZURhdGEucGhhc2VUaW1lICk7XHJcblx0XHRsZXQgdGVtcEN1cnJQaGFzZSA9IGN1cnJQaGFzZSAtIDYgPCAwID8gdGhpcy5iZ0RhdGEucGFyYW1zLmxlbiArICggY3VyclBoYXNlIC0gNiApIDogY3VyclBoYXNlIC0gNjtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLmN1cnJVbmRlckJnID0gdGVtcEN1cnJQaGFzZSA9PT0gMCA/IHRoaXMuYmdEYXRhLnBhcmFtcy5sZW4gLSAxIDogdGVtcEN1cnJQaGFzZSAtIDE7XHJcblx0XHR0aGlzLmN5Y2xlRGF0YS5jdXJyT3ZlckJnID0gdGVtcEN1cnJQaGFzZTtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLnBoYXNlQ2xvY2sgPSBwaGFzZVJlbWFpbmRlcjtcclxuXHRcdHRoaXMuY3ljbGVEYXRhLnBoYXNlSW50ZXJ2YWwgPSAoIHRoaXMuY3ljbGVEYXRhLnRvdGFsVGltZSAvIHRoaXMuYmdEYXRhLnBhcmFtcy5sZW4gICkgLyB0aGlzLmN5Y2xlRGF0YS5waGFzZVRpbWU7XHJcblxyXG5cdH0sXHJcblx0XHJcblx0cmVzZXRDdXJyQWxwaGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5jeWNsZURhdGEuY3VyckFscGhhID0gMDtcclxuXHR9LFxyXG5cdFxyXG5cdHVwZGF0ZUN1cnJBbHBoYTogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmN5Y2xlRGF0YS5jdXJyQWxwaGEgKz0gdGhpcy5jeWNsZURhdGEuYWxwaGFJbnRlcnZhbDtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGVQaGFzZUNsb2NrOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICggdGhpcy5jeWNsZURhdGEucGhhc2VDbG9jayA+IHRoaXMuY3ljbGVEYXRhLnBoYXNlSW50ZXJ2YWwgKSB7XHJcblx0XHRcdHRoaXMuY3ljbGVEYXRhLnBoYXNlQ2xvY2sgLT0gdGhpcy5jeWNsZURhdGEucGhhc2VJbnRlcnZhbDtcclxuXHRcdFx0dGhpcy51cGRhdGVDdXJyQWxwaGEoKTtcclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHR0aGlzLmN5Y2xlRGF0YS5waGFzZUNsb2NrID0gdGhpcy5jeWNsZURhdGEucGhhc2VUaW1lO1xyXG5cdFx0XHR0aGlzLnVwZGF0ZUJnKCk7XHJcblx0XHRcdHRoaXMucmVzZXRDdXJyQWxwaGEoKTtcclxuXHRcdH1cclxuXHRcdC8vIHRoaXMudXBkYXRlUmVtYWluaW5nVGltZSgpO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZVJlbWFpbmluZ1RpbWU6IGZ1bmN0aW9uKCl7XHJcblxyXG5cdFx0aWYgKCB0aGlzLmN5Y2xlRGF0YS5yZW1haW5pbmdUaW1lID09PSAwICkge1xyXG5cdFx0XHR0aGlzLmN5Y2xlRGF0YS5yZW1haW5pbmdUaW1lID0gdGhpcy5jeWNsZURhdGEudG90YWxUaW1lO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCB0aGlzLmN5Y2xlRGF0YS5yZW1haW5pbmdUaW1lID49IHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZSApIHtcclxuXHRcdFx0XHR0aGlzLmN5Y2xlRGF0YS5yZW1haW5pbmdUaW1lIC09IHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cclxuXHR1cGRhdGVCZzogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0aWYgKCB0aGlzLmN5Y2xlRGF0YS5jdXJyVW5kZXJCZyA9PT0gdGhpcy5iZ0RhdGEucGFyYW1zLmxlbiAtIDEgKSB7XHJcblx0XHRcdHRoaXMuY3ljbGVEYXRhLmN1cnJVbmRlckJnID0gMDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY3ljbGVEYXRhLmN1cnJVbmRlckJnICs9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLmN5Y2xlRGF0YS5jdXJyT3ZlckJnID09PSB0aGlzLmJnRGF0YS5wYXJhbXMubGVuIC0gMSApIHtcclxuXHRcdFx0dGhpcy5jeWNsZURhdGEuY3Vyck92ZXJCZyA9IDA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmN5Y2xlRGF0YS5jdXJyT3ZlckJnICs9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB0aGlzLmN5Y2xlRGF0YS5jdXJyT3ZlckJnID09PSB0aGlzLmJnRGF0YS5wYXJhbXMubGVuIC0gMSApIHtcclxuXHRcdFx0dGhpcy5jeWNsZURhdGEucGhhc2VDbG9jayA9IHRoaXMuY3ljbGVEYXRhLnBoYXNlVGltZSArIHRoaXMuY3ljbGVEYXRhLnJlbWFpbmluZ1RpbWU7XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZyggJ3RoaXMuY3ljbGVEYXRhLnBoYXNlQ2xvY2s6ICcsIHRoaXMuY3ljbGVEYXRhLnBoYXNlQ2xvY2sgKTtcclxuXHJcblx0fSxcclxuXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCBzdW4gKSB7XHJcblxyXG4gICAgICAgIGxldCBjID0gdGhpcy5yZW5kZXJQYXJhbXMuY3R4O1xyXG4gICAgICAgIGxldCBjYW52YXMgPSB0aGlzLnJlbmRlclBhcmFtcy5jYW52YXM7XHJcbiAgICAgICAgbGV0IGN1cnJVbmRlckJnID0gdGhpcy5iYWNrZ3JvdW5kc1sgdGhpcy5jeWNsZURhdGEuY3VyclVuZGVyQmcgXTtcclxuICAgICAgICBsZXQgY3VyclVuZGVyQmdEYXRhID0gdGhpcy5iZ0RhdGEuYmdEYXRhU2V0WyB0aGlzLmN5Y2xlRGF0YS5jdXJyVW5kZXJCZyBdLmxlbjtcclxuICAgICAgICBsZXQgY3Vyck92ZXJCZyA9IHRoaXMuYmFja2dyb3VuZHNbIHRoaXMuY3ljbGVEYXRhLmN1cnJPdmVyQmcgXTtcclxuICAgICAgICBsZXQgY3Vyck92ZXJCZ0RhdGEgPSB0aGlzLmJnRGF0YS5iZ0RhdGFTZXRbIHRoaXMuY3ljbGVEYXRhLmN1cnJPdmVyQmcgXS5sZW47XHJcbiAgICAgICAgbGV0IHJhZGlhbERpc3QgPSB0cmlnLmRpc3QoIHN1bi54LCBzdW4ueSwgdGhpcy5vcmJpdENlbnRyZVgsIHRoaXMub3JiaXRDZW50cmVZICkgKiAyLjU7XHJcblxyXG4gICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgICAgICBjLmdsb2JhbEFscGhhID0gMTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHVuZGVyR3JhZGllbnQgPSBjLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICBsZXQgdW5kZXJHcmFkaWVudCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIHN1bi54LCBzdW4ueSwgcmFkaWFsRGlzdCwgc3VuLngsIHN1bi55LCAwICk7XHJcblxyXG4gICAgICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgY3VyclVuZGVyQmdEYXRhOyBpKyspIHtcclxuICAgICAgICAvLyBcdHVuZGVyR3JhZGllbnQuYWRkQ29sb3JTdG9wKCBjdXJyVW5kZXJCZ1sgaSBdLnBvcywgY3VyclVuZGVyQmdbIGkgXS5jb2xvdXIgKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGN1cnJVbmRlckJnRGF0YSAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgXHR1bmRlckdyYWRpZW50LmFkZENvbG9yU3RvcCggY3VyclVuZGVyQmdbIGkgXS5wb3MsIGN1cnJVbmRlckJnWyBpIF0uY29sb3VyICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjLmZpbGxTdHlsZSA9IHVuZGVyR3JhZGllbnQ7XHJcbiAgICAgICAgYy5maWxsUmVjdCggMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XHJcblxyXG4gICAgICAgIGMuZ2xvYmFsQWxwaGEgPSB0aGlzLmN5Y2xlRGF0YS5jdXJyQWxwaGE7XHJcblxyXG4gICAgICAgIC8vIGxldCBvdmVyR3JhZGllbnQgPSBjLmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIDAsIGNhbnZhcy5oZWlnaHQgKTtcclxuICAgICAgICBsZXQgb3ZlckdyYWRpZW50ID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggc3VuLngsIHN1bi55LCByYWRpYWxEaXN0LCBzdW4ueCwgc3VuLnksIDAgKTtcclxuICAgICAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGN1cnJPdmVyQmdEYXRhOyBpKyspIHtcclxuICAgICAgICAvLyBcdG92ZXJHcmFkaWVudC5hZGRDb2xvclN0b3AoIGN1cnJPdmVyQmdbIGkgXS5wb3MsIGN1cnJPdmVyQmdbIGkgXS5jb2xvdXIgKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGN1cnJPdmVyQmdEYXRhIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBcdG92ZXJHcmFkaWVudC5hZGRDb2xvclN0b3AoIGN1cnJPdmVyQmdbIGkgXS5wb3MsIGN1cnJPdmVyQmdbIGkgXS5jb2xvdXIgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSBvdmVyR3JhZGllbnQ7XHJcbiAgICAgICAgYy5maWxsUmVjdCggMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0ICk7XHJcblxyXG4gICAgICAgIGMuZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgICAgIGxldCBjdXJyQmdIb3VyID0gdGhpcy5jeWNsZURhdGEuY3VyclVuZGVyQmcgLSAxO1xyXG4gICAgICAgIGxldCBjdXJySG91ciA9IHRoaXMuY3ljbGVEYXRhLmN1cnJVbmRlckJnID4gMTIgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgbGV0IGhvdXJUZXh0ID0gKCAoIGN1cnJIb3VyID09PSB0cnVlID8gY3VyckJnSG91ciAtIDEyIDogY3VyckJnSG91ciApICsgMSkgKyAoIGN1cnJIb3VyID09PSB0cnVlID8gJ3BtJyA6ICdhbScgKTsgXHJcblxyXG4gICAgICAgIGMuZmlsbFN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgYy5mb250ID0gJzIwcHggVGFob21hJztcclxuICAgICAgICBjLmZpbGxUZXh0KCBob3VyVGV4dCwgMTAwLCAzMDAgKTtcclxuXHJcblxyXG4gICAgXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uKCBjYW52YXMsIGNvbnRleHQsIGN5Y2xlVGltZSwgY3VyclBvcywgb3JiaXREYXRhICkge1xyXG4gICAgXHR0aGlzLmdldFJlbmRlckNhbnZhcyggY2FudmFzLCBjb250ZXh0LCBvcmJpdERhdGEgKTtcclxuICAgIFx0dGhpcy5nZXRDeWNsZVRpbWUoIGN5Y2xlVGltZSApO1xyXG4gICAgXHR0aGlzLnNldEluaXRpYWxTdGF0ZSggY3VyclBvcyApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tncm91bmRDeWNsZXI7IiwibGV0IGJhY2tncm91bmRzID0gW1xyXG5cdC8vLy8gYmxhY2sgKCBtaWQtbmlnaHQgKVxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDAsIDAsIDEyKScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMCwgMCwgMTIpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDIsIDEsIDE3KScsIHBvczogMC44NSB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMjUsIDIyLCAzMyknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMiwgMSwgMTcpJywgcG9zOiAwLjYgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDMyLCAzMiwgNDQpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDIsIDEsIDE3KScsIHBvczogMC4xIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYig1OCwgNTgsIDgyKScsIHBvczogMSB9XHJcblx0XSxcclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigzMiwgMzIsIDQ0KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoODEsIDgxLCAxMTcpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDY0LCA2NCwgOTIpJywgcG9zOiAwIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxMTEsIDExMywgMTcwKScsIHBvczogMC44IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxMzgsIDExOCwgMTcxKScsIHBvczogMSB9XHJcblx0XSxcclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYig3NCwgNzMsIDEwNSknLCBwb3M6IDAgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDExMiwgMTE0LCAxNzEpJywgcG9zOiAwLjUgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDIwNSwgMTMwLCAxNjApJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDExNywgMTIyLCAxOTEpJywgcG9zOiAwIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxMzMsIDEzMSwgMTkwKScsIHBvczogMC42IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigyMzQsIDE3NiwgMjA5KScsIHBvczogMSB9XHJcblx0XSxcclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigxMzAsIDE3MywgMjE5KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMjM1LCAxNzgsIDE3NyknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblx0W1xyXG5cclxuXHRcdHsgY29sb3VyOiAncmdiKDE0OCwgMTk3LCAyNDgpJywgcG9zOiAwLjAxIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxNjYsIDIzMCwgMjU1KScsIHBvczogMC43IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxNzcsIDE4MSwgMjM0KScsIHBvczogMSB9XHJcblx0XSxcclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigxODMsIDIzNCwgMjU1KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMTQ4LCAyMjMsIDI1NSknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDE1NSwyMjYsMjU0KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMTAzLDIwOSwyNTEpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigxNDQsMjIzLDI1NCknLCBwb3M6IDAgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDU2LDE2MywyMDkpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cdFxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDE0NCwyMjMsMjM1KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMzYsMTExLDE2OCknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDQ1LDE0NSwxOTQpJywgcG9zOiAwIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigzMCw4MiwxNDIpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigzNiwxMTUsMTcxKScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMzAsODIsMTQyKScsIHBvczogMC43IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYig5MSwxMjEsMTMxKScsIHBvczogMSB9XHJcblx0XSxcclxuXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMzAsODIsMTQyKScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMzgsODgsMTM3KScsIHBvczogMC41IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigxNTcsMTY2LDExMyknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDMwLDgyLDE0MiknLCBwb3M6IDAgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDExNCwxMzgsMTI0KScsIHBvczogMC41IH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYigyMzMsMjA2LDkzKScsIHBvczogMSB9XHJcblx0XSxcclxuXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMjEsNjYsMTE5KScsIHBvczogMCB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoODcsMTEwLDExMyknLCBwb3M6IDAuMyB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMjI1LDE5Niw5NCknLCBwb3M6IDEgfVxyXG5cdFx0Ly8geyBjb2xvdXI6ICdyZ2IoMTc4LDk5LDU3KScsIHBvczogMSB9XHJcblx0XSxcclxuXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMjIsNjAsODIpJywgcG9zOiAwIH0sXHJcblx0XHR7IGNvbG91cjogJ3JnYig3OSw3OSw3MSknLCBwb3M6IDAuMyB9LFxyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoMTk3LDExNyw0NSknLCBwb3M6IDEgfVxyXG5cdFx0Ly8geyBjb2xvdXI6ICdyZ2IoMTgzLDczLDE1KScsIHBvczogMSB9XHJcblx0XHQvLyB7IGNvbG91cjogJ3JnYig0NywxNyw3KScsIHBvczogMSB9XHJcblx0XSxcclxuXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoNywyNywzOCknLCBwb3M6IDAgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDcsMjcsMzgpJywgcG9zOiAwLjMgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDEzOCw1OSwxOCknLCBwb3M6IDEgfVxyXG5cdFx0Ly8geyBjb2xvdXI6ICdyZ2IoMzYsMTQsMyknLCBwb3M6IDEgfVxyXG5cdF0sXHJcblxyXG5cdFtcclxuXHRcdHsgY29sb3VyOiAncmdiKDEsMTAsMTYpJywgcG9zOiAwLjMgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDg5LDM1LDExKScsIHBvczogMSB9XHJcblx0XHQvLyB7IGNvbG91cjogJ3JnYig0NywxNyw3KScsIHBvczogMSB9XHJcblx0XSxcclxuXHJcblx0W1xyXG5cdFx0eyBjb2xvdXI6ICdyZ2IoOSw0LDEpJywgcG9zOiAwLjUgfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDc1LDI5LDYpJywgcG9zOiAxIH1cclxuXHRdLFxyXG5cclxuXHRbXHJcblx0XHR7IGNvbG91cjogJ3JnYigwLDAsMTIpJywgcG9zOiAwLjggfSxcclxuXHRcdHsgY29sb3VyOiAncmdiKDIxLDgsMCknLCBwb3M6IDEgfVxyXG5cdF1cclxuXHJcbl07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tncm91bmRzOyIsIi8qKlxyXG4qIEBkZXNjcmlwdGlvbiBleHRlbmRzIENhbnZhcyBwcm90b3R5cGUgd2l0aCB1c2VmdWwgZHJhd2luZyBtaXhpbnNcclxuKiBAa2luZCBjb25zdGFudFxyXG4qL1xyXG52YXIgY2FudmFzRHJhd2luZ0FwaSA9IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBkcmF3IGNpcmNsZSBBUElcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuY2lyY2xlID0gZnVuY3Rpb24gKHgsIHksIHIpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdHRoaXMuYXJjKHgsIHksIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCBjaXJjbGVcclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0geSAtIG9yaWdpbiBZIG9mIGNpcmNsZS5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIHJhZGl1cyBvZiBjaXJjbGUuXHJcbiovXHJcbmNhbnZhc0RyYXdpbmdBcGkuZmlsbENpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByLCBjb250ZXh0KSB7XHJcblx0dGhpcy5jaXJjbGUoeCwgeSwgciwgY29udGV4dCk7XHJcblx0dGhpcy5maWxsKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgY2lyY2xlXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBvcmlnaW4gWCBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvcmlnaW4gWSBvZiBjaXJjbGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHIgLSByYWRpdXMgb2YgY2lyY2xlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUNpcmNsZSA9IGZ1bmN0aW9uICh4LCB5LCByKSB7XHJcblx0dGhpcy5jaXJjbGUoeCwgeSwgcik7XHJcblx0dGhpcy5zdHJva2UoKTtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiogQGF1Z21lbnRzIGNhbnZhc0RyYXdpbmdBcGlcclxuKiBAZGVzY3JpcHRpb24gQVBJIHRvIGRyYXcgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLlBJICogMjsgaSArPSBNYXRoLlBJIC8gMTYpIHtcclxuXHRcdHRoaXMubGluZVRvKHggKyBNYXRoLmNvcyhpKSAqIHcgLyAyLCB5ICsgTWF0aC5zaW4oaSkgKiBoIC8gMik7XHJcblx0fVxyXG5cdHRoaXMuY2xvc2VQYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBmaWxsZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmZpbGxFbGxpcHNlID0gZnVuY3Rpb24gKHgsIHksIHcsIGgpIHtcclxuXHR0aGlzLmVsbGlwc2UoeCwgeSwgdywgaCwgY29udGV4dCk7XHJcblx0dGhpcy5maWxsKCk7XHJcblx0dGhpcy5iZWdpblBhdGgoKTtcclxufTtcclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IHN0cm9rZWQgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIG9yaWdpbiBYIG9mIGVsbGlwc2UuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBvZmlnaW4gWSBvciBlbGxpcHNlLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB3IC0gd2lkdGggb2YgZWxsaXBzZS5cclxuKiBAcGFyYW0ge251bWJlcn0gdyAtIGhlaWdodCBvZiBlbGxpcHNlLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZUVsbGlwc2UgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xyXG5cdHRoaXMuZWxsaXBzZSh4LCB5LCB3LCBoKTtcclxuXHR0aGlzLnN0cm9rZSgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBsaW5lIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHgxIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkyIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLmxpbmUgPSBmdW5jdGlvbiAoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHR0aGlzLmJlZ2luUGF0aCgpO1xyXG5cdHRoaXMubW92ZVRvKHgxLCB5MSk7XHJcblx0dGhpcy5saW5lVG8oeDIsIHkyKTtcclxuXHR0aGlzLnN0cm9rZSgpO1xyXG5cdHRoaXMuYmVnaW5QYXRoKCk7XHJcbn07XHJcblxyXG4vKipcclxuKiBAYXVnbWVudHMgY2FudmFzRHJhd2luZ0FwaVxyXG4qIEBkZXNjcmlwdGlvbiBBUEkgdG8gZHJhdyBzdHJva2VkIHJlZ3VsYXIgcG9seWdvbiBzaGFwZS5cclxuKiBAcGFyYW0ge251bWJlcn0geCAtIFggY29vcmRpbmF0ZSBvZiB0aGUgcG9seWdvbiBvcmlnaW4uXHJcbiogQHBhcmFtIHtudW1iZXJ9IHkgLSBZIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSByIC0gUmFkaXVzIG9mIHRoZSBwb2x5Z29uLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBzIC0gTnVtYmVyIG9mIHNpZGVzLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSBjdHggLSBUaGUgY2FudmFzIGNvbnRleHQgdG8gb3V0cHV0LlxyXG4qL1xyXG5jYW52YXNEcmF3aW5nQXBpLnN0cm9rZVBvbHkgPSBmdW5jdGlvbiAoIHgsIHksIHIsIHMsIGN0eCApIHtcclxuXHRcclxuXHR2YXIgc2lkZXMgPSBzO1xyXG5cdHZhciByYWRpdXMgPSByO1xyXG5cdHZhciBjeCA9IHg7XHJcblx0dmFyIGN5ID0geTtcclxuXHR2YXIgYW5nbGUgPSAyICogTWF0aC5QSSAvIHNpZGVzO1xyXG5cdFxyXG5cdGN0eC5iZWdpblBhdGgoKTtcclxuXHRjdHgudHJhbnNsYXRlKCBjeCwgY3kgKTtcclxuXHRjdHgubW92ZVRvKCByYWRpdXMsIDAgKTsgICAgICAgICAgXHJcblx0Zm9yICggdmFyIGkgPSAxOyBpIDw9IHNpZGVzOyBpKysgKSB7XHJcblx0XHRjdHgubGluZVRvKFxyXG5cdFx0XHRyYWRpdXMgKiBNYXRoLmNvcyggaSAqIGFuZ2xlICksXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguc2luKCBpICogYW5nbGUgKVxyXG5cdFx0KTtcclxuXHR9XHJcblx0Y3R4LnN0cm9rZSgpO1xyXG5cdGN0eC50cmFuc2xhdGUoIC1jeCwgLWN5ICk7XHJcbn1cclxuXHJcbi8qKlxyXG4qIEBhdWdtZW50cyBjYW52YXNEcmF3aW5nQXBpXHJcbiogQGRlc2NyaXB0aW9uIEFQSSB0byBkcmF3IGZpbGxlZCByZWd1bGFyIHBvbHlnb24gc2hhcGUuXHJcbiogQHBhcmFtIHtudW1iZXJ9IHggLSBYIGNvb3JkaW5hdGUgb2YgdGhlIHBvbHlnb24gb3JpZ2luLlxyXG4qIEBwYXJhbSB7bnVtYmVyfSB5IC0gWSBjb29yZGluYXRlIG9mIHRoZSBwb2x5Z29uIG9yaWdpbi5cclxuKiBAcGFyYW0ge251bWJlcn0gciAtIFJhZGl1cyBvZiB0aGUgcG9seWdvbi5cclxuKiBAcGFyYW0ge251bWJlcn0gcyAtIE51bWJlciBvZiBzaWRlcy5cclxuKiBAcGFyYW0ge251bWJlcn0gY3R4IC0gVGhlIGNhbnZhcyBjb250ZXh0IHRvIG91dHB1dC5cclxuKi9cclxuY2FudmFzRHJhd2luZ0FwaS5maWxsUG9seSA9IGZ1bmN0aW9uICggeCwgeSwgciwgcywgY3R4ICkge1xyXG5cdFxyXG5cdHZhciBzaWRlcyA9IHM7XHJcblx0dmFyIHJhZGl1cyA9IHI7XHJcblx0dmFyIGN4ID0geDtcclxuXHR2YXIgY3kgPSB5O1xyXG5cdHZhciBhbmdsZSA9IDIgKiBNYXRoLlBJIC8gc2lkZXM7XHJcblx0XHJcblx0Y3R4LmJlZ2luUGF0aCgpO1xyXG5cdGN0eC50cmFuc2xhdGUoIGN4LCBjeSApO1xyXG5cdGN0eC5tb3ZlVG8oIHJhZGl1cywgMCApOyAgICAgICAgICBcclxuXHRmb3IgKCB2YXIgaSA9IDE7IGkgPD0gc2lkZXM7IGkrKyApIHtcclxuXHRcdGN0eC5saW5lVG8oXHJcblx0XHRcdHJhZGl1cyAqIE1hdGguY29zKCBpICogYW5nbGUgKSxcclxuXHRcdFx0cmFkaXVzICogTWF0aC5zaW4oIGkgKiBhbmdsZSApXHJcblx0XHQpO1xyXG5cdH1cclxuXHRjdHguZmlsbCgpO1xyXG5cdGN0eC50cmFuc2xhdGUoIC1jeCwgLWN5ICk7XHJcblx0XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBjYW52YXNEcmF3aW5nQXBpOyIsInZhciBtYXRoVXRpbHMgPSByZXF1aXJlKCcuL21hdGhVdGlscy5qcycpLm1hdGhVdGlscztcclxuXHJcbnZhciBjb2xvclV0aWxzID0ge1xyXG5cdC8qKlxyXG4gKiBwcm92aWRlcyBjb2xvciB1dGlsIG1ldGhvZHMuXHJcbiAqL1xyXG5cdHJnYjogZnVuY3Rpb24gcmdiKHJlZCwgZ3JlZW4sIGJsdWUpIHtcclxuXHRcdHJldHVybiAncmdiKCcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChyZWQpLCAwLCAyNTUpICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChNYXRoLnJvdW5kKGdyZWVuKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChibHVlKSwgMCwgMjU1KSArICcpJztcclxuXHR9LFxyXG5cdHJnYmE6IGZ1bmN0aW9uIHJnYmEocmVkLCBncmVlbiwgYmx1ZSwgYWxwaGEpIHtcclxuXHRcdHJldHVybiAncmdiYSgnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQocmVkKSwgMCwgMjU1KSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoTWF0aC5yb3VuZChncmVlbiksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKE1hdGgucm91bmQoYmx1ZSksIDAsIDI1NSkgKyAnLCAnICsgbWF0aFV0aWxzLmNsYW1wKGFscGhhLCAwLCAxKSArICcpJztcclxuXHR9LFxyXG5cdGhzbDogZnVuY3Rpb24gaHNsKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzKSB7XHJcblx0XHRyZXR1cm4gJ2hzbCgnICsgaHVlICsgJywgJyArIG1hdGhVdGlscy5jbGFtcChzYXR1cmF0aW9uLCAwLCAxMDApICsgJyUsICcgKyBtYXRoVXRpbHMuY2xhbXAobGlnaHRuZXNzLCAwLCAxMDApICsgJyUpJztcclxuXHR9LFxyXG5cdGhzbGE6IGZ1bmN0aW9uIGhzbGEoaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MsIGFscGhhKSB7XHJcblx0XHRyZXR1cm4gJ2hzbGEoJyArIGh1ZSArICcsICcgKyBtYXRoVXRpbHMuY2xhbXAoc2F0dXJhdGlvbiwgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGxpZ2h0bmVzcywgMCwgMTAwKSArICclLCAnICsgbWF0aFV0aWxzLmNsYW1wKGFscGhhLCAwLCAxKSArICcpJztcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jb2xvclV0aWxzID0gY29sb3JVdGlsczsiLCJsZXQgb3ZlcmxheUNmZyA9IHJlcXVpcmUoJy4vb3ZlcmxheS5qcycpLm92ZXJsYXlDZmc7XHJcbmxldCBzdW5TcGlrZXMgPSByZXF1aXJlKCcuL3N1blNwaWtlcy5qcycpO1xyXG5cclxuXHJcblxyXG4kKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpe1xyXG5cclxuXHRsZXQgcGFnZUFuaW1DbGFzc0xpc3QgPSAnaXMtYWN0aXZlIHRvLWxlZnQgZnJvbS1sZWZ0IHRvLXJpZ2h0IGZyb20tcmlnaHQnO1xyXG5cdFx0JCggJy5qcy1wYWdlLXNlbGVjdCcgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHRcdGxldCAkdGhpc0J1dHRvbiA9ICQoIHRoaXMgKTtcclxuXHRcdGxldCBzZWxlY3RzUGFnZSA9ICR0aGlzQnV0dG9uLmF0dHIoICdkYXRhLXBhZ2Utc2VsZWN0JyApO1xyXG5cdFx0bGV0ICRjdXJyZW50UGFnZSA9ICQoICcuY29udHJvbC0tcGFuZWxfX3BhZ2UuaXMtYWN0aXZlJyk7XHJcblx0XHRsZXQgY3VycmVudFBhZ2VPcmRlciA9ICQoICcuY29udHJvbC0tcGFuZWxfX3BhZ2UnICkuYXR0ciggJ2RhdGEtcGFnZS1vcmRlcicgKTtcclxuXHRcdGxldCAkbmV3UGFnZSA9ICQoICdbZGF0YS1wYWdlPVwiJytzZWxlY3RzUGFnZSsnXCJdJyk7XHJcblx0XHRsZXQgbmV3UGFnZU9yZGVyID0gJG5ld1BhZ2UuYXR0ciggJ2RhdGEtcGFnZS1vcmRlcicgKTtcclxuXHRcdGxldCBpc05ld1BhZ2VPcmRlckdyZWF0ZXIgPSBuZXdQYWdlT3JkZXIgPiBjdXJyZW50UGFnZU9yZGVyID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0bGV0IGludHJvQ2xhc3MgPSBpc05ld1BhZ2VPcmRlckdyZWF0ZXIgPyAnZnJvbS1yaWdodCcgOiAnZnJvbS1sZWZ0JztcclxuXHRcdGxldCBvdXRyb0NsYXNzID0gaXNOZXdQYWdlT3JkZXJHcmVhdGVyID8gJ3RvLWxlZnQnIDogJ3RvLXJpZ2h0JztcclxuXHRcdGlmICggJHRoaXNCdXR0b24uaGFzQ2xhc3MoICdpcy1hY3RpdmUnKSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdCRjdXJyZW50UGFnZS5yZW1vdmVDbGFzcyggcGFnZUFuaW1DbGFzc0xpc3QgKS5hZGRDbGFzcyggb3V0cm9DbGFzcyApO1xyXG5cdFx0XHQkdGhpc0J1dHRvbi5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cdFx0XHQkbmV3UGFnZS5hZGRDbGFzcyggJ2lzLWFjdGl2ZSAnK2ludHJvQ2xhc3MgKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHJcblxyXG5cclxuXHRsZXQgJGNvbnRyb2xQYWdlcyA9ICQoICcuY29udHJvbC0tcGFuZWxfX3BhZ2UnICk7XHJcblx0bGV0ICRjb250cm9sU2VjdGlvbnMgPSAkKCAnLmNvbnRyb2wtLXBhbmVsX19zZWN0aW9uJyApO1xyXG5cdGxldCBudW1TZWN0aW9ucyA9ICRjb250cm9sU2VjdGlvbnMubGVuZ3RoIC0gMTtcclxuXHQkY29udHJvbFNlY3Rpb25zLmFkZENsYXNzKCAnLmlzLWFjdGl2ZScgKTtcclxuXHQkY29udHJvbFBhZ2VzLmFkZENsYXNzKCAnLmlzLWFjdGl2ZScgKTtcclxuXHJcblx0JGNvbnRyb2xQYWdlcy5jc3MoIHtcclxuXHRcdCd0cmFuc2l0aW9uLWR1cmF0aW9uJzogJzBzJyxcclxuXHRcdCdoZWlnaHQnOiAnYXV0bycsXHJcblx0XHQncG9zaXRpb24nOiAncmVsYXRpdmUnLFxyXG5cdFx0J292ZXJmbG93JzogJ2luaXRpYWwnXHJcblx0fSApO1xyXG5cclxuXHRmb3IgKGxldCBpID0gbnVtU2VjdGlvbnM7IGkgPj0gMDsgaS0tKSB7XHJcblx0XHRsZXQgJHRoaXNTZWN0aW9uID0gJGNvbnRyb2xTZWN0aW9ucy5lcSggaSApO1xyXG5cdFx0bGV0ICR0aGlzQW5pbWF0ZWRFbCA9ICR0aGlzU2VjdGlvbi5maW5kKCAnZmllbGRzZXQnICk7XHJcblx0XHQkdGhpc0FuaW1hdGVkRWwuY3NzKCB7XHJcblx0XHRcdCd0cmFuc2l0aW9uLWR1cmF0aW9uJzogJzBzJyxcclxuXHRcdFx0J2hlaWdodCc6ICdhdXRvJ1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGxldCBnZXRIZWlnaHQgPSAgJHRoaXNBbmltYXRlZEVsLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0JHRoaXNBbmltYXRlZEVsLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcclxuXHJcblx0XHQkdGhpc1NlY3Rpb24uYXR0cignZGF0YS1vcGVuLWhlaWdodCcsIGdldEhlaWdodCApO1xyXG5cdH1cclxuXHJcblx0JGNvbnRyb2xTZWN0aW9ucy5yZW1vdmVDbGFzcyggJy5pcy1hY3RpdmUnICk7XHJcblx0JGNvbnRyb2xQYWdlcy5yZW1vdmVDbGFzcyggJy5pcy1hY3RpdmUnICk7XHJcblx0JGNvbnRyb2xQYWdlcy5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XHJcblxyXG5cclxuXHQkKCAnLmpzLXNlY3Rpb24tdG9nZ2xlJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG5cdFx0bGV0ICRwYXJlbnQgPSAkKCB0aGlzICkuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9fc2VjdGlvbicgKTtcclxuXHRcdGxldCBwYXJlbnRBY3RpdmUgPSAkcGFyZW50Lmhhc0NsYXNzKCAnaXMtYWN0aXZlJyApID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0bGV0IHRoaXNIZWlnaHQgPSAkcGFyZW50LmF0dHIoICdkYXRhLW9wZW4taGVpZ2h0JyApO1xyXG5cdFx0aWYgKCBwYXJlbnRBY3RpdmUgKSB7XHJcblx0XHRcdCRwYXJlbnQucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICkuZmluZCggJ2ZpZWxkc2V0JyApLmNzcygge1xyXG5cdFx0XHRcdCdoZWlnaHQnOiAnMCdcclxuXHRcdFx0fSApIDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRwYXJlbnQuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICkuZmluZCggJ2ZpZWxkc2V0JyApLmNzcygge1xyXG5cdFx0XHRcdCdoZWlnaHQnOiB0aGlzSGVpZ2h0KydweCdcclxuXHRcdFx0fSApO1xyXG5cdFx0fVxyXG5cclxuXHR9ICk7XHJcblxyXG5cclxuXHQkKCAnLmJ1dHRvbi1saXN0IGJ1dHRvbicgKS5jbGljayggZnVuY3Rpb24oIGUgKXtcclxuXHRcdGxldCAkZWwgPSAkKCB0aGlzICk7XHJcblx0XHRsZXQgJHNpYmxpbmdzID0gJGVsLmNsb3Nlc3QoICcuYnV0dG9uLWxpc3QnICkuZmluZCggJ2J1dHRvbicgKTtcclxuXHRcdGxldCBpc0FjdGl2ZSA9ICRlbC5oYXNDbGFzcyggJ2lzLWFjdGl2ZScgKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcblx0XHRpZiAoIGlzQWN0aXZlICkge1xyXG5cdFx0XHQkZWwucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkc2libGluZ3MucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0XHRcdCRlbC5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHQvLyBnZXQgY3VycmVudCBzZWxlY3RlZCBhbmltYXRpb24gc3BlZWRcclxuXHQvLyBsZXQgaW5pdFNwZWVkVmFsID0gJCggJy5qcy1zcGVlZC1saXN0IGJ1dHRvbi5zZWxlY3RlZCcpLmF0dHIoICdkYXRhLWFuaW0tc3BlZWQnICk7XHJcblx0Ly8gY29uc29sZS5sb2coICdpbml0U3BlZWRWYWw6ICcsIGluaXRTcGVlZFZhbCApO1xyXG5cdC8vICQoICcuanMtY3VzdG9tLWFuaW0tc3BlZWQtaW5wdXQnICkudmFsKCBpbml0U3BlZWRWYWwgKTtcclxuXHJcblx0Ly8gJCggJy5qcy1jdXN0b20tYW5pbS1zcGVlZC1pbnB1dCcgKS5vbiggJ2JsdXInLCBmdW5jdGlvbiggZSkge1xyXG5cdC8vIFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHQvLyBcdGxldCAkZWwgPSAkKCB0aGlzICk7XHJcblx0Ly8gXHQvLyBnZXQgbWluL21heCB2YWx1ZVxyXG5cdC8vIFx0bGV0IG1heFZhbCA9ICRlbC5hdHRyKCAnbWF4JyApO1xyXG5cdC8vIFx0bGV0IG1pblZhbCA9ICRlbC5hdHRyKCAnbWluJyApO1xyXG5cdFx0Ly8gZ2V0IHZhbHVlXHJcblx0Ly8gXHRsZXQgdmFsdWUgPSAkZWwudmFsKCk7XHJcblxyXG5cdC8vIFx0aWYgKCB2YWx1ZSA+IG1heFZhbCApIHtcclxuXHQvLyBcdFx0JGVsLnZhbCggbWF4VmFsICk7XHJcblx0Ly8gXHR9IGVsc2Uge1xyXG5cdC8vIFx0XHRpZiAoIHZhbHVlIDwgbWluVmFsICkge1xyXG5cdC8vIFx0XHRcdCRlbC52YWwoIG1pblZhbCApO1xyXG5cdC8vIFx0XHR9IGVsc2Uge1xyXG5cdC8vIFx0XHRcdCRlbC52YWwoIHBhcnNlRmxvYXQoIHZhbHVlICkudG9GaXhlZCggMSApICk7XHJcblx0Ly8gXHRcdH1cclxuXHQvLyBcdH1cclxuXHQvLyB9ICk7XHJcblxyXG5cclxuXHQvLyAkKCAnLmpzLWFuaW0tc3BlZWQnICkuY2xpY2soIGZ1bmN0aW9uKCBlICkge1xyXG5cdC8vIFx0Ly8gZ2V0IGVsZW1lbnRcclxuXHQvLyBcdGxldCAkZWwgPSAkKCB0aGlzICk7XHJcblx0Ly8gXHQvLyBnZXQgdmFsdWVcclxuXHQvLyBcdGxldCB2YWx1ZSA9ICRlbC5hdHRyKCAnZGF0YS1hbmltLXNwZWVkJyApO1xyXG5cclxuXHQvLyBcdCQoICcuanMtY3VzdG9tLWFuaW0tc3BlZWQtaW5wdXQnICkudmFsKCB2YWx1ZSApO1xyXG5cdC8vIFx0JGVsLm9mZigpO1xyXG5cclxuXHQvLyB9ICk7XHJcblxyXG5cclxuXHQvLyBzbGlkZXIgY29udHJvbHMgZm9yIGluZGl2aWR1YWwgZmFjaWFsIGZlYXR1cmVzXHJcblx0JCggJy5wYWdlLWVsZW1lbnRzIC5yYW5nZS1zbGlkZXInICkub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0Y29uc29sZS5sb2coICdzbGlkZXIgcHJvY2Vzc2luZyBpcyBmaXJpbmcnICk7XHJcblx0XHQvLyBnZXQgZWxlbWVudFxyXG5cdFx0bGV0ICRlbCA9ICQoIHRoaXMgKTtcclxuXHRcdC8vIGdldCBvdXRwdXQgZWxcclxuXHRcdGxldCAkb3V0cHV0RWwgPSAkZWwuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKS5maW5kKCAnb3V0cHV0JyApO1xyXG5cdFx0Ly8gZ2V0IG1pbi9tYXggdmFsdWVcclxuXHRcdGxldCBtYXhWYWwgPSAkZWwuYXR0ciggJ21heCcgKTtcclxuXHRcdGxldCBtaW5WYWwgPSAkZWwuYXR0ciggJ21pbicgKTtcclxuXHRcdC8vIGdldCB2YWx1ZVxyXG5cdFx0bGV0IHZhbHVlID0gJGVsLnZhbCgpO1xyXG5cdFx0bGV0IG91dHB1dCA9IDA7XHJcblxyXG5cdFx0aWYgKCBtaW5WYWwgPCAwICkge1xyXG5cdFx0XHR2YWx1ZSA8IDAgPyBvdXRwdXQgPSB2YWx1ZSAvIG1pblZhbCA6IG91dHB1dCA9ICggdmFsdWUgLyBtYXhWYWwgKSAqIC0xO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0b3V0cHV0ID0gdmFsdWUgLyBtYXhWYWw7XHJcblx0XHR9XHJcblxyXG5cdFx0JG91dHB1dEVsLmh0bWwoIHBhcnNlRmxvYXQoIG91dHB1dCApLnRvRml4ZWQoIDIgKSApO1xyXG5cdH0gKTtcclxuXHJcblxyXG5cdC8vIHNsaWRlciBjb250cm9scyBmb3IgZ2xhcmUgc3Bpa2VzXHJcblx0JCggJy5qcy1nbGFyZS1zcGlrZS1lZmZlY3RzIC5yYW5nZS1zbGlkZXInICkub24oICdpbnB1dCcsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0Y29uc29sZS5sb2coICdzbGlkZXIgcHJvY2Vzc2luZyBpcyBmaXJpbmcnICk7XHJcblx0XHQvLyBnZXQgZWxlbWVudFxyXG5cdFx0bGV0ICRlbCA9ICQoIHRoaXMgKTtcclxuXHRcdC8vIFx0Ly8gZ2V0IG91dHB1dCBlbFxyXG5cdFx0bGV0ICRvdXRwdXRFbCA9ICRlbC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApLmZpbmQoICdvdXRwdXQnICk7XHJcblx0XHQvLyBnZXQgdmFsdWVcclxuXHRcdGxldCB2YWx1ZSA9ICRlbC52YWwoKTtcclxuXHRcdC8vIGZsaXAgdmFsdWUgaWYgcmFuZ2UgaXMgZmxpcHBlZCAoZGlzcGxheSBwdXJwb3NlcyBvbmx5KVxyXG5cdFx0JG91dHB1dEVsLmh0bWwoIHBhcnNlRmxvYXQoIHZhbHVlICkudG9GaXhlZCggMiApICk7XHJcblx0fSApO1xyXG5cclxuXHJcblxyXG5cdCQoICcuanMtZGlzcGxheS1jb250cm9scyBidXR0b24nICkuY2xpY2soIGZ1bmN0aW9uKCBlICl7XHJcblx0XHR2YXIgJGVsID0gJCggdGhpcyApO1xyXG5cdFx0dmFyICRzaWJsaW5ncyA9ICRlbC5zaWJsaW5ncygpO1xyXG5cdFx0dmFyIGlzQWN0aXZlID0gJGVsLmhhc0NsYXNzKCAnaXMtYWN0aXZlJyApID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuXHRcdHZhciB0aGlzRGlzcGxheUl0ZW0gPSAkZWwuZGF0YSggJ2Rpc3BsYXktaXRlbScgKTtcclxuXHJcblx0XHRpZiAoIGlzQWN0aXZlICkge1xyXG5cdFx0XHQkZWwucmVtb3ZlQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0XHRcdG92ZXJsYXlDZmdbIHRoaXNEaXNwbGF5SXRlbSBdID0gZmFsc2U7XHJcblxyXG5cdFx0XHRpZiAoICEkc2libGluZ3MuaGFzQ2xhc3MoICdpcy1hY3RpdmUnICkgKSB7XHJcblx0XHRcdFx0b3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCRlbC5hZGRDbGFzcyggJ2lzLWFjdGl2ZScgKTtcclxuXHJcblx0XHRcdGlmICggIW92ZXJsYXlDZmcuZGlzcGxheU92ZXJsYXkgKSB7XHJcblx0XHRcdFx0b3ZlcmxheUNmZy5kaXNwbGF5T3ZlcmxheSA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG92ZXJsYXlDZmdbIHRoaXNEaXNwbGF5SXRlbSBdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHRoaXNEaXNwbGF5SXRlbSA9PT0gJ2Rpc3BsYXlHbGFyZVNwaWtlcycgKSB7XHJcblx0XHRcdHN1blNwaWtlcy5jbGVhclJlbmRlckN0eCgpO1xyXG5cdFx0XHRzdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXMoKTtcclxuXHRcdH1cclxuXHJcblx0fSApO1xyXG5cclxuXHJcbn0gKTtcclxuIiwidmFyIG1hdGhVdGlscyA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzO1xyXG5cclxudmFyIGxhc3RDYWxsZWRUaW1lID0gdm9pZCAwO1xyXG5cclxudmFyIGRlYnVnID0ge1xyXG5cclxuICAgIGhlbHBlcnM6IHtcclxuICAgICAgICBnZXRTdHlsZTogZnVuY3Rpb24gZ2V0U3R5bGUoZWxlbWVudCwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSkgOiBlbGVtZW50LnN0eWxlW3Byb3BlcnR5LnJlcGxhY2UoLy0oW2Etel0pL2csIGZ1bmN0aW9uIChnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ1sxXS50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAgICAgICB9KV07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbnZlcnRDb2xvcjogZnVuY3Rpb24gaW52ZXJ0Q29sb3IoaGV4LCBidykge1xyXG4gICAgICAgICAgICBpZiAoaGV4LmluZGV4T2YoJyMnKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaGV4ID0gaGV4LnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnZlcnQgMy1kaWdpdCBoZXggdG8gNi1kaWdpdHMuXHJcbiAgICAgICAgICAgIGlmIChoZXgubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICBoZXggPSBoZXhbMF0gKyBoZXhbMF0gKyBoZXhbMV0gKyBoZXhbMV0gKyBoZXhbMl0gKyBoZXhbMl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhleC5sZW5ndGggIT09IDYpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBIRVggY29sb3IuJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHIgPSBwYXJzZUludChoZXguc2xpY2UoMCwgMiksIDE2KSxcclxuICAgICAgICAgICAgICAgIGcgPSBwYXJzZUludChoZXguc2xpY2UoMiwgNCksIDE2KSxcclxuICAgICAgICAgICAgICAgIGIgPSBwYXJzZUludChoZXguc2xpY2UoNCwgNiksIDE2KTtcclxuICAgICAgICAgICAgaWYgKGJ3KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8zOTQzMDIzLzExMjczMVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHIgKiAwLjI5OSArIGcgKiAwLjU4NyArIGIgKiAwLjExNCA+IDE4NiA/ICcjMDAwMDAwJyA6ICcjRkZGRkZGJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbnZlcnQgY29sb3IgY29tcG9uZW50c1xyXG4gICAgICAgICAgICByID0gKDI1NSAtIHIpLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgZyA9ICgyNTUgLSBnKS50b1N0cmluZygxNik7XHJcbiAgICAgICAgICAgIGIgPSAoMjU1IC0gYikudG9TdHJpbmcoMTYpO1xyXG4gICAgICAgICAgICAvLyBwYWQgZWFjaCB3aXRoIHplcm9zIGFuZCByZXR1cm5cclxuICAgICAgICAgICAgcmV0dXJuIFwiI1wiICsgcGFkWmVybyhyKSArIHBhZFplcm8oZykgKyBwYWRaZXJvKGIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGRpc3BsYXk6IGZ1bmN0aW9uIGRpc3BsYXkoZGlzcGxheUZsYWcsIG1lc3NhZ2UsIHBhcmFtKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGlmIChzZWxmLmFsbCA9PT0gdHJ1ZSB8fCBkaXNwbGF5RmxhZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtZXNzYWdlLCBwYXJhbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBkZWJ1Z091dHB1dDogZnVuY3Rpb24gZGVidWdPdXRwdXQoY2FudmFzLCBjb250ZXh0LCBsYWJlbCwgcGFyYW0sIG91dHB1dE51bSwgb3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgO1xyXG5cclxuICAgICAgICBpZiAob3V0cHV0Qm91bmRzKSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzUmVkID0gbWF0aFV0aWxzLm1hcChwYXJhbSwgb3V0cHV0Qm91bmRzLm1pbiwgb3V0cHV0Qm91bmRzLm1heCwgMjU1LCAwLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIHRoaXNHcmVlbiA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIC8vIHZhciB0aGlzQmx1ZSA9IG1hdGhVdGlscy5tYXAocGFyYW0sIG91dHB1dEJvdW5kcy5taW4sIG91dHB1dEJvdW5kcy5tYXgsIDAsIDI1NSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSAncmdiKCAnICsgdGhpc1JlZCArICcsICcgKyB0aGlzR3JlZW4gKyAnLCAwICknO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdjaGFuZ2luZyBkZWJ1ZyBjb2xvciBvZjogJytwYXJhbSsnIHRvOiAnK3RoaXNDb2xvciApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0aGlzQ29sb3IgPSBcIiNlZmVmZWZcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB2UG9zID0gb3V0cHV0TnVtICogNTAgKyA1MDtcclxuICAgICAgICBjb250ZXh0LnRleHRBbGlnbiA9IFwibGVmdFwiO1xyXG4gICAgICAgIGNvbnRleHQuZm9udCA9IFwiMTRwdCBhcmlhbFwiO1xyXG4gICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpc0NvbG9yO1xyXG5cclxuICAgICAgICBjb250ZXh0LmZpbGxUZXh0KGxhYmVsICsgcGFyYW0sIDUwLCB2UG9zKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2FsY3VsYXRlRnBzOiBmdW5jdGlvbiBjYWxjdWxhdGVGcHMoKSB7XHJcbiAgICAgICAgaWYgKCFsYXN0Q2FsbGVkVGltZSkge1xyXG4gICAgICAgICAgICBsYXN0Q2FsbGVkVGltZSA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBkZWx0YSA9ICh3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgLSBsYXN0Q2FsbGVkVGltZSkgLyAxMDAwO1xyXG4gICAgICAgIGxhc3RDYWxsZWRUaW1lID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHJldHVybiAxIC8gZGVsdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIGZsYWdzOiB7XHJcbiAgICAgICAgYWxsOiBmYWxzZSxcclxuICAgICAgICBwYXJ0czoge1xyXG4gICAgICAgICAgICBjbGlja3M6IHRydWUsXHJcbiAgICAgICAgICAgIHJ1bnRpbWU6IHRydWUsXHJcbiAgICAgICAgICAgIHVwZGF0ZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGtpbGxDb25kaXRpb25zOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uQ291bnRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIGVudGl0eVN0b3JlOiBmYWxzZSxcclxuICAgICAgICAgICAgZnBzOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVidWcgPSBkZWJ1ZztcclxubW9kdWxlLmV4cG9ydHMubGFzdENhbGxlZFRpbWUgPSBsYXN0Q2FsbGVkVGltZTsiLCIvKlxyXG4gKiBUaGlzIGlzIGEgbmVhci1kaXJlY3QgcG9ydCBvZiBSb2JlcnQgUGVubmVyJ3MgZWFzaW5nIGVxdWF0aW9ucy4gUGxlYXNlIHNob3dlciBSb2JlcnQgd2l0aFxyXG4gKiBwcmFpc2UgYW5kIGFsbCBvZiB5b3VyIGFkbWlyYXRpb24uIEhpcyBsaWNlbnNlIGlzIHByb3ZpZGVkIGJlbG93LlxyXG4gKlxyXG4gKiBGb3IgaW5mb3JtYXRpb24gb24gaG93IHRvIHVzZSB0aGVzZSBmdW5jdGlvbnMgaW4geW91ciBhbmltYXRpb25zLCBjaGVjayBvdXQgbXkgZm9sbG93aW5nIHR1dG9yaWFsOiBcclxuICogaHR0cDovL2JpdC5seS8xOGlISEtxXHJcbiAqXHJcbiAqIC1LaXJ1cGFcclxuICovXHJcblxyXG4vKlxyXG4gKlxyXG4gKiBURVJNUyBPRiBVU0UgLSBFQVNJTkcgRVFVQVRJT05TXHJcbiAqIFxyXG4gKiBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuIFxyXG4gKiBcclxuICogQ29weXJpZ2h0IMKpIDIwMDEgUm9iZXJ0IFBlbm5lclxyXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiBcclxuICogUmVkaXN0cmlidXRpb24gYW5kIHVzZSBpbiBzb3VyY2UgYW5kIGJpbmFyeSBmb3Jtcywgd2l0aCBvciB3aXRob3V0IG1vZGlmaWNhdGlvbiwgXHJcbiAqIGFyZSBwZXJtaXR0ZWQgcHJvdmlkZWQgdGhhdCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnMgYXJlIG1ldDpcclxuICogXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBvZiBzb3VyY2UgY29kZSBtdXN0IHJldGFpbiB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IG9mIFxyXG4gKiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIuXHJcbiAqIFJlZGlzdHJpYnV0aW9ucyBpbiBiaW5hcnkgZm9ybSBtdXN0IHJlcHJvZHVjZSB0aGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSwgdGhpcyBsaXN0IFxyXG4gKiBvZiBjb25kaXRpb25zIGFuZCB0aGUgZm9sbG93aW5nIGRpc2NsYWltZXIgaW4gdGhlIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBcclxuICogcHJvdmlkZWQgd2l0aCB0aGUgZGlzdHJpYnV0aW9uLlxyXG4gKiBcclxuICogTmVpdGhlciB0aGUgbmFtZSBvZiB0aGUgYXV0aG9yIG5vciB0aGUgbmFtZXMgb2YgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2UgXHJcbiAqIG9yIHByb21vdGUgcHJvZHVjdHMgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXHJcbiAqIFxyXG4gKiBUSElTIFNPRlRXQVJFIElTIFBST1ZJREVEIEJZIFRIRSBDT1BZUklHSFQgSE9MREVSUyBBTkQgQ09OVFJJQlVUT1JTIFwiQVMgSVNcIiBBTkQgQU5ZIFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQgV0FSUkFOVElFUywgSU5DTFVESU5HLCBCVVQgTk9UIExJTUlURUQgVE8sIFRIRSBJTVBMSUVEIFdBUlJBTlRJRVMgT0ZcclxuICogTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkUgRElTQ0xBSU1FRC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiAqIENPUFlSSUdIVCBPV05FUiBPUiBDT05UUklCVVRPUlMgQkUgTElBQkxFIEZPUiBBTlkgRElSRUNULCBJTkRJUkVDVCwgSU5DSURFTlRBTCwgU1BFQ0lBTCxcclxuICogRVhFTVBMQVJZLCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFXHJcbiAqIEdPT0RTIE9SIFNFUlZJQ0VTOyBMT1NTIE9GIFVTRSwgREFUQSwgT1IgUFJPRklUUzsgT1IgQlVTSU5FU1MgSU5URVJSVVBUSU9OKSBIT1dFVkVSIENBVVNFRCBcclxuICogQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBXSEVUSEVSIElOIENPTlRSQUNULCBTVFJJQ1QgTElBQklMSVRZLCBPUiBUT1JUIChJTkNMVURJTkdcclxuICogTkVHTElHRU5DRSBPUiBPVEhFUldJU0UpIEFSSVNJTkcgSU4gQU5ZIFdBWSBPVVQgT0YgVEhFIFVTRSBPRiBUSElTIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgXHJcbiAqIE9GIFRIRSBQT1NTSUJJTElUWSBPRiBTVUNIIERBTUFHRS4gXHJcbiAqXHJcbiAqL1xyXG5cclxudmFyIGVhc2luZ0VxdWF0aW9ucyA9IHtcclxuXHQvKipcclxuICogcHJvdmlkZXMgZWFzaW5nIHV0aWwgbWV0aG9kcy5cclxuICovXHJcblx0bGluZWFyRWFzZTogZnVuY3Rpb24gbGluZWFyRWFzZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluUXVhZDogZnVuY3Rpb24gZWFzZUluUXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zKSAqIGN1cnJlbnRJdGVyYXRpb24gKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFkOiBmdW5jdGlvbiBlYXNlT3V0UXVhZChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAqIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFkOiBmdW5jdGlvbiBlYXNlSW5PdXRRdWFkKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBjdXJyZW50SXRlcmF0aW9uICogY3VycmVudEl0ZXJhdGlvbiArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gLWNoYW5nZUluVmFsdWUgLyAyICogKC0tY3VycmVudEl0ZXJhdGlvbiAqIChjdXJyZW50SXRlcmF0aW9uIC0gMikgLSAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ3ViaWM6IGZ1bmN0aW9uIGVhc2VJbkN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEN1YmljOiBmdW5jdGlvbiBlYXNlT3V0Q3ViaWMoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqIChNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSwgMykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0Q3ViaWM6IGZ1bmN0aW9uIGVhc2VJbk91dEN1YmljKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiBNYXRoLnBvdyhjdXJyZW50SXRlcmF0aW9uLCAzKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDMpICsgMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1YXJ0OiBmdW5jdGlvbiBlYXNlSW5RdWFydChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNCkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWFydDogZnVuY3Rpb24gZWFzZU91dFF1YXJ0KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIC1jaGFuZ2VJblZhbHVlICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxLCA0KSAtIDEpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRRdWFydDogZnVuY3Rpb24gZWFzZUluT3V0UXVhcnQoY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRpZiAoKGN1cnJlbnRJdGVyYXRpb24gLz0gdG90YWxJdGVyYXRpb25zIC8gMikgPCAxKSB7XHJcblx0XHRcdHJldHVybiBjaGFuZ2VJblZhbHVlIC8gMiAqIE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24sIDQpICsgc3RhcnRWYWx1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAtY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAtIDIsIDQpIC0gMikgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJblF1aW50OiBmdW5jdGlvbiBlYXNlSW5RdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucywgNSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRRdWludDogZnVuY3Rpb24gZWFzZU91dFF1aW50KGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAtIDEsIDUpICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dFF1aW50OiBmdW5jdGlvbiBlYXNlSW5PdXRRdWludChjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coY3VycmVudEl0ZXJhdGlvbiwgNSkgKyBzdGFydFZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKE1hdGgucG93KGN1cnJlbnRJdGVyYXRpb24gLSAyLCA1KSArIDIpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5TaW5lOiBmdW5jdGlvbiBlYXNlSW5TaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiAoMSAtIE1hdGguY29zKGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgKiAoTWF0aC5QSSAvIDIpKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRTaW5lOiBmdW5jdGlvbiBlYXNlT3V0U2luZShjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zaW4oY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucyAqIChNYXRoLlBJIC8gMikpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRTaW5lOiBmdW5jdGlvbiBlYXNlSW5PdXRTaW5lKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogKDEgLSBNYXRoLmNvcyhNYXRoLlBJICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5FeHBvOiBmdW5jdGlvbiBlYXNlSW5FeHBvKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgKiBNYXRoLnBvdygyLCAxMCAqIChjdXJyZW50SXRlcmF0aW9uIC8gdG90YWxJdGVyYXRpb25zIC0gMSkpICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlT3V0RXhwbzogZnVuY3Rpb24gZWFzZU91dEV4cG8oY3VycmVudEl0ZXJhdGlvbiwgc3RhcnRWYWx1ZSwgY2hhbmdlSW5WYWx1ZSwgdG90YWxJdGVyYXRpb25zKSB7XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAqICgtTWF0aC5wb3coMiwgLTEwICogY3VycmVudEl0ZXJhdGlvbiAvIHRvdGFsSXRlcmF0aW9ucykgKyAxKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0RXhwbzogZnVuY3Rpb24gZWFzZUluT3V0RXhwbyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdGlmICgoY3VycmVudEl0ZXJhdGlvbiAvPSB0b3RhbEl0ZXJhdGlvbnMgLyAyKSA8IDEpIHtcclxuXHRcdFx0cmV0dXJuIGNoYW5nZUluVmFsdWUgLyAyICogTWF0aC5wb3coMiwgMTAgKiAoY3VycmVudEl0ZXJhdGlvbiAtIDEpKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoLU1hdGgucG93KDIsIC0xMCAqIC0tY3VycmVudEl0ZXJhdGlvbikgKyAyKSArIHN0YXJ0VmFsdWU7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQ2lyYzogZnVuY3Rpb24gZWFzZUluQ2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogKDEgLSBNYXRoLnNxcnQoMSAtIChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucykgKiBjdXJyZW50SXRlcmF0aW9uKSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VPdXRDaXJjOiBmdW5jdGlvbiBlYXNlT3V0Q2lyYyhjdXJyZW50SXRlcmF0aW9uLCBzdGFydFZhbHVlLCBjaGFuZ2VJblZhbHVlLCB0b3RhbEl0ZXJhdGlvbnMpIHtcclxuXHRcdHJldHVybiBjaGFuZ2VJblZhbHVlICogTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiA9IGN1cnJlbnRJdGVyYXRpb24gLyB0b3RhbEl0ZXJhdGlvbnMgLSAxKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgc3RhcnRWYWx1ZTtcclxuXHR9LFxyXG5cclxuXHRlYXNlSW5PdXRDaXJjOiBmdW5jdGlvbiBlYXNlSW5PdXRDaXJjKGN1cnJlbnRJdGVyYXRpb24sIHN0YXJ0VmFsdWUsIGNoYW5nZUluVmFsdWUsIHRvdGFsSXRlcmF0aW9ucykge1xyXG5cdFx0aWYgKChjdXJyZW50SXRlcmF0aW9uIC89IHRvdGFsSXRlcmF0aW9ucyAvIDIpIDwgMSkge1xyXG5cdFx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoMSAtIE1hdGguc3FydCgxIC0gY3VycmVudEl0ZXJhdGlvbiAqIGN1cnJlbnRJdGVyYXRpb24pKSArIHN0YXJ0VmFsdWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY2hhbmdlSW5WYWx1ZSAvIDIgKiAoTWF0aC5zcXJ0KDEgLSAoY3VycmVudEl0ZXJhdGlvbiAtPSAyKSAqIGN1cnJlbnRJdGVyYXRpb24pICsgMSkgKyBzdGFydFZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbkVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbkVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiAtKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XHJcblx0fSxcclxuXHRlYXNlT3V0RWxhc3RpYzogZnVuY3Rpb24gZWFzZU91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCkgPT0gMSkgcmV0dXJuIGIgKyBjO2lmICghcCkgcCA9IGQgKiAuMztcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdHJldHVybiBhICogTWF0aC5wb3coMiwgLTEwICogdCkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSArIGMgKyBiO1xyXG5cdH0sXHJcblxyXG5cdGVhc2VJbk91dEVsYXN0aWM6IGZ1bmN0aW9uIGVhc2VJbk91dEVsYXN0aWModCwgYiwgYywgZCkge1xyXG5cdFx0dmFyIHMgPSAxLjcwMTU4O3ZhciBwID0gMDt2YXIgYSA9IGM7XHJcblx0XHRpZiAodCA9PSAwKSByZXR1cm4gYjtpZiAoKHQgLz0gZCAvIDIpID09IDIpIHJldHVybiBiICsgYztpZiAoIXApIHAgPSBkICogKC4zICogMS41KTtcclxuXHRcdGlmIChhIDwgTWF0aC5hYnMoYykpIHtcclxuXHRcdFx0YSA9IGM7dmFyIHMgPSBwIC8gNDtcclxuXHRcdH0gZWxzZSB2YXIgcyA9IHAgLyAoMiAqIE1hdGguUEkpICogTWF0aC5hc2luKGMgLyBhKTtcclxuXHRcdGlmICh0IDwgMSkgcmV0dXJuIC0uNSAqIChhICogTWF0aC5wb3coMiwgMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSkgKyBiO1xyXG5cdFx0cmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIC41ICsgYyArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluQmFjazogZnVuY3Rpb24gZWFzZUluQmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0cmV0dXJuIGMgKiAodCAvPSBkKSAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZU91dEJhY2s6IGZ1bmN0aW9uIGVhc2VPdXRCYWNrKHQsIGIsIGMsIGQsIHMpIHtcclxuXHRcdGlmIChzID09IHVuZGVmaW5lZCkgcyA9IDEuNzAxNTg7XHJcblx0XHRyZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XHJcblx0fSxcclxuXHJcblx0ZWFzZUluT3V0QmFjazogZnVuY3Rpb24gZWFzZUluT3V0QmFjayh0LCBiLCBjLCBkLCBzKSB7XHJcblx0XHRpZiAocyA9PSB1bmRlZmluZWQpIHMgPSAxLjcwMTU4O1xyXG5cdFx0aWYgKCh0IC89IGQgLyAyKSA8IDEpIHJldHVybiBjIC8gMiAqICh0ICogdCAqICgoKHMgKj0gMS41MjUpICsgMSkgKiB0IC0gcykpICsgYjtcclxuXHRcdHJldHVybiBjIC8gMiAqICgodCAtPSAyKSAqIHQgKiAoKChzICo9IDEuNTI1KSArIDEpICogdCArIHMpICsgMikgKyBiO1xyXG5cdH0sXHJcblxyXG5cdC8vIGVhc2VJbkJvdW5jZTogZnVuY3Rpb24odCwgYiwgYywgZCkge1xyXG5cdC8vICAgICByZXR1cm4gYyAtIGVhc2VPdXRCb3VuY2UoZC10LCAwLCBjLCBkKSArIGI7XHJcblx0Ly8gfSxcclxuXHJcblx0ZWFzZU91dEJvdW5jZTogZnVuY3Rpb24gZWFzZU91dEJvdW5jZSh0LCBiLCBjLCBkKSB7XHJcblx0XHRpZiAoKHQgLz0gZCkgPCAxIC8gMi43NSkge1xyXG5cdFx0XHRyZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xyXG5cdFx0fSBlbHNlIGlmICh0IDwgMiAvIDIuNzUpIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMS41IC8gMi43NSkgKiB0ICsgLjc1KSArIGI7XHJcblx0XHR9IGVsc2UgaWYgKHQgPCAyLjUgLyAyLjc1KSB7XHJcblx0XHRcdHJldHVybiBjICogKDcuNTYyNSAqICh0IC09IDIuMjUgLyAyLjc1KSAqIHQgKyAuOTM3NSkgKyBiO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGMgKiAoNy41NjI1ICogKHQgLT0gMi42MjUgLyAyLjc1KSAqIHQgKyAuOTg0Mzc1KSArIGI7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBlYXNlSW5PdXRCb3VuY2U6IGZ1bmN0aW9uKHQsIGIsIGMsIGQpIHtcclxuXHQvLyAgICAgaWYgKHQgPCBkLzIpIHJldHVybiB0aGlzLmVhc2VJbkJvdW5jZSh0KjIsIDAsIGMsIGQpICogLjUgKyBiO1xyXG5cdC8vICAgICByZXR1cm4gdGhpcy5lYXNlT3V0Qm91bmNlKHQqMi1kLCAwLCBjLCBkKSAqIC41ICsgYyouNSArIGI7XHJcblx0Ly8gfVxyXG59O1xyXG5cclxuZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSA9IGZ1bmN0aW9uICh0LCBiLCBjLCBkKSB7XHJcblx0cmV0dXJuIGMgLSBlYXNpbmdFcXVhdGlvbnMuZWFzZU91dEJvdW5jZShkIC0gdCwgMCwgYywgZCkgKyBiO1xyXG59LCBlYXNpbmdFcXVhdGlvbnMuZWFzZUluT3V0Qm91bmNlID0gZnVuY3Rpb24gKHQsIGIsIGMsIGQpIHtcclxuXHRpZiAodCA8IGQgLyAyKSByZXR1cm4gZWFzaW5nRXF1YXRpb25zLmVhc2VJbkJvdW5jZSh0ICogMiwgMCwgYywgZCkgKiAuNSArIGI7XHJcblx0cmV0dXJuIGVhc2luZ0VxdWF0aW9ucy5lYXNlT3V0Qm91bmNlKHQgKiAyIC0gZCwgMCwgYywgZCkgKiAuNSArIGMgKiAuNSArIGI7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5lYXNpbmdFcXVhdGlvbnMgPSBlYXNpbmdFcXVhdGlvbnM7IiwicmVxdWlyZSggJy4vYXBwLmpzJyApO1xyXG5yZXF1aXJlKCAnLi9jb250cm9sUGFuZWwuanMnICk7XHJcbnJlcXVpcmUoICcuL2V4cG9ydE92ZXJsYXkuanMnICk7IiwidmFyIGVudmlyb25tZW50ID0ge1xyXG5cclxuXHRcdHJ1bnRpbWVFbmdpbmU6IHtcclxuXHJcblx0XHRcdFx0c3RhcnRBbmltYXRpb246IGZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9uKGFuaW1WYXIsIGxvb3BGbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIWFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3BGbik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cclxuXHRcdFx0XHRzdG9wQW5pbWF0aW9uOiBmdW5jdGlvbiBzdG9wQW5pbWF0aW9uKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGFuaW1WYXIpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShhbmltVmFyKTtcclxuXHRcdFx0XHRcdFx0XHRcdGFuaW1WYXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjYW52YXM6IHtcclxuXHRcdFx0XHQvLyBidWZmZXIgY2xlYXIgZk5cclxuXHRcdFx0XHRjaGVja0NsZWFyQnVmZmVyUmVnaW9uOiBmdW5jdGlvbiBjaGVja0NsZWFyQnVmZmVyUmVnaW9uKHBhcnRpY2xlLCBjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBlbnRpdHlXaWR0aCA9IHBhcnRpY2xlLnIgLyAyO1xyXG5cdFx0XHRcdFx0XHR2YXIgZW50aXR5SGVpZ2h0ID0gcGFydGljbGUuciAvIDI7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAocGFydGljbGUueCAtIGVudGl0eVdpZHRoIDwgYnVmZmVyQ2xlYXJSZWdpb24ueCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueCA9IHBhcnRpY2xlLnggLSBlbnRpdHlXaWR0aDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnggKyBlbnRpdHlXaWR0aCA+IGJ1ZmZlckNsZWFyUmVnaW9uLnggKyBidWZmZXJDbGVhclJlZ2lvbi53KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gcGFydGljbGUueCArIGVudGl0eVdpZHRoIC0gYnVmZmVyQ2xlYXJSZWdpb24ueDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgLSBlbnRpdHlIZWlnaHQgPCBidWZmZXJDbGVhclJlZ2lvbi55KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi55ID0gcGFydGljbGUueSAtIGVudGl0eUhlaWdodDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgPiBidWZmZXJDbGVhclJlZ2lvbi55ICsgYnVmZmVyQ2xlYXJSZWdpb24uaCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24uaCA9IHBhcnRpY2xlLnkgKyBlbnRpdHlIZWlnaHQgLSBidWZmZXJDbGVhclJlZ2lvbi55O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0cmVzZXRCdWZmZXJDbGVhclJlZ2lvbjogZnVuY3Rpb24gcmVzZXRCdWZmZXJDbGVhclJlZ2lvbihjYW52YXNDb25maWcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBidWZmZXJDbGVhclJlZ2lvbiA9IGNhbnZhc0NvbmZpZy5idWZmZXJDbGVhclJlZ2lvbjtcclxuXHJcblx0XHRcdFx0XHRcdGJ1ZmZlckNsZWFyUmVnaW9uLnggPSBjYW52YXNDb25maWcuY2VudGVySDtcclxuXHRcdFx0XHRcdFx0YnVmZmVyQ2xlYXJSZWdpb24ueSA9IGNhbnZhc0NvbmZpZy5jZW50ZXJWO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi53ID0gY2FudmFzQ29uZmlnLndpZHRoO1xyXG5cdFx0XHRcdFx0XHRidWZmZXJDbGVhclJlZ2lvbi5oID0gY2FudmFzQ29uZmlnLmhlaWdodDtcclxuXHRcdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZvcmNlczoge1xyXG5cdFx0XHRcdGZyaWN0aW9uOiAwLjAxLFxyXG5cdFx0XHRcdGJvdXlhbmN5OiAxLFxyXG5cdFx0XHRcdGdyYXZpdHk6IDAsXHJcblx0XHRcdFx0d2luZDogMSxcclxuXHRcdFx0XHR0dXJidWxlbmNlOiB7IG1pbjogLTUsIG1heDogNSB9XHJcblx0XHR9XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMuZW52aXJvbm1lbnQgPSBlbnZpcm9ubWVudDsiLCIkKCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpe1xyXG5cclxuXHJcblx0dmFyICRmZWF0dXJlUGFnZVBhcmVudCA9ICQoICdbIGRhdGEtcGFnZT1cInBhZ2UtZWxlbWVudHNcIiBdJyk7XHJcbiAgICB2YXIgJGZlYXR1cmVJbnB1dHMgPSAkZmVhdHVyZVBhZ2VQYXJlbnQuZmluZCggJy5yYW5nZS1zbGlkZXInICk7XHJcbiAgICB2YXIgJGZlYXR1cmVPdXRwdXRzID0gJGZlYXR1cmVQYWdlUGFyZW50LmZpbmQoICdvdXRwdXQnICk7XHJcbiAgICB2YXIgJGZlYXR1cmVJbnB1dHNMZW4gPSAkZmVhdHVyZUlucHV0cy5sZW5ndGg7XHJcblxyXG4gICAgY29uc29sZS5sb2coICd0ZXN0IGlucHV0OiAnLCAkZmVhdHVyZUlucHV0cy5lcSggMiApICk7XHJcblxyXG4gICAgZnVuY3Rpb24gY3JlYXRlRXhwcmVzc2lvblBhcmFtZXRlckV4cG9ydCgpIHtcclxuXHJcbiAgICBcdHZhciBvdXRwdXQgPSAnJztcclxuXHJcbiAgICBcdGZvciAoIHZhciBpID0gMDsgaSA8ICRmZWF0dXJlSW5wdXRzTGVuOyBpKysgKSB7XHJcbiAgICBcdFx0dmFyIHRoaXNJbnB1dCA9ICRmZWF0dXJlSW5wdXRzLmVxKCBpIClbIDAgXTtcclxuICAgIFx0XHR2YXIgJHRoaXNPdXRwdXQgPSBwYXJzZUZsb2F0KCAkZmVhdHVyZU91dHB1dHMuZXEoIGkgKS5odG1sKCkgKS50b0ZpeGVkKCAyICk7XHJcblxyXG4gICAgXHRcdHRoaXNJbnB1dC5pZCA9PT0gJ21vdXRoRWRnZVJpZ2h0JyA/ICR0aGlzT3V0cHV0ID0gJHRoaXNPdXRwdXQgKiAtMSA6IGZhbHNlO1xyXG5cclxuICAgIFx0XHR2YXIgdGVtcEVuZGluZyA9ICcnO1xyXG5cclxuICAgIFx0XHRpZiAoIGkgIT09ICRmZWF0dXJlSW5wdXRzTGVuIC0gMSApIHtcclxuICAgIFx0XHRcdHRlbXBFbmRpbmcgPSAnLCc7XHJcbiAgICBcdFx0fVxyXG5cclxuICAgIFx0XHRvdXRwdXQgPSBgJHsgb3V0cHV0IH1cclxuICAgIFx0XHR7IG5hbWU6IFwiJHsgdGhpc0lucHV0LmlkIH1cIiwgdGFyZ2V0OiBcIiR7ICR0aGlzT3V0cHV0IH1cIiB9JHt0ZW1wRW5kaW5nfWA7XHJcbiAgICBcdH1cclxuXHJcbiAgICBcdG91dHB1dCA9IGBbXHJcbiAgICBcdFx0XHQkeyBvdXRwdXQgfVxyXG4gICAgXHRcdF1gO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyggJ291dHB1dDogJywgb3V0cHV0ICk7XHJcbiAgICBcdHJldHVybiBvdXRwdXQ7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblx0dmFyICRleHBvcnRPdmVybGF5ID0gJCggJy5leHBvcnQtb3ZlcmxheS0tY29udGFpbmVyJyApO1xyXG5cclxuXHQkKCAnLmpzLWV4cG9ydC1leHByZXNzaW9uJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG5cclxuXHRcdHZhciAkdGhpc0J1dHRvbiA9ICQoIHRoaXMgKTtcclxuXHJcblx0XHRpZiAoICRleHBvcnRPdmVybGF5Lmhhc0NsYXNzKCAnaXMtYWN0aXZlJykgKSB7XHJcblx0XHRcdCRleHBvcnRPdmVybGF5LnJlbW92ZUNsYXNzKCAnaXMtYWN0aXZlJyApO1xyXG5cclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHJcblx0XHRcdCQoICcuZXhwb3J0LW92ZXJsYXktLW91dHB1dCcgKS5odG1sKCBjcmVhdGVFeHByZXNzaW9uUGFyYW1ldGVyRXhwb3J0KCkgKTtcclxuXHRcdFx0JGV4cG9ydE92ZXJsYXkuYWRkQ2xhc3MoICdpcy1hY3RpdmUnICk7XHJcblx0XHR9XHJcblxyXG5cdH0gKTtcclxuXHJcblx0JCggJy5qcy1jbG9zZS1leHBvcnQtb3ZlcmxheS1saW1pdGVyJyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHR9ICk7XHJcblxyXG5cclxuXHQkKCAnLmpzLWNsb3NlLWV4cG9ydC1vdmVybGF5JyApLmNsaWNrKCBmdW5jdGlvbiggZSApe1xyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcclxuXHRcdCQoICcuZXhwb3J0LW92ZXJsYXktLWNvbnRhaW5lcicgKS5yZW1vdmVDbGFzcyggJ2lzLWFjdGl2ZScgKVxyXG5cdH0gKTtcclxuXHJcblx0XHJcblxyXG5cclxufSApOyIsImZ1bmN0aW9uIGRlZzJyYWQoZCkge1xyXG4gICAgcmV0dXJuICgyICogTWF0aC5QSSAqIGQpIC8gMzYwO1xyXG59XHJcblxyXG5mdW5jdGlvbiByYWQyZGVnKHIpIHtcclxuICAgIHJldHVybiAoMzYwICogcikgLyAoMiAqIE1hdGguUEkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXN0YW5jZSh4MSwgeTEsIHgyLCB5Mikge1xyXG4gICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MSAtIHgyLCAyKSArIE1hdGgucG93KHkxIC0geTIsIDIpKTtcclxufVxyXG5cclxudmFyIEdlYXIgPSBmdW5jdGlvbih4LCB5LCBjb25uZWN0aW9uUmFkaXVzLCB0ZWV0aCwgZmlsbFN0eWxlLCBzdHJva2VTdHlsZSkge1xyXG4gICAgLy8gR2VhciBwYXJhbWV0ZXJzXHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuICAgIHRoaXMuY29ubmVjdGlvblJhZGl1cyA9IGNvbm5lY3Rpb25SYWRpdXM7XHJcbiAgICB0aGlzLnRlZXRoID0gdGVldGg7XHJcblxyXG4gICAgLy8gUmVuZGVyIHBhcmFtZXRlcnNcclxuICAgIHRoaXMuZmlsbFN0eWxlID0gZmlsbFN0eWxlO1xyXG4gICAgdGhpcy5zdHJva2VTdHlsZSA9IHN0cm9rZVN0eWxlO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZWQgcHJvcGVydGllc1xyXG4gICAgdGhpcy5kaWFtZXRlciA9IHRlZXRoICogNCAqIGNvbm5lY3Rpb25SYWRpdXM7IC8vIEVhY2ggdG91dGggaXMgYnVpbHQgZnJvbSB0d28gY2lyY2xlcyBvZiBjb25uZWN0aW9uUmFkaXVzXHJcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMuZGlhbWV0ZXIgLyAoMiAqIE1hdGguUEkpOyAvLyBEID0gMiBQSSByXHJcblxyXG4gICAgLy8gQW5pbWF0aW9uIHByb3BlcnRpZXNcclxuICAgIHRoaXMucGhpMCA9IDA7IC8vIFN0YXJ0aW5nIGFuZ2xlXHJcbiAgICB0aGlzLmFuZ3VsYXJTcGVlZCA9IDA7IC8vIFNwZWVkIG9mIHJvdGF0aW9uIGluIGRlZ3JlZXMgcGVyIHNlY29uZFxyXG4gICAgdGhpcy5jcmVhdGVkQXQgPSBuZXcgRGF0ZSgpOyAvLyBUaW1lc3RhbXBcclxufVxyXG5cclxuR2Vhci5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgIC8vIFVwZGF0ZSByb3RhdGlvbiBhbmdsZVxyXG4gICAgdmFyIGVsbGFwc2VkID0gbmV3IERhdGUoKSAtIHRoaXMuY3JlYXRlZEF0O1xyXG4gICAgdmFyIHBoaURlZ3JlZXMgPSB0aGlzLmFuZ3VsYXJTcGVlZCAqIChlbGxhcHNlZCAvIDEwMDApO1xyXG4gICAgdmFyIHBoaSA9IHRoaXMucGhpMCArIGRlZzJyYWQocGhpRGVncmVlcyk7IC8vIEN1cnJlbnQgYW5nbGVcclxuXHJcbiAgICAvLyBTZXQtdXAgcmVuZGVyaW5nIHByb3BlcnRpZXNcclxuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XHJcbiAgICBjb250ZXh0LnN0cm9rZVN0eWxlID0gdGhpcy5zdHJva2VTdHlsZTtcclxuICAgIGNvbnRleHQubGluZUNhcCA9ICdyb3VuZCc7XHJcbiAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDE7XHJcblxyXG4gICAgLy8gRHJhdyBnZWFyIGJvZHlcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVldGggKiAyOyBpKyspIHtcclxuICAgICAgICB2YXIgYWxwaGEgPSAyICogTWF0aC5QSSAqIChpIC8gKHRoaXMudGVldGggKiAyKSkgKyBwaGk7XHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGluZGl2aWR1YWwgdG91dGggcG9zaXRpb25cclxuICAgICAgICB2YXIgeCA9IHRoaXMueCArIE1hdGguY29zKGFscGhhKSAqIHRoaXMucmFkaXVzO1xyXG4gICAgICAgIHZhciB5ID0gdGhpcy55ICsgTWF0aC5zaW4oYWxwaGEpICogdGhpcy5yYWRpdXM7XHJcblxyXG4gICAgICAgIC8vIERyYXcgYSBoYWxmLWNpcmNsZSwgcm90YXRlIGl0IHRvZ2V0aGVyIHdpdGggYWxwaGFcclxuICAgICAgICAvLyBPbiBldmVyeSBvZGQgdG91dGgsIGludmVydCB0aGUgaGFsZi1jaXJjbGVcclxuICAgICAgICBjb250ZXh0LmFyYyh4LCB5LCB0aGlzLmNvbm5lY3Rpb25SYWRpdXMsIC1NYXRoLlBJIC8gMiArIGFscGhhLCBNYXRoLlBJIC8gMiArIGFscGhhLCBpICUgMiA9PSAwKTtcclxuICAgIH1cclxuICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgY29udGV4dC5zdHJva2UoKTtcclxuXHJcbiAgICAvLyBEcmF3IGNlbnRlciBjaXJjbGVcclxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICBjb250ZXh0LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5jb25uZWN0aW9uUmFkaXVzLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XHJcbiAgICBjb250ZXh0LmZpbGwoKTtcclxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbn1cclxuXHJcbkdlYXIucHJvdG90eXBlLmNvbm5lY3QgPSBmdW5jdGlvbiAoeCwgeSkge1xyXG4gICAgdmFyIHIgPSB0aGlzLnJhZGl1cztcclxuICAgIHZhciBkaXN0ID0gZGlzdGFuY2UoeCwgeSwgdGhpcy54LCB0aGlzLnkpO1xyXG5cclxuICAgIC8vIFRvIGNyZWF0ZSBuZXcgZ2VhciB3ZSBoYXZlIHRvIGtub3cgdGhlIG51bWJlciBvZiBpdHMgdG91dGhcclxuICAgIHZhciBuZXdSYWRpdXMgPSBNYXRoLm1heChkaXN0IC0gciwgMTApO1xyXG4gICAgdmFyIG5ld0RpYW0gPSBuZXdSYWRpdXMgKiAyICogTWF0aC5QSTtcclxuICAgIHZhciBuZXdUZWV0aCA9IE1hdGgucm91bmQobmV3RGlhbSAvICg0ICogdGhpcy5jb25uZWN0aW9uUmFkaXVzKSk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIHRoZSBBQ1RVQUwgcG9zaXRpb24gZm9yIHRoZSBuZXcgZ2VhciwgdGhhdCB3b3VsZCBhbGxvdyBpdCB0byBpbnRlcmxvY2sgd2l0aCB0aGlzIGdlYXJcclxuICAgIHZhciBhY3R1YWxEaWFtZXRlciA9IG5ld1RlZXRoICogNCAqIHRoaXMuY29ubmVjdGlvblJhZGl1cztcclxuICAgIHZhciBhY3R1YWxSYWRpdXMgPSBhY3R1YWxEaWFtZXRlciAvICgyICogTWF0aC5QSSk7XHJcbiAgICB2YXIgYWN0dWFsRGlzdCA9IHIgKyBhY3R1YWxSYWRpdXM7IC8vIEFjdHVhbCBkaXN0YW5jZSBmcm9tIGNlbnRlciBvZiB0aGlzIGdlYXJcclxuICAgIHZhciBhbHBoYSA9IE1hdGguYXRhbjIoeSAtIHRoaXMueSwgeCAtIHRoaXMueCk7IC8vIEFuZ2xlIGJldHdlZW4gY2VudGVyIG9mIHRoaXMgZ2VhciBhbmQgKHgseSlcclxuICAgIHZhciBhY3R1YWxYID0gdGhpcy54ICsgTWF0aC5jb3MoYWxwaGEpICogYWN0dWFsRGlzdDsgXHJcbiAgICB2YXIgYWN0dWFsWSA9IHRoaXMueSArIE1hdGguc2luKGFscGhhKSAqIGFjdHVhbERpc3Q7XHJcblxyXG4gICAgLy8gTWFrZSBuZXcgZ2VhclxyXG4gICAgdmFyIG5ld0dlYXIgPSBuZXcgR2VhcihhY3R1YWxYLCBhY3R1YWxZLCB0aGlzLmNvbm5lY3Rpb25SYWRpdXMsIG5ld1RlZXRoLCB0aGlzLmZpbGxTdHlsZSwgdGhpcy5zdHJva2VTdHlsZSk7XHJcblxyXG4gICAgLy8gQWRqdXN0IG5ldyBnZWFyJ3Mgcm90YXRpb24gdG8gYmUgaW4gZGlyZWN0aW9uIG9wb3NpdGUgdG8gdGhlIG9yaWdpbmFsXHJcbiAgICB2YXIgZ2VhclJhdGlvID0gdGhpcy50ZWV0aCAvIG5ld1RlZXRoO1xyXG4gICAgbmV3R2Vhci5hbmd1bGFyU3BlZWQgPSAtdGhpcy5hbmd1bGFyU3BlZWQgKiBnZWFyUmF0aW87XHJcblxyXG4gICAgLy8gQXQgdGltZSB0PTAsIHJvdGF0ZSB0aGlzIGdlYXIgdG8gYmUgYXQgYW5nbGUgQWxwaGFcclxuICAgIHRoaXMucGhpMCA9IGFscGhhICsgKHRoaXMucGhpMCAtIGFscGhhKTsgLy8gPSB0aGlzLnBoaTAsIGRvZXMgbm90aGluZywgZm9yIGRlbW9uc3RyYXRpb24gcHVycG9zZXMgb25seVxyXG4gICAgbmV3R2Vhci5waGkwID0gYWxwaGEgKyBNYXRoLlBJICsgKE1hdGguUEkgLyBuZXdUZWV0aCkgKyAodGhpcy5waGkwIC0gYWxwaGEpICogKG5ld0dlYXIuYW5ndWxhclNwZWVkIC8gdGhpcy5hbmd1bGFyU3BlZWQpO1xyXG4gICAgLy8gQXQgdGhlIHNhbWUgdGltZSAodD0wKSwgcm90YXRlIHRoZSBuZXcgZ2VhciB0byBiZSBhdCAoMTgwIC0gQWxwaGEpLCBmYWNpbmcgdGhlIGZpcnN0IGdlYXIsXHJcbiAgICAvLyBBbmQgYWRkIGEgaGFsZiBnZWFyIHJvdGF0aW9uIHRvIG1ha2UgdGhlIHRlZXRoIGludGVybG9ja1xyXG4gICAgbmV3R2Vhci5jcmVhdGVkQXQgPSB0aGlzLmNyZWF0ZWRBdDsgLy8gQWxzbywgc3luY3Jvbml6ZSB0aGVpciBjbG9ja3NcclxuXHJcblxyXG4gICAgcmV0dXJuIG5ld0dlYXI7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2VhcjsiLCJ2YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgdHdvUGkgPSB0cmlnLnR3b1BpO1xyXG5sZXQgbWF0aFV0aWxzID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHM7XHJcbmxldCBlYXNpbmcgPSByZXF1aXJlKCcuL2Vhc2luZy5qcycpLmVhc2luZ0VxdWF0aW9ucztcclxuXHJcbmxldCBub2lzZUdlbiA9IHJlcXVpcmUoJy4vbm9pc2VUZXh0dXJlR2VuZXJhdG9yLmpzJyk7IFxyXG5sZXQgbm9pc2VDZmcgPSByZXF1aXJlKCcuL25vaXNlQ29uZmlnLmpzJyk7XHJcblxyXG5sZXQgbm9pc2VUZXh0dXJlID0gbm9pc2VHZW4oIDI1Niwgbm9pc2VDZmcgKTtcclxubm9pc2VUZXh0dXJlVyA9IG5vaXNlVGV4dHVyZS53aWR0aDtcclxubm9pc2VUZXh0dXJlSCA9IG5vaXNlVGV4dHVyZS5oZWlnaHQ7XHJcblxyXG5sZXQgcmFuZCA9IG1hdGhVdGlscy5yYW5kb207XHJcbmxldCByYW5kSSA9IG1hdGhVdGlscy5yYW5kb21JbnRlZ2VyO1xyXG5sZXQgbUNvcyA9IE1hdGguY29zO1xyXG5sZXQgbVNpbiA9IE1hdGguc2luO1xyXG5cclxudmFyIG51bUZsYXJlcyA9IHJhbmRJKCAxMCwgMjAgKTtcclxudmFyIGZsYXJlU2l6ZUFyciA9IFtdO1xyXG5cclxuZm9yICh2YXIgaSA9IG51bUZsYXJlcyAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgbGV0IHJhbmRvbVJhbmRvbWlzZXIgPSByYW5kSSggMCwgMTAwICk7XHJcbiAgICBsZXQgc21hbGxUaHJlc2hvbGQgPSBudW1GbGFyZXMgPCAzMCA/IDYwIDogNzU7XHJcbiAgICBsZXQgbWluID0gMTU7XHJcbiAgICBsZXQgbWF4ID0gcmFuZG9tUmFuZG9taXNlciA8IDUwID8gMTIwIDogMTgwO1xyXG5cclxuICAgIGZsYXJlU2l6ZUFyci5wdXNoKFxyXG4gICAgICAgIHJhbmRJKCBtaW4sIG1heCApXHJcbiAgICApO1xyXG59XHJcblxyXG52YXIgbGVuc0ZsYXJlID0ge1xyXG4gICAgY29uZmlnOiB7XHJcbiAgICAgICAgY291bnQ6IG51bUZsYXJlcyxcclxuICAgICAgICBzaXplQXJyOiBmbGFyZVNpemVBcnIsXHJcbiAgICAgICAgZmxhcmVBcnI6IFtdLFxyXG4gICAgICAgIGJsdXI6IDNcclxuICAgIH0sXHJcbiAgICByZW5kZXJlcnM6IHtcclxuICAgICAgICByZW5kZXI6IHtcclxuICAgICAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgICAgICBjdHg6IG51bGwsXHJcbiAgICAgICAgICAgIHc6IDIwMDAsXHJcbiAgICAgICAgICAgIGg6IDIwMDAsXHJcbiAgICAgICAgICAgIGRYOiAwLFxyXG4gICAgICAgICAgICBkWTogMCxcclxuICAgICAgICAgICAgdG90VGFsbGVzdDogMCxcclxuICAgICAgICAgICAgY29tcG9zaXRlQXJlYToge1xyXG4gICAgICAgICAgICAgICAgeDogMCwgeTogMCwgdzogMCwgaDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaXNwbGF5OiB7XHJcbiAgICAgICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICAgICAgY3R4OiBudWxsLFxyXG4gICAgICAgICAgICB4OiAwLCB5OiAwLCB3OiAwLCBoOiAwLCBhOiAwLCBkOiAwXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRSZW5kZXJlckVsZW1lbnRzOiBmdW5jdGlvbiggcmVuZGVyT3B0cywgZGlzcGxheU9wdHMgKSB7XHJcbiAgICAgICAgbGV0IHJlbmRlckNmZyA9IHRoaXMucmVuZGVyZXJzLnJlbmRlcjtcclxuICAgICAgICBsZXQgZGlzcGxheUNmZyA9IHRoaXMucmVuZGVyZXJzLmRpc3BsYXk7XHJcblxyXG4gICAgICAgIHJlbmRlckNmZy5jYW52YXMgPSByZW5kZXJPcHRzLmNhbnZhcztcclxuICAgICAgICByZW5kZXJDZmcuY3R4ID0gcmVuZGVyT3B0cy5jdHg7XHJcbiAgICAgICAgcmVuZGVyQ2ZnLmNhbnZhcy53aWR0aCA9IHJlbmRlckNmZy53O1xyXG4gICAgICAgIHJlbmRlckNmZy5jYW52YXMuaGVpZ2h0ID0gcmVuZGVyQ2ZnLmg7XHJcblxyXG4gICAgICAgIGRpc3BsYXlDZmcuY2FudmFzID0gZGlzcGxheU9wdHMuY2FudmFzO1xyXG4gICAgICAgIGRpc3BsYXlDZmcuY3R4ID0gZGlzcGxheU9wdHMuY3R4O1xyXG4gICAgICAgIGRpc3BsYXlDZmcudyA9IGRpc3BsYXlDZmcuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGRpc3BsYXlDZmcuaCA9IGRpc3BsYXlDZmcuY2FudmFzLmhlaWdodDtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGlzcGxheVByb3BzOiBmdW5jdGlvbiggc3VuICkge1xyXG4gICAgICAgIGxldCBkaXNwbGF5Q2ZnID0gdGhpcy5yZW5kZXJlcnMuZGlzcGxheTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLnggPSBzdW4ueDtcclxuICAgICAgICBkaXNwbGF5Q2ZnLnkgPSBzdW4ueTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLmEgPSBzdW4ubG9jYWxSb3RhdGlvbjtcclxuICAgICAgICBsZXQgc3VuUGl2b3QgPSBzdW4ucGl2b3RQb2ludDtcclxuICAgICAgICAvLyBkaXNwbGF5Q2ZnLm1heEQgPSB0cmlnLmRpc3QoIC0oIG9yaWdpblIgKiAyICksIC0oIG9yaWdpblIgKiAyICksIGRpc3BsYXlDZmcudyArICggb3JpZ2luUiAqIDIgKSwgZGlzcGxheUNmZy5oICsgKCBvcmlnaW5SICogMiApICk7XHJcbiAgICAgICAgZGlzcGxheUNmZy5tYXhEID0gZGlzcGxheUNmZy53ICogMjtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ2Rpc3BsYXlDZmcubWF4RDogJywgZGlzcGxheUNmZy5tYXhEICk7XHJcbiAgICAgICAgZGlzcGxheUNmZy5kID0gKCB0cmlnLmRpc3QoIGRpc3BsYXlDZmcueCwgIGRpc3BsYXlDZmcueSwgZGlzcGxheUNmZy53IC8gMiwgZGlzcGxheUNmZy5oIC8gMiApICkgKiA0O1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZGlzcGxheUNmZy5kOiAnLCBkaXNwbGF5Q2ZnLmQgKTtcclxuICAgICAgICBkaXNwbGF5Q2ZnLnNjYWxlID0gZGlzcGxheUNmZy5tYXhEIC8gZGlzcGxheUNmZy5kO1xyXG4gICAgICAgIGRpc3BsYXlDZmcuZmxhcmVEaXN0VG90YWwgPSB0cmlnLmRpc3QoIHN1blBpdm90LngsICBzdW5QaXZvdC55ICsgc3VuUGl2b3QuciwgZGlzcGxheUNmZy53IC8gMiwgZGlzcGxheUNmZy5oIC8gMiApO1xyXG4gICAgICAgIGRpc3BsYXlDZmcuY3VyckZsYXJlRGlzdCA9IHRyaWcuZGlzdCggc3VuLngsICBzdW4ueSwgZGlzcGxheUNmZy53IC8gMiwgZGlzcGxheUNmZy5oIC8gMiApO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnZGlzcGxheUNmZy5zY2FsZTogJywgZGlzcGxheUNmZy5zY2FsZSApO1xyXG4gICAgfSxcclxuXHJcbiAgICBjcmVhdGVGbGFyZUNvbmZpZ3M6IGZ1bmN0aW9uKCBtaXNjT3B0cyApIHtcclxuICAgICAgICBsZXQgY2ZnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgdGhpcy5jb25maWcub3B0cyA9IG1pc2NPcHRzO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gY2ZnLmNvdW50IC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzVHlwZVJhbmRvbWlzZXIgPSByYW5kSSggMCwgMTAwICk7XHJcbiAgICAgICAgICAgIGxldCB0aGlzVHlwZTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxldCB0aGlzVHlwZSA9IHRoaXNUeXBlUmFuZG9taXNlciA8IDEwID8gJ3Nwb3RTaGluZScgOiB0aGlzVHlwZVJhbmRvbWlzZXIgPCA1NSA/ICdwb2x5JyA6ICdjaXJjbGUnO1xyXG4gICAgICAgICAgICBpZiAoIGkgPT09IDAgfHwgaSA9PT0gNSApIHtcclxuICAgICAgICAgICAgICAgIHRoaXNUeXBlID0gJ3JlbmRlclJHQlNwb3RGbGFyZSc7XHJcbiAgICAgICAgICAgICAgICBjZmcuc2l6ZUFyclsgaSBdID0gcmFuZEkoIDE1LCAxMDAgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCAnY2ZnLnNpemVBcnJbIGkgXTogJywgY2ZnLnNpemVBcnJbIGkgXSApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpc1R5cGUgPSB0aGlzVHlwZVJhbmRvbWlzZXIgPCA4ID8gJ3Nwb3RTaGluZScgOiAncG9seSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCBjb2xSYW5kID0gcmFuZEkoIDAsIDEwMCApO1xyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBjb2xSYW5kIDwgNTAgPyAyNTUgOiBjb2xSYW5kIDwgNjAgPyAyNTUgOiBjb2xSYW5kIDwgODAgPyAyMDAgOiAyMDA7XHJcbiAgICAgICAgICAgIGxldCBnID0gY29sUmFuZCA8IDUwID8gMjU1IDogY29sUmFuZCA8IDYwID8gMjAwIDogY29sUmFuZCA8IDgwID8gMjU1IDogMjU1O1xyXG4gICAgICAgICAgICBsZXQgYiA9IGNvbFJhbmQgPCA1MCA/IDI1NSA6IGNvbFJhbmQgPCA2MCA/IDIwMCA6IGNvbFJhbmQgPCA4MCA/IDIwMCA6IDI1NTtcclxuXHJcbiAgICAgICAgICAgIGxldCB0aGlzRmxhcmUgPSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIHI6IHIsXHJcbiAgICAgICAgICAgICAgICAgICAgZzogZyxcclxuICAgICAgICAgICAgICAgICAgICBiOiBiXHJcblxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXNUeXBlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpc1R5cGUgPT09ICdzcG90U2hpbmUnICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBjb2xSYW5kIDwgMTAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc0ZsYXJlLmNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByOiAyNTUsIGc6IDEwMCwgYjogMTAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbFJhbmQgPCAyMCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0ZsYXJlLmNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogMTAwLCBnOiAyNTUsIGI6IDEwMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0ZsYXJlLmNvbG9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcjogMjU1LCBnOiAyNTUsIGI6IDI1NVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXNGbGFyZS5zaXplID0gdGhpc0ZsYXJlLnR5cGUgPT09ICdzcG90U2hpbmUnID8gcmFuZEkoIDQwLCA4MCApIDogY2ZnLnNpemVBcnJbIGkgXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXNGbGFyZS5kID0gdGhpc0ZsYXJlLnR5cGUgPT09ICdzcG90U2hpbmUnID8gcGFyc2VGbG9hdCggcmFuZCggMC4zLCAxICkudG9GaXhlZCggMiApICkgOiBwYXJzZUZsb2F0KCByYW5kKCAwLCAxICkudG9GaXhlZCggMiApICk7XHJcblxyXG4gICAgICAgICAgICB0aGlzRmxhcmUuaFJhbmQgPSBwYXJzZUZsb2F0KCByYW5kKCAxLCAyICkudG9GaXhlZCggMiApICk7XHJcbiAgICAgICAgICAgIGNmZy5mbGFyZUFyci5wdXNoKCB0aGlzRmxhcmUgKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlckNpcmNsZUZsYXJlOiBmdW5jdGlvbiggeCwgeSwgY2ZnICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjID0gdGhpcy5yZW5kZXJlcnMucmVuZGVyLmN0eDtcclxuICAgICAgICBsZXQgYmFzZUNmZyA9IHRoaXMuY29uZmlnO1xyXG4gICAgICAgIGxldCBmbGFyZUNmZyA9IGNmZztcclxuICAgICAgICBsZXQgZmxhcmVSYW5kb21pc2VyID0gcmFuZEkoIDAsIDEwMCApO1xyXG4gICAgICAgIGxldCBmbGFyZVJhbmRvbVNoaWZ0ID0gcmFuZEkoIDIwLCA0MCApO1xyXG4gICAgICAgIGxldCBmbGFyZVJhbmRvbUVkZ2UgPSByYW5kSSggMCwgMTAgKTtcclxuICAgICAgICBsZXQgcmFuZG9tRmlsbCA9IHJhbmRJKCAwLCAxMDAgKSA8IDIwID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIGxldCBncmFkID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggMCAtICggZmxhcmVSYW5kb21TaGlmdCAqIDMgKSwgMCwgMCwgMCwgMCwgZmxhcmVDZmcuc2l6ZSApO1xyXG4gICAgICAgIGxldCByZ2JDb2xvclN0cmluZyA9IGAkeyBmbGFyZUNmZy5jb2xvci5yIH0sICR7IGZsYXJlQ2ZnLmNvbG9yLmcgfSwgJHsgZmxhcmVDZmcuY29sb3IuYiB9LCBgO1xyXG5cclxuICAgICAgICAgICAgLy8gZ3JhZC5hZGRDb2xvclN0b3AoIDAsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuNiApYCApO1xyXG4gICAgICAgICAgICAvLyBncmFkLmFkZENvbG9yU3RvcCggMC43LCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC44IClgICk7XHJcbiAgICAgICAgICAgIC8vIGdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC43IClgICk7XHJcblxyXG4gICAgICAgIGlmICggZmxhcmVSYW5kb21FZGdlID4gNSApIHtcclxuICAgICAgICAgICAgaWYgKCByYW5kb21GaWxsID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjEgKWAgKTtcclxuICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLjk1LCBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjIgKWAgKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMCApYCApO1xyXG4gICAgICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuOCwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAgKWAgKTtcclxuICAgICAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLjk1LCBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjIgKWAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuOTcsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuOCApYCApO1xyXG4gICAgICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMC45OSwgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC4zIClgICk7XHJcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAxLCBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwIClgICk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjIgKWAgKTtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDEsIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMyApYCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSBncmFkOyBcclxuICAgICAgICBjLmZpbGxDaXJjbGUoIDAsIDAsIGZsYXJlQ2ZnLnNpemUgKTtcclxuICAgICAgICBjLmZpbGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyU3BvdEZsYXJlOiBmdW5jdGlvbiggeCwgeSwgY2ZnICkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBjID0gdGhpcy5yZW5kZXJlcnMucmVuZGVyLmN0eDtcclxuICAgICAgICBsZXQgZmxhcmVDZmcgPSBjZmc7XHJcbiAgICAgICAgbGV0IHJnYkNvbG9yU3RyaW5nID0gYCR7IGZsYXJlQ2ZnLmNvbG9yLnIgfSwgJHsgZmxhcmVDZmcuY29sb3IuZyB9LCAkeyBmbGFyZUNmZy5jb2xvci5iIH0sIGA7XHJcblxyXG4gICAgICAgIGxldCBncmFkID0gYy5jcmVhdGVSYWRpYWxHcmFkaWVudCggMCwgMCwgMCwgMCwgMCwgZmxhcmVDZmcuc2l6ZSApO1xyXG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMSApYCApO1xyXG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAwLjIsICBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAxIClgICk7XHJcbiAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoIDAuNCwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMSApYCApO1xyXG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMCApYCApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGMuZmlsbFN0eWxlID0gZ3JhZDsgXHJcbiAgICAgICAgYy5maWxsQ2lyY2xlKCAwLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcbiAgICAgICAgYy5maWxsKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbmRlclJHQlNwb3RGbGFyZTogZnVuY3Rpb24oIHgsIHksIGNmZyApIHtcclxuICAgICAgICBjb25zb2xlLmxvZyggJ3lheSByZW5kZXJlZCByZW5kZXJSR0JTcG90RmxhcmUnICk7XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY3R4O1xyXG4gICAgICAgIGxldCBmbGFyZUNmZyA9IGNmZztcclxuICAgICAgICBsZXQgY3VyQ29tcCA9IGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uO1xyXG4gICAgICAgIGMuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ2xpZ2h0ZW4nO1xyXG5cclxuICAgICAgICBsZXQgcmVkR3JhZCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIDAsIDAsIDAsIDAsIDAsIGZsYXJlQ2ZnLnNpemUgKTtcclxuICAgICAgICByZWRHcmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAyNTUsIDAsIDAsIDAuNSApYCApO1xyXG4gICAgICAgIHJlZEdyYWQuYWRkQ29sb3JTdG9wKCAwLjIsICBgcmdiYSggMjU1LCAwLCAwLCAwLjUgKWAgKTtcclxuICAgICAgICByZWRHcmFkLmFkZENvbG9yU3RvcCggMC42LCAgYHJnYmEoIDI1NSwgMCwgMCwgMC4xIClgICk7XHJcbiAgICAgICAgcmVkR3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggMjU1LCAwLCAwLCAwIClgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSByZWRHcmFkOyBcclxuICAgICAgICBjLmZpbGxDaXJjbGUoIDAsIDAsIGZsYXJlQ2ZnLnNpemUgKTtcclxuXHJcbiAgICAgICAgbGV0IGdyZWVuR3JhZCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIGZsYXJlQ2ZnLnNpemUgLyA0ICwgMCwgMCwgZmxhcmVDZmcuc2l6ZSAvIDQgLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcbiAgICAgICAgZ3JlZW5HcmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAwLCAyNTUsIDAsIDAuNSApYCApO1xyXG4gICAgICAgIGdyZWVuR3JhZC5hZGRDb2xvclN0b3AoIDAuMiwgIGByZ2JhKCAwLCAyNTUsIDAsIDAuNSApYCApO1xyXG4gICAgICAgIGdyZWVuR3JhZC5hZGRDb2xvclN0b3AoIDAuNiwgIGByZ2JhKCAwLCAyNTUsIDAsIDAuMSApYCApO1xyXG4gICAgICAgIGdyZWVuR3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggMCwgMjU1LCAwLCAwIClgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSBncmVlbkdyYWQ7IFxyXG4gICAgICAgIGMuZmlsbENpcmNsZSggZmxhcmVDZmcuc2l6ZSAvIDQgLCAwLCBmbGFyZUNmZy5zaXplICk7XHJcblxyXG4gICAgICAgIGxldCBibHVlR3JhZCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIGZsYXJlQ2ZnLnNpemUgLyAyLCAwLCAwLCBmbGFyZUNmZy5zaXplIC8gMiwgMCwgZmxhcmVDZmcuc2l6ZSApO1xyXG4gICAgICAgIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAwLCAwLCAyNTUsIDAuNSApYCApO1xyXG4gICAgICAgIGJsdWVHcmFkLmFkZENvbG9yU3RvcCggMC4yLCAgYHJnYmEoIDAsIDAsIDI1NSwgMC41IClgICk7XHJcbiAgICAgICAgYmx1ZUdyYWQuYWRkQ29sb3JTdG9wKCAwLjYsICBgcmdiYSggMCwgMCwgMjU1LCAwLjEgKWAgKTtcclxuICAgICAgICBibHVlR3JhZC5hZGRDb2xvclN0b3AoIDEsICBgcmdiYSggMCwgMCwgMjU1LCAwIClgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSBibHVlR3JhZDsgXHJcbiAgICAgICAgYy5maWxsQ2lyY2xlKCBmbGFyZUNmZy5zaXplIC8gMiwgMCwgZmxhcmVDZmcuc2l6ZSApO1xyXG5cclxuICAgICAgICBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGN1ckNvbXA7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICByZW5kZXJQb2x5RmxhcmU6IGZ1bmN0aW9uKCB4LCB5LCBjZmcgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXIuY3R4O1xyXG4gICAgICAgIGxldCBmbGFyZUNmZyA9IGNmZztcclxuICAgICAgICBsZXQgZmxhcmVTaXplID0gZmxhcmVDZmcuc2l6ZTtcclxuICAgICAgICBsZXQgZmxhcmVSYW5kb21TaGlmdCA9IHJhbmRJKCAwLCA0MCApO1xyXG5cclxuICAgICAgICBsZXQgZmxhcmVSYW5kb21FZGdlID0gcmFuZEkoIDAsIDEwICk7XHJcblxyXG4gICAgICAgIGxldCByZ2JDb2xvclN0cmluZyA9IGAkeyBmbGFyZUNmZy5jb2xvci5yIH0sICR7IGZsYXJlQ2ZnLmNvbG9yLmcgfSwgJHsgZmxhcmVDZmcuY29sb3IuYiB9LCBgO1xyXG5cclxuICAgICAgICBsZXQgZ3JhZCA9IGMuY3JlYXRlUmFkaWFsR3JhZGllbnQoIDAsIDAsIDAsIDAsIDAsIGZsYXJlQ2ZnLnNpemUgKTtcclxuICAgICAgICBncmFkLmFkZENvbG9yU3RvcCggMCwgIGByZ2JhKCAkeyByZ2JDb2xvclN0cmluZyB9IDAuMSApYCApO1xyXG4gICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKCAxLCAgYHJnYmEoICR7IHJnYkNvbG9yU3RyaW5nIH0gMC4yIClgICk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IHNpZGVzID0gdGhpcy5jb25maWcub3B0cy5hcGVydHVyZTtcclxuXHJcbiAgICAgICAgYy5zYXZlKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHNpZGVzOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyBzaWRlcyApO1xyXG4gICAgICAgIC8vICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgLy8gICAgICAgICBjLm1vdmVUbyggbUNvcyggYWxwaGEgKSAqIGZsYXJlU2l6ZSwgbVNpbiggYWxwaGEgKSAqIGZsYXJlU2l6ZSApO1xyXG4gICAgICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vICAgICAgICAgYy5saW5lVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgIC8vIGMuY2xpcCgpO1xyXG5cclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lkZXM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvIHNpZGVzICk7XHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKCBtQ29zKCBhbHBoYSApICogZmxhcmVTaXplLCBtU2luKCBhbHBoYSApICogZmxhcmVTaXplICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyggbUNvcyggYWxwaGEgKSAqIGZsYXJlU2l6ZSwgbVNpbiggYWxwaGEgKSAqIGZsYXJlU2l6ZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGMuY2xvc2VQYXRoKCk7XHJcblxyXG4gICAgICAgIGMuZmlsbFN0eWxlID0gZ3JhZDsgXHJcbiAgICAgICAgYy5maWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYy50cmFuc2xhdGUoIDAsIC0xMDAwMDAgKTtcclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2lkZXM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvIHNpZGVzICk7XHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgIGMubW92ZVRvKCBtQ29zKCBhbHBoYSApICogZmxhcmVTaXplLCBtU2luKCBhbHBoYSApICogZmxhcmVTaXplICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjLmxpbmVUbyggbUNvcyggYWxwaGEgKSAqIGZsYXJlU2l6ZSwgbVNpbiggYWxwaGEgKSAqIGZsYXJlU2l6ZSApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGMuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgZmxhcmVSYW5kb21TaGlmdCA9IHJhbmRJKCAwLCA1ICk7XHJcbiAgICAgICAgYy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgIGMuc2hhZG93Q29sb3IgPSBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjA1IClgO1xyXG4gICAgICAgIGMuc2hhZG93Qmx1ciA9IDU7XHJcbiAgICAgICAgYy5zaGFkb3dPZmZzZXRYID0gMCAtIGZsYXJlUmFuZG9tU2hpZnQ7XHJcbiAgICAgICAgYy5zaGFkb3dPZmZzZXRZID0gMTAwMDAwO1xyXG4gICAgICAgIGMubGluZVdpZHRoID0gMjtcclxuICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgIGMuc2hhZG93Qmx1ciA9IDA7XHJcblxyXG4gICAgICAgIGlmICggZmxhcmVSYW5kb21FZGdlID4gNSApIHtcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaWRlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvIHNpZGVzICk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5tb3ZlVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5saW5lVG8oIG1Db3MoIGFscGhhICkgKiBmbGFyZVNpemUsIG1TaW4oIGFscGhhICkgKiBmbGFyZVNpemUgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICBjLnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgICAgIGMuc2hhZG93Q29sb3IgPSBgcmdiYSggJHsgcmdiQ29sb3JTdHJpbmcgfSAwLjA1IClgO1xyXG4gICAgICAgICAgICBjLnNoYWRvd0JsdXIgPSAzO1xyXG4gICAgICAgICAgICBjLnNoYWRvd09mZnNldFggPSAwIC0gZmxhcmVSYW5kb21TaGlmdDtcclxuICAgICAgICAgICAgYy5zaGFkb3dPZmZzZXRZID0gMTAwMDAwO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IDI7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIGMuc2hhZG93Qmx1ciA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjLnRyYW5zbGF0ZSggMCwgMTAwMDAwICk7XHJcblxyXG4gICAgICAgIGMucmVzdG9yZSgpO1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Q2xlYW5Db29yZHM6IGZ1bmN0aW9uKCBmbGFyZSApIHtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcmVuZGVyQ2ZnID0gdGhpcy5yZW5kZXJlci5yZW5kZXI7XHJcbiAgICAgICAgbGV0IGJsdXIgPSB0aGlzLmNvbmZpZy5ibHVyO1xyXG4gICAgICAgIGxldCBibHVyMiA9IGJsdXIgKiAyO1xyXG4gICAgICAgIGxldCBmbGFyZVMgPSBmbGFyZS5zaXplO1xyXG4gICAgICAgIGxldCBmbGFyZVMyID0gZmxhcmVTICogMjtcclxuICAgICAgICBsZXQgdG90YWxTID0gZmxhcmVTMiArIGJsdXIyO1xyXG4gICAgICAgIGxldCBjbGVhblggPSByZW5kZXJDZmcuZFg7XHJcbiAgICAgICAgbGV0IGNsZWFuWSA9IHJlbmRlckNmZy5kWTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyRmxhcmVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IGJhc2VDZmcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnJlbmRlcmVycy5yZW5kZXI7XHJcbiAgICAgICAgbGV0IGNvbXBvc2l0ZUFyZWEgPSByZW5kZXJlci5jb21wb3NpdGVBcmVhO1xyXG4gICAgICAgIGxldCBjID0gcmVuZGVyZXIuY3R4O1xyXG4gICAgICAgIGxldCBjVyA9IHJlbmRlcmVyLnc7XHJcbiAgICAgICAgbGV0IGNIID0gcmVuZGVyZXIuaDtcclxuICAgICAgICBsZXQgZmxhcmVDb3VudCA9IGJhc2VDZmcuY291bnQ7XHJcbiAgICAgICAgbGV0IGZsYXJlcyA9IGJhc2VDZmcuZmxhcmVBcnI7XHJcbiAgICAgICAgbGV0IGJsdXIgPSBiYXNlQ2ZnLmJsdXI7XHJcbiAgICAgICAgbGV0IGJsdXIyID0gYmx1ciAqIDI7XHJcblxyXG4gICAgICAgIGxldCBjdXJyWCA9IDA7XHJcbiAgICAgICAgbGV0IGN1cnJZID0gMDtcclxuICAgICAgICBsZXQgY3VyclRhbGxlc3QgPSAwO1xyXG5cclxuICAgICAgICBsZXQgYmx1clN0ciA9ICdibHVyKCcrYmx1ci50b1N0cmluZygpKydweCknO1xyXG4gICAgICAgIGMuZmlsdGVyID0gYmx1clN0cjtcclxuICAgICAgICBsZXQgcG9seUNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgLy8gc29ydCBmbGFyZXMgYmFzZWQgb24gc2l6ZSAtIGRlY2VuZGluZyBvcmRlciB0byBtYXAgdG8gcmV2ZXJzZSBGT1IgbG9vcCAoIHNvIGxvb3Agc3RhcnRzIHdpdGggc21hbGxlc3QgKSBcclxuICAgICAgICBmbGFyZXMuc29ydCggZnVuY3Rpb24oIGEsIGIgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYi5zaXplIC0gYS5zaXplXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gZmxhcmVDb3VudCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgdGhpc0ZsYXJlID0gZmxhcmVzWyBpIF07XHJcbiAgICAgICAgICAgIGxldCBmbGFyZVNpemUgPSB0aGlzRmxhcmUuc2l6ZTtcclxuICAgICAgICAgICAgbGV0IGZsYXJlU2l6ZTIgPSBmbGFyZVNpemUgKiAyO1xyXG4gICAgICAgICAgICBsZXQgdG90YWxGbGFyZVcgPSBmbGFyZVNpemUyICsgYmx1cjI7XHJcbiAgICAgICAgICAgIGxldCB0b3RhbEZsYXJlSCA9IGZsYXJlU2l6ZTIgKyBibHVyMjtcclxuXHJcbiAgICAgICAgICAgIHRvdGFsRmxhcmVIID4gY3VyclRhbGxlc3QgPyBjdXJyVGFsbGVzdCA9IHRvdGFsRmxhcmVIIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGN1cnJYICsgdG90YWxGbGFyZVcgKyBibHVyID4gY1cgKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyWCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjdXJyWSArPSBjdXJyVGFsbGVzdDtcclxuICAgICAgICAgICAgICAgIGN1cnJUYWxsZXN0ID0gdG90YWxGbGFyZUg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCB0cmFuc1ggPSBjdXJyWCArIGZsYXJlU2l6ZSArIGJsdXI7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc1kgPSBjdXJyWSArIGZsYXJlU2l6ZSArIGJsdXI7XHJcblxyXG4gICAgICAgICAgICBjLnRyYW5zbGF0ZSggdHJhbnNYLCB0cmFuc1kgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpc0ZsYXJlLnR5cGUgPT09ICdzcG90U2hpbmUnICkge1xyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclNwb3RGbGFyZSggMCwgMCwgdGhpc0ZsYXJlICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpc0ZsYXJlLnR5cGUgPT09ICdyZW5kZXJSR0JTcG90RmxhcmUnICkge1xyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclJHQlNwb3RGbGFyZSggMCwgMCwgdGhpc0ZsYXJlICk7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gJ3BvbHknICkge1xyXG4gICAgICAgICAgICAgICAgYy5nbG9iYWxBbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlclBvbHlGbGFyZSggMCwgMCwgdGhpc0ZsYXJlICk7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gJ2NpcmNsZScgKSB7XHJcbiAgICAgICAgICAgICAgICBjLmdsb2JhbEFscGhhID0gcGFyc2VGbG9hdCggcmFuZCggMC41LCAxICkudG9GaXhlZCggMiApICk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckNpcmNsZUZsYXJlKCAwLCAwLCB0aGlzRmxhcmUgKTtcclxuICAgICAgICAgICAgICAgIGMuZ2xvYmFsQWxwaGEgPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gYy5zdHJva2VTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgICAgICAvLyBjLmxpbmVXaWR0aCA9IDE7XHJcbiAgICAgICAgICAgIC8vIGMuc3Ryb2tlUmVjdCggLSggZmxhcmVTaXplICsgYmx1ciApLCAtKCBmbGFyZVNpemUgKyBibHVyICksIHRvdGFsRmxhcmVXLCB0b3RhbEZsYXJlSCApO1xyXG4gICAgICAgICAgICAvLyBjLnN0cm9rZSgpO1xyXG5cclxuICAgICAgICAgICAgYy50cmFuc2xhdGUoIC10cmFuc1gsIC10cmFuc1kgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXNGbGFyZS5yZW5kZXJDZmcgPSB7XHJcbiAgICAgICAgICAgICAgICB4OiBjdXJyWCxcclxuICAgICAgICAgICAgICAgIHk6IGN1cnJZLFxyXG4gICAgICAgICAgICAgICAgdzogdG90YWxGbGFyZVcgKiAoIHRoaXNGbGFyZS50eXBlID09PSAncmVuZGVyUkdCU3BvdEZsYXJlJyA/IDEuNSA6IDEgKSxcclxuXHJcbiAgICAgICAgICAgICAgICBoOiB0b3RhbEZsYXJlSFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyWCArPSB0b3RhbEZsYXJlVyAqICggdGhpc0ZsYXJlLnR5cGUgPT09ICdyZW5kZXJSR0JTcG90RmxhcmUnID8gMS41IDogMSApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBpID09PSAwICkge1xyXG4gICAgICAgICAgICAgICAgY29tcG9zaXRlQXJlYS54ID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbXBvc2l0ZUFyZWEueSA9IGN1cnJZICsgdG90YWxGbGFyZUg7XHJcbiAgICAgICAgICAgICAgICBjb21wb3NpdGVBcmVhLncgPSBjVztcclxuICAgICAgICAgICAgICAgIGNvbXBvc2l0ZUFyZWEuaCA9IHRvdGFsRmxhcmVIO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYy5maWx0ZXIgPSAnYmx1cigwcHgpJztcclxuXHJcbiAgICAgICAgLy8gbGV0IGN1cnJNaXggPSBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbjtcclxuICAgICAgICAvLyBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdsaWdodGVuJztcclxuXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IGZsYXJlQ291bnQgLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAvLyAgICAgbGV0IHRoaXNGbGFyZSA9IGZsYXJlc1sgaSBdO1xyXG4gICAgICAgIC8vICAgICBmbGFyZUNmZyA9IHRoaXNGbGFyZS5yZW5kZXJDZmc7XHJcbiAgICAgICAgLy8gICAgIGlmICggdGhpc0ZsYXJlLnR5cGUgPT09ICdwb2x5JyB8fCB0aGlzRmxhcmUudHlwZSA9PT0gJ2NpcmNsZScgKSB7XHJcbiAgICAgICAgLy8gICAgICAgICBsZXQgbm9pc2VTaXplID0gZmxhcmVDZmcudztcclxuICAgICAgICAvLyAgICAgICAgIGMuZHJhd0ltYWdlKFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIG5vaXNlVGV4dHVyZSxcclxuICAgICAgICAvLyAgICAgICAgICAgICAwLCAwLCBub2lzZVRleHR1cmVXLCBub2lzZVRleHR1cmVILFxyXG4gICAgICAgIC8vICAgICAgICAgICAgIGZsYXJlQ2ZnLngsIGZsYXJlQ2ZnLnksIG5vaXNlU2l6ZSwgbm9pc2VTaXplXHJcbiAgICAgICAgLy8gICAgICAgICApO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAvLyBjLmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGN1cnJNaXg7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBkaXNwbGF5RmxhcmVzOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgbGV0IGJhc2VDZmcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBsZXQgcmVuZGVyQyA9IHRoaXMucmVuZGVyZXJzLnJlbmRlci5jYW52YXM7XHJcbiAgICAgICAgbGV0IGRpc3BsYXlDZmcgPSB0aGlzLnJlbmRlcmVycy5kaXNwbGF5O1xyXG4gICAgICAgIGxldCBjID0gZGlzcGxheUNmZy5jdHg7XHJcbiAgICAgICAgbGV0IHRoaXNFYXNlID0gZWFzaW5nLmVhc2VJblF1YXJ0O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBmbGFyZUNvdW50ID0gYmFzZUNmZy5jb3VudDtcclxuICAgICAgICBsZXQgZmxhcmVzID0gYmFzZUNmZy5mbGFyZUFycjtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlID0gZGlzcGxheUNmZy5zY2FsZSAvIDI7XHJcbiAgICAgICAgbGV0IGludlNjYWxlID0gMSAtIHNjYWxlO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnc2NhbGU6ICcsIHNjYWxlICk7XHJcbiAgICAgICAgYy5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnbGlnaHRlbic7XHJcblxyXG4gICAgICAgIGMudHJhbnNsYXRlKCBkaXNwbGF5Q2ZnLngsIGRpc3BsYXlDZmcueSApO1xyXG4gICAgICAgIGMucm90YXRlKCBkaXNwbGF5Q2ZnLmEgKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGZsYXJlQ291bnQgLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuICAgICAgICAgICAgbGV0IHRoaXNGbGFyZSA9IGZsYXJlc1sgaSBdO1xyXG4gICAgICAgICAgICBsZXQgdGhpc0ZsYXJlQ2ZnID0gdGhpc0ZsYXJlLnJlbmRlckNmZztcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzRmxhcmVDZmc6ICcsIHRoaXNGbGFyZUNmZyApO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkQ29vcmRzID0gKCB0aGlzRmxhcmVDZmcudyAvIDIgKSAqIGludlNjYWxlO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkVyA9IHRoaXNGbGFyZUNmZy53ICogMC44O1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkSCA9IHRoaXNGbGFyZUNmZy5oICogMC44O1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVkWCA9IGRpc3BsYXlDZmcuZCAqIHRoaXNGbGFyZS5kO1xyXG4gICAgICAgICAgICAvLyBsZXQgaW52ZXJzZVNjYWxlID0gMSAtICggc2NhbGVkWCAvIGRpc3BsYXlDZmcuZCApO1xyXG4gICAgICAgICAgICAvLyBsZXQgc2NhbGVNdWx0aXBsaWVyID0gdGhpc0Vhc2UoIHNjYWxlZFgsIDEsIC0xLCBkaXNwbGF5Q2ZnLmQgKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coICdpbnZlcnNlU2NhbGU6ICcsIGludmVyc2VTY2FsZSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCAnc2NhbGVkU2l6ZSAqIGludmVyc2VTY2FsZTogJywgc2NhbGVkU2l6ZSAqIGludmVyc2VTY2FsZSApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzRmxhcmUudHlwZSA9PT0gXCJyZW5kZXJSR0JTcG90RmxhcmVcIiB8fCB0aGlzRmxhcmUudHlwZSA9PT0gXCJzcG90U2hpbmVcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjYWxlZFNpemUgPSB0aGlzRmxhcmVDZmcudyAqIChzY2FsZSAvIDIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjYWxlZENvb3JkcyA9IHNjYWxlZFNpemUgLyAyO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjYWxlZFggPSBkaXNwbGF5Q2ZnLmQgKiB0aGlzRmxhcmUuZDtcclxuICAgICAgICAgICAgICAgIGxldCBzY2FsZU11bHRpcGxpZXIgPSBlYXNpbmcuZWFzZUluQ3ViaWMoIGRpc3BsYXlDZmcuY3VyckZsYXJlRGlzdCwgMSwgMTAsIGRpc3BsYXlDZmcuZmxhcmVEaXN0VG90YWwgKTtcclxuICAgICAgICAgICAgICAgIGMuZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHJlbmRlckMsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc0ZsYXJlQ2ZnLngsIHRoaXNGbGFyZUNmZy55LCB0aGlzRmxhcmVDZmcudywgdGhpc0ZsYXJlQ2ZnLmgsXHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVkWCwgLXNjYWxlZENvb3Jkcywgc2NhbGVkU2l6ZSAqIHNjYWxlTXVsdGlwbGllciAsIHNjYWxlZFNpemVcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjLmRyYXdJbWFnZShcclxuICAgICAgICAgICAgICAgICAgICByZW5kZXJDLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNGbGFyZUNmZy54LCB0aGlzRmxhcmVDZmcueSwgdGhpc0ZsYXJlQ2ZnLncsIHRoaXNGbGFyZUNmZy5oLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlZFgsIC0oIHNjYWxlZEggLyAyKSwgc2NhbGVkVywgc2NhbGVkSFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjLnJvdGF0ZSggLWRpc3BsYXlDZmcuYSApO1xyXG4gICAgICAgIGMudHJhbnNsYXRlKCAtZGlzcGxheUNmZy54LCAtZGlzcGxheUNmZy55ICk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBcclxuXHJcbiAgICBcclxuXHJcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuY29tcG9zaXRlRmxhcmVzKCk7XHJcbiAgICAgICAgdGhpcy5kaXNwbGF5Q29tcG9zaXRlKCk7XHJcbiAgICAgICAgdGhpcy5jbGVhckNvbXBvc2l0ZUFyZWEoKTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGZsYXJlSW5pdDogZnVuY3Rpb24oIHJlbmRlck9wdHMsIGRpc3BsYXlPcHRzLCBtaXNjT3B0cyApIHtcclxuICAgICAgICBzZWxmID0gdGhpcztcclxuICAgICAgICBzZWxmLnNldFJlbmRlcmVyRWxlbWVudHMoIHJlbmRlck9wdHMsIGRpc3BsYXlPcHRzICk7XHJcbiAgICAgICAgc2VsZi5jcmVhdGVGbGFyZUNvbmZpZ3MoIG1pc2NPcHRzICk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbGVuc0ZsYXJlOyIsIi8qKlxyXG4qIHByb3ZpZGVzIG1hdGhzIHV0aWwgbWV0aG9kcy5cclxuKlxyXG4qIEBtaXhpblxyXG4qL1xyXG5cclxudmFyIG1hdGhVdGlscyA9IHtcclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gMiB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IC0gbWF4aW11bSB2YWx1ZS5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYW5kb21JbnRlZ2VyOiBmdW5jdGlvbiByYW5kb21JbnRlZ2VyKG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCArIDEgLSBtaW4pKSArIG1pbjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIEdlbmVyYXRlIHJhbmRvbSBmbG9hdCBiZXR3ZWVuIDIgdmFsdWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIC0gbWluaW11bSB2YWx1ZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0cmFuZG9tOiBmdW5jdGlvbiByYW5kb20obWluLCBtYXgpIHtcclxuXHRcdGlmIChtaW4gPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtaW4gPSAwO1xyXG5cdFx0XHRtYXggPSAxO1xyXG5cdFx0fSBlbHNlIGlmIChtYXggPT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRtYXggPSBtaW47XHJcblx0XHRcdG1pbiA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblxyXG5cdGdldFJhbmRvbUFyYml0cmFyeTogZnVuY3Rpb24gZ2V0UmFuZG9tQXJiaXRyYXJ5KG1pbiwgbWF4KSB7XHJcblx0XHRyZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG5cdH0sXHJcblx0LyoqXHJcbiAqIEBkZXNjcmlwdGlvbiBUcmFuc2Zvcm1zIHZhbHVlIHByb3BvcnRpb25hdGVseSBiZXR3ZWVuIGlucHV0IHJhbmdlIGFuZCBvdXRwdXQgcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgb3JpZ2luIHJhbmdlICggbWluMS9tYXgxICkuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4xIC0gbWluaW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgxIC0gbWF4aW11bSB2YWx1ZSBpbiBvcmlnaW4gcmFuZ2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4yIC0gbWluaW11bSB2YWx1ZSBpbiBkZXN0aW5hdGlvbiByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heDIgLSBtYXhpbXVtIHZhbHVlIGluIGRlc3RpbmF0aW9uIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiBkZXN0aW5hdGlvbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqIEByZXR1cm5zIHtudW1iZXJ9IHJlc3VsdC5cclxuICovXHJcblx0bWFwOiBmdW5jdGlvbiBtYXAodmFsdWUsIG1pbjEsIG1heDEsIG1pbjIsIG1heDIsIGNsYW1wUmVzdWx0KSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgcmV0dXJudmFsdWUgPSAodmFsdWUgLSBtaW4xKSAvIChtYXgxIC0gbWluMSkgKiAobWF4MiAtIG1pbjIpICsgbWluMjtcclxuXHRcdGlmIChjbGFtcFJlc3VsdCkgcmV0dXJuIHNlbGYuY2xhbXAocmV0dXJudmFsdWUsIG1pbjIsIG1heDIpO2Vsc2UgcmV0dXJuIHJldHVybnZhbHVlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gQ2xhbXAgdmFsdWUgYmV0d2VlbiByYW5nZSB2YWx1ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZSAtIHRoZSB2YWx1ZSBpbiB0aGUgcmFuZ2UgeyBtaW58bWF4IH0uXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4gLSBtaW5pbXVtIHZhbHVlIGluIHRoZSByYW5nZS5cclxuICogQHBhcmFtIHtudW1iZXJ9IG1heCAtIG1heGltdW0gdmFsdWUgaW4gdGhlIHJhbmdlLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gY2xhbXBSZXN1bHQgLSBjbGFtcCByZXN1bHQgYmV0d2VlbiByYW5nZSBib3VuZGFyeXMuXHJcbiAqL1xyXG5cdGNsYW1wOiBmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtcclxuXHRcdGlmIChtYXggPCBtaW4pIHtcclxuXHRcdFx0dmFyIHRlbXAgPSBtaW47XHJcblx0XHRcdG1pbiA9IG1heDtcclxuXHRcdFx0bWF4ID0gdGVtcDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKHZhbHVlLCBtYXgpKTtcclxuXHR9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tYXRoVXRpbHMgPSBtYXRoVXRpbHM7IiwibGV0IG5vaXNlQ29uZmlnID0ge1xyXG5cdGJhc2VDb2xvcjogWyAwLCAwLCAwLCAxMjUgXSwgXHJcblx0bm9pc2U6IFtcclxuXHRcdHtcclxuXHRcdFx0Y29sb3I6IFsgMjU1LCAyNTUsIDI1NSwgMjU1IF0sIFxyXG5cdFx0XHRhdHRlbnVhdGlvbjogMS41LCBcclxuXHRcdFx0cm91Z2huZXNzOiAyLFxyXG5cdFx0XHRudW1PY3RhdmVzOiA0LFxyXG5cdFx0XHRzdGFydGluZ09jdGF2ZTogMlxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0Y29sb3I6IFsgMCwgMCwgMCwgMCBdLCBcclxuXHRcdFx0YXR0ZW51YXRpb246IDEuNSwgXHJcblx0XHRcdHJvdWdobmVzczogNixcclxuXHRcdFx0bnVtT2N0YXZlczogNCxcclxuXHRcdFx0c3RhcnRpbmdPY3RhdmU6IDVcclxuXHRcdH1cdFx0XHRcclxuXHRdXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vaXNlQ29uZmlnOyIsIi8vIGVhc2UgY3VydmVcclxudmFyIGZhZGUgPSBmdW5jdGlvbih0KVxyXG57XHJcblx0cmV0dXJuIHQgKiB0ICogdCAqICh0ICogKHQgKiA2IC0gMTUpICsgMTApO1xyXG59O1xyXG5cclxuLy8gbGluZWFyIGludGVycG9sYXRpb25cclxudmFyIG1peCA9IGZ1bmN0aW9uKGEsIGIsIHQpXHJcbntcclxuXHRyZXR1cm4gKDEgLSB0KSAqIGEgKyB0ICogYjtcclxufTtcclxudmFyIGdyYWQzID0gW1sxLCAxLCAwXSwgWy0xLCAxLCAwXSwgWzEsIC0xLCAwXSwgWy0xLCAtMSwgMF0sIFsxLCAwLCAxXSwgWy0xLCAwLCAxXSwgWzEsIDAsIC0xXSwgWy0xLCAwLCAtMV0sIFswLCAxLCAxXSwgWzAsIC0xLCAxXSwgWzAsIDEsIC0xXSwgWzAsIC0xLCAtMV1dO1xyXG5cclxuLy8gYSBzcGVjaWFsIGRvdCBwcm9kdWN0IGZ1bmN0aW9uIHVzZWQgaW4gcGVybGluIG5vaXNlIGNhbGN1bGF0aW9uc1xyXG52YXIgcGVybGluRG90ID0gZnVuY3Rpb24oZywgeCwgeSwgeilcclxue1xyXG5cdHJldHVybiBnWzBdICogeCArIGdbMV0gKiB5ICsgZ1syXSAqIHo7XHJcbn07XHRcclxuXHJcbnZhciBOb2lzZUdlbmVyYXRvciA9IGZ1bmN0aW9uKG51bU9jdGF2ZXMsIGF0dGVudWF0aW9uLCByb3VnaG5lc3MsIHN0YXJ0aW5nT2N0YXZlKVxyXG57XHJcblx0dmFyIHAgPSBbXTtcclxuXHRmb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgaSsrKVxyXG5cdHtcclxuXHRcdHBbaV0gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTYpO1xyXG5cdH1cclxuXHJcblx0Ly8gVG8gcmVtb3ZlIHRoZSBuZWVkIGZvciBpbmRleCB3cmFwcGluZywgZG91YmxlIHRoZSBwZXJtdXRhdGlvbiB0YWJsZSBsZW5ndGhcclxuXHR2YXIgcGVybSA9IFtdO1xyXG5cdGZvciAoaSA9IDA7IGkgPCA1MTI7IGkrKylcclxuXHR7XHJcblx0XHRwZXJtW2ldID0gcFtpICYgMjU1XTtcclxuXHR9XHJcblxyXG5cclxuICAgIHZhciBuID0gZnVuY3Rpb24oeCwgeSwgeilcclxuXHR7XHJcblx0XHQvLyBGaW5kIHVuaXQgZ3JpZCBjZWxsIGNvbnRhaW5pbmcgcG9pbnRcclxuXHRcdHZhciBYID0gTWF0aC5mbG9vcih4KTtcclxuXHRcdHZhciBZID0gTWF0aC5mbG9vcih5KTtcclxuXHRcdHZhciBaID0gTWF0aC5mbG9vcih6KTtcclxuXHRcdFxyXG5cdFx0Ly8gR2V0IHJlbGF0aXZlIHh5eiBjb29yZGluYXRlcyBvZiBwb2ludCB3aXRoaW4gdGhhdCBjZWxsXHJcblx0XHR4ID0geCAtIFg7XHJcblx0XHR5ID0geSAtIFk7XHJcblx0XHR6ID0geiAtIFo7XHJcblx0XHRcclxuXHRcdC8vIFdyYXAgdGhlIGludGVnZXIgY2VsbHMgYXQgMjU1XHJcblx0XHRYICY9IDI1NTtcclxuXHRcdFkgJj0gMjU1O1xyXG5cdFx0WiAmPSAyNTU7XHJcblx0XHRcclxuXHRcdC8vIENhbGN1bGF0ZSBhIHNldCBvZiBlaWdodCBoYXNoZWQgZ3JhZGllbnQgaW5kaWNlc1xyXG5cdFx0dmFyIGdpMDAwID0gcGVybVtYICsgcGVybVtZICsgcGVybVtaXV1dICUgMTI7XHJcblx0XHR2YXIgZ2kwMDEgPSBwZXJtW1ggKyBwZXJtW1kgKyBwZXJtW1ogKyAxXV1dICUgMTI7XHJcblx0XHR2YXIgZ2kwMTAgPSBwZXJtW1ggKyBwZXJtW1kgKyAxICsgcGVybVtaXV1dICUgMTI7XHJcblx0XHR2YXIgZ2kwMTEgPSBwZXJtW1ggKyBwZXJtW1kgKyAxICsgcGVybVtaICsgMV1dXSAlIDEyO1xyXG5cdFx0dmFyIGdpMTAwID0gcGVybVtYICsgMSArIHBlcm1bWSArIHBlcm1bWl1dXSAlIDEyO1xyXG5cdFx0dmFyIGdpMTAxID0gcGVybVtYICsgMSArIHBlcm1bWSArIHBlcm1bWiArIDFdXV0gJSAxMjtcclxuXHRcdHZhciBnaTExMCA9IHBlcm1bWCArIDEgKyBwZXJtW1kgKyAxICsgcGVybVtaXV1dICUgMTI7XHJcblx0XHR2YXIgZ2kxMTEgPSBwZXJtW1ggKyAxICsgcGVybVtZICsgMSArIHBlcm1bWiArIDFdXV0gJSAxMjtcclxuXHRcdFxyXG5cdFx0Ly8gQ2FsY3VsYXRlIG5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSBlYWNoIG9mIHRoZSBlaWdodCBjb3JuZXJzXHJcblx0XHR2YXIgbjAwMCA9IHBlcmxpbkRvdChncmFkM1tnaTAwMF0sIHgsIHksIHopO1xyXG5cdFx0dmFyIG4xMDAgPSBwZXJsaW5Eb3QoZ3JhZDNbZ2kxMDBdLCB4IC0gMSwgeSwgeik7XHJcblx0XHR2YXIgbjAxMCA9IHBlcmxpbkRvdChncmFkM1tnaTAxMF0sIHgsIHkgLSAxLCB6KTtcclxuXHRcdHZhciBuMTEwID0gcGVybGluRG90KGdyYWQzW2dpMTEwXSwgeCAtIDEsIHkgLSAxLCB6KTtcclxuXHRcdHZhciBuMDAxID0gcGVybGluRG90KGdyYWQzW2dpMDAxXSwgeCwgeSwgeiAtIDEpO1xyXG5cdFx0dmFyIG4xMDEgPSBwZXJsaW5Eb3QoZ3JhZDNbZ2kxMDFdLCB4IC0gMSwgeSwgeiAtIDEpO1xyXG5cdFx0dmFyIG4wMTEgPSBwZXJsaW5Eb3QoZ3JhZDNbZ2kwMTFdLCB4LCB5IC0gMSwgeiAtIDEpO1xyXG5cdFx0dmFyIG4xMTEgPSBwZXJsaW5Eb3QoZ3JhZDNbZ2kxMTFdLCB4IC0gMSwgeSAtIDEsIHogLSAxKTtcclxuXHRcdFxyXG5cdFx0Ly8gQ29tcHV0ZSB0aGUgZWFzZSBjdXJ2ZSB2YWx1ZSBmb3IgZWFjaCBvZiB4LCB5LCB6XHJcblx0XHR2YXIgdSA9IGZhZGUoeCk7XHJcblx0XHR2YXIgdiA9IGZhZGUoeSk7XHJcblx0XHR2YXIgdyA9IGZhZGUoeik7XHJcblx0XHRcclxuXHRcdC8vIEludGVycG9sYXRlIChhbG9uZyB4KSB0aGUgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggb2YgdGhlIGNvcm5lcnNcclxuXHRcdHZhciBueDAwID0gbWl4KG4wMDAsIG4xMDAsIHUpO1xyXG5cdFx0dmFyIG54MDEgPSBtaXgobjAwMSwgbjEwMSwgdSk7XHJcblx0XHR2YXIgbngxMCA9IG1peChuMDEwLCBuMTEwLCB1KTtcclxuXHRcdHZhciBueDExID0gbWl4KG4wMTEsIG4xMTEsIHUpO1xyXG5cdFx0XHJcblx0XHQvLyBJbnRlcnBvbGF0ZSB0aGUgZm91ciByZXN1bHRzIGFsb25nIHlcclxuXHRcdHZhciBueHkwID0gbWl4KG54MDAsIG54MTAsIHYpO1xyXG5cdFx0dmFyIG54eTEgPSBtaXgobngwMSwgbngxMSwgdik7XHJcblx0XHRcclxuXHRcdC8vIEludGVycG9sYXRlIHRoZSBsYXN0IHR3byByZXN1bHRzIGFsb25nIHpcclxuXHRcdHJldHVybiBtaXgobnh5MCwgbnh5MSwgdyk7XHJcblx0fTtcclxuXHJcblx0dGhpcy5ub2lzZSA9IGZ1bmN0aW9uICh4LCB5LCB6KVxyXG5cdHtcclxuXHRcdHZhciBhID0gTWF0aC5wb3coYXR0ZW51YXRpb24sIC1zdGFydGluZ09jdGF2ZSk7XHJcblx0XHR2YXIgZiA9IE1hdGgucG93KHJvdWdobmVzcywgc3RhcnRpbmdPY3RhdmUpO1xyXG5cdFx0dmFyIG0gPSAwO1xyXG5cdFx0Zm9yICh2YXIgaSA9IHN0YXJ0aW5nT2N0YXZlOyBpIDwgbnVtT2N0YXZlcyArIHN0YXJ0aW5nT2N0YXZlOyBpKyspXHJcblx0XHR7XHJcblx0XHRcdG0gKz0gbih4ICogZiwgeSAqIGYsIHogKiBmKSAqIGE7XHJcblx0XHRcdGEgLz0gYXR0ZW51YXRpb247XHJcblx0XHRcdGYgKj0gcm91Z2huZXNzO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG0gLyBudW1PY3RhdmVzO1xyXG5cdH07XHRcdFxyXG59O1xyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVUZXh0dXJlKHNpemUsIGRhdGEpIHtcclxuXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblx0Y2FudmFzLndpZHRoID0gY2FudmFzLmhlaWdodCA9IHNpemU7XHJcblx0dmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHR2YXIgaW1hZ2VEYXRhT2JqZWN0ID0gY29udGV4dC5jcmVhdGVJbWFnZURhdGEoc2l6ZSwgc2l6ZSk7XHJcblx0dmFyIGltYWdlRGF0YSA9IGltYWdlRGF0YU9iamVjdC5kYXRhO1xyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZSAqIHNpemUgKiA0OyBpICs9IDQpXHJcblx0e1xyXG5cdFx0aW1hZ2VEYXRhW2ldID0gZGF0YS5iYXNlQ29sb3JbMF07XHJcblx0XHRpbWFnZURhdGFbaSArIDFdID0gZGF0YS5iYXNlQ29sb3JbMV07XHJcblx0XHRpbWFnZURhdGFbaSArIDJdID0gZGF0YS5iYXNlQ29sb3JbMl07XHJcblx0XHRpbWFnZURhdGFbaSArIDNdID0gZGF0YS5iYXNlQ29sb3JbM107XHJcblx0fVxyXG5cdGZvciAoaSA9IDA7IGkgPCBkYXRhLm5vaXNlLmxlbmd0aDsgaSsrKVxyXG5cdHtcclxuXHRcdHZhciBrID0gZGF0YS5ub2lzZVtpXTtcclxuXHRcdHZhciBuID0gbmV3IE5vaXNlR2VuZXJhdG9yKGsubnVtT2N0YXZlcywgay5hdHRlbnVhdGlvbiwgay5yb3VnaG5lc3MsIGsuc3RhcnRpbmdPY3RhdmUpO1xyXG5cdFx0dmFyIHAgPSAwO1xyXG5cdFx0Zm9yICh2YXIgeSA9IDA7IHkgPCBzaXplOyB5KyspXHJcblx0XHR7XHJcblx0XHRcdGZvciAodmFyIHggPSAwOyB4IDwgc2l6ZTsgeCsrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gZ2VuZXJhdGUgbm9pc2UgYXQgY3VycmVudCB4IGFuZCB5IGNvb3JkaW5hdGVzICh6IGlzIHNldCB0byAwKVxyXG5cdFx0XHRcdHZhciB2ID0gTWF0aC5hYnMobi5ub2lzZSh4IC8gc2l6ZSwgeSAvIHNpemUsIDApKTtcclxuXHRcdFx0XHRmb3IgKHZhciBjID0gMDsgYyA8IDM7IGMrKywgcCsrKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGltYWdlRGF0YVtwXSA9IE1hdGguZmxvb3IoaW1hZ2VEYXRhW3BdICsgdiAqIGsuY29sb3JbY10gKiAgay5jb2xvclszXSAvIDI1NSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHArKztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRjb250ZXh0LnB1dEltYWdlRGF0YShpbWFnZURhdGFPYmplY3QsIDAsIDApO1xyXG5cdHJldHVybiBjYW52YXM7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdlbmVyYXRlVGV4dHVyZTsiLCJ2YXIgYnRuID0ge1xyXG4gICAgeDogMjUsXHJcbiAgICB5OiAyNSxcclxuICAgIHc6IDEyNSxcclxuICAgIGg6IDUwLFxyXG4gICAgZGlzcGxheTogdHJ1ZSxcclxuICAgIGZvbnRTaXplOiAxNSxcclxuICAgIGJnOiAnIzY2NjY2NicsXHJcbiAgICBiZ0FjdGl2ZTogJyNhYWFhYWEnLFxyXG4gICAgY29sb3I6ICcjMzMzMzMzJyxcclxuICAgIGNvbG9yQWN0aXZlOiAnI2RkZGRkZCcsXHJcbiAgICBjb250ZW50OiAnRGlzcGxheSBPdmVybGF5J1xyXG59O1xyXG5cclxuYnRuLnRleHRYID0gYnRuLnggKyAxMDtcclxuYnRuLnRleHRZID0gYnRuLnkgKyAoIGJ0bi5oIC8gMiApO1xyXG5cclxuZnVuY3Rpb24gZHJhd092ZXJsYXlTd2l0Y2hCdXR0b24oIGN0eCApIHtcclxuICAgIGN0eC5maWxsU3R5bGUgPSBidG4uZGlzcGxheU92ZXJsYXkgPT09IHRydWUgPyBidG4uYmdBY3RpdmUgOiBidG4uYmc7XHJcbiAgICBjdHguZmlsbFJlY3QoIGJ0bi54LCBidG4ueSwgYnRuLncsIGJ0bi5oICk7XHJcbiAgICBjdHguZmlsbFN0eWxlID0gYnRuLmRpc3BsYXlPdmVybGF5ID09PSB0cnVlID8gYnRuLmNvbG9yQWN0aXZlIDogYnRuLmNvbG9yO1xyXG4gICAgY3R4LmZvbnQgPSBidG4uZm9udFNpemUgKyAncHggVGFob21hJztcclxuICAgIGN0eC5maWxsVGV4dCggYnRuLmNvbnRlbnQsIGJ0bi50ZXh0WCwgYnRuLnRleHRZICk7XHJcbn07XHJcblxyXG5cclxudmFyIG92ZXJsYXlDZmcgPSB7XHJcbiAgICBkaXNwbGF5T3ZlcmxheTogZmFsc2UsXHJcbiAgICBkaXNwbGF5TG9va1RhcmdldDogZmFsc2UsXHJcbiAgICBkaXNwbGF5Q2VudHJlTGluZXM6IGZhbHNlLFxyXG4gICAgZGlzcGxheUFuY2hvcnM6IGZhbHNlLFxyXG4gICAgZGlzcGxheUNvbnRyb2xQb2ludHM6IGZhbHNlLFxyXG4gICAgZGlzcGxheUh1bGxzOiBmYWxzZSxcclxuICAgIGRpc3BsYXlHbGFyZVNwaWtlczogZmFsc2UsXHJcbiAgICBkaXNwbGF5U3VuVG9TdGFnZTogZmFsc2VcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLm92ZXJsYXlCdG5DZmcgPSBidG47XHJcbm1vZHVsZS5leHBvcnRzLmRyYXdPdmVybGF5U3dpdGNoQnV0dG9uID0gZHJhd092ZXJsYXlTd2l0Y2hCdXR0b247XHJcbm1vZHVsZS5leHBvcnRzLm92ZXJsYXlDZmcgPSBvdmVybGF5Q2ZnOyIsInZhciBwcm9wb3J0aW9uYWxNZWFzdXJlcyA9IHtcclxuXHJcblx0c2V0TWVhc3VyZXM6IGZ1bmN0aW9uKCBiYXNlUmFkaXVzICkge1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHIyOiBiYXNlUmFkaXVzIC8gMixcclxuXHRcdFx0cjQ6IGJhc2VSYWRpdXMgLyA0LFxyXG5cdFx0XHRyODogYmFzZVJhZGl1cyAvIDgsXHJcblx0XHRcdHIxNjogYmFzZVJhZGl1cyAvIDE2LFxyXG5cdFx0XHRyMzI6IGJhc2VSYWRpdXMgLyAzMixcclxuXHRcdFx0cjY0OiBiYXNlUmFkaXVzIC8gNjQsXHJcblx0XHRcdHIxMjg6IGJhc2VSYWRpdXMgLyAxMjgsXHJcblxyXG5cdFx0XHRyMzogYmFzZVJhZGl1cyAvIDMsXHJcblx0XHRcdHI2OiBiYXNlUmFkaXVzIC8gNixcclxuXHRcdFx0cjEyOiBiYXNlUmFkaXVzIC8gMTIsXHJcblx0XHRcdHIyNDogYmFzZVJhZGl1cyAvIDI0LFxyXG5cclxuXHRcdFx0cjU6IGJhc2VSYWRpdXMgLyA1LFxyXG5cdFx0XHRyMTA6IGJhc2VSYWRpdXMgLyAxMFxyXG5cdFx0fVxyXG5cdFxyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wb3J0aW9uYWxNZWFzdXJlczsiLCIvLyBzaW5lIHdhdmUgbW9kdWxhdGlvblxyXG5cclxudmFyIHR3b1BpID0gcmVxdWlyZSggJy4vdHJpZ29ub21pY1V0aWxzLmpzJyApLnRyaWdvbm9taWNVdGlscy50d29QaTtcclxuXHJcbnZhciBzaW5lV2F2ZSA9IHtcclxuXHRjb3VudDogMCxcclxuXHRpdGVyYXRpb25zOiB0d29QaSAvIDc1LFxyXG5cdHZhbDogMCxcclxuXHRpbnZWYWw6IDBcclxufVxyXG5cclxuLy8gc2luZVdhdmUuZ2V0Q2xvY2sgPSBmdW5jdGlvbiggdG90YWwsIGN1cnJlbnQgKSB7XHJcbi8vIFx0dGhpcy5pdGVyYXRpb25zID0gKHR3b1BpIC8gdG90YWwpIC8gMjtcclxuLy8gXHR0aGlzLmNvdW50ID0gY3VycmVudDtcclxuLy8gfVxyXG5cclxuc2luZVdhdmUubW9kdWxhdG9yID0gZnVuY3Rpb24oKSB7XHJcblx0dGhpcy52YWwgPSBNYXRoLnNpbiggdGhpcy5jb3VudCApIC8gMiArIDAuNTtcclxuICAgIHRoaXMuaW52VmFsID0gMSAtIHRoaXMudmFsO1xyXG4gICAgdGhpcy5jb3VudCArPSB0aGlzLml0ZXJhdGlvbnM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNpbmVXYXZlID0gc2luZVdhdmU7IiwidmFyIHR3b1BpID0gcmVxdWlyZSgnLi90cmlnb25vbWljVXRpbHMuanMnKS50cmlnb25vbWljVXRpbHMudHdvUGk7XHJcblxyXG52YXIgbnVtUmF5cyA9IDI0O1xyXG52YXIgcmF5U2l6ZSA9IDMwMDtcclxuXHJcbnZhciBzdW5Db3JvbmEgPSB7XHJcbiAgICBudW1SYXlzOiBudW1SYXlzLFxyXG4gICAgbnVtUmF5c0RvdWJsZTogbnVtUmF5cyAqIDIsXHJcbiAgICByYXlTaXplOiByYXlTaXplLFxyXG4gICAgcmF5U2l6ZURpZmZNYXg6IDEwMCxcclxuICAgIHJheVNwcmVhZDogMC4wMjUsXHJcbiAgICBwaGk6IDBcclxufVxyXG5cclxuc3VuQ29yb25hLnJlbmRlciA9IGZ1bmN0aW9uKCB4LCB5LCBzaW5lV2F2ZSwgaW52U2luZVdhdmUsIGN0eCApIHtcclxuXHJcbiAgICBjb25zdCB3YXZlID0gc2luZVdhdmU7XHJcbiAgICBjb25zdCBpbnZXYXZlID0gaW52U2luZVdhdmU7XHJcblxyXG4gICAgY29uc3QgbnVtUmF5cyA9IHRoaXMubnVtUmF5c0RvdWJsZTtcclxuICAgIGNvbnN0IGJhc2VSID0gdGhpcy5yYXlCYXNlUmFkaXVzIC8gMztcclxuICAgIGNvbnN0IHJheVNpemUgPSB0aGlzLnJheVNpemU7XHJcbiAgICBjb25zdCByYXlTcHJlYWQgPSB0aGlzLnJheVNwcmVhZDtcclxuICAgIGNvbnN0IHJheURpZmYgPSB0aGlzLnJheVNpemVEaWZmTWF4O1xyXG5cclxuICAgIC8vIHN0cmFpZ2h0IHJheXNcclxuICAgIGxldCBjYWxjdWxhdGVSYXkgPSAwO1xyXG5cclxuICAgIC8vIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIC8vIGZvciAoIGxldCBpID0gMDsgaSA8IG51bVJheXM7IGkrKyApIHtcclxuICAgIC8vICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvICggbnVtUmF5cyApICkgKyB0aGlzLnBoaTtcclxuICAgIC8vICAgICBpZiAoIGkgJSAyID09IDAgKSB7XHJcbiAgICAvLyAgICAgICAgIGNhbGN1bGF0ZVJheSA9IGJhc2VSICsgcmF5U2l6ZSArICggcmF5RGlmZiAqICggaSAlIDQgPT0gMCA/IGludldhdmUgOiB3YXZlICkgKTtcclxuICAgIC8vICAgICAgICAgY3R4LmxpbmVUbyhcclxuICAgIC8vICAgICAgICAgICAgIHggKyBNYXRoLmNvcyggYWxwaGEgKSAqIGNhbGN1bGF0ZVJheSxcclxuICAgIC8vICAgICAgICAgICAgIHkgKyBNYXRoLnNpbiggYWxwaGEgKSAqIGNhbGN1bGF0ZVJheVxyXG4gICAgLy8gICAgICAgICApO1xyXG5cclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBsZXQgYXJjTW9kID0gcmF5U3ByZWFkICogd2F2ZTtcclxuICAgIC8vICAgICAgICAgY3R4LmFyYyggeCwgeSwgYmFzZVIsIGFscGhhIC0gcmF5U3ByZWFkIC0gYXJjTW9kLCBhbHBoYSArIHJheVNwcmVhZCArIGFyY01vZCApO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyB9XHJcbiAgICAvLyBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAvLyBjdHguc3Ryb2tlKCk7XHJcbiAgICAvLyBlbmQgc3RyYWlnaHQgcmF5c1xyXG5cclxuICAgIC8vIGN1cnZlZCByYXlzXHJcbiAgICBsZXQgdGVzdENhbGMgPSAwO1xyXG4gICAgbGV0IGZpcHBlciA9IGZhbHNlO1xyXG5cclxuICAgIGN0eC5saW5lQ2FwID0gJ3JvdW5kJztcclxuICAgIFxyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbnVtUmF5czsgaSsrICkge1xyXG4gICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzICkgKSArIHRoaXMucGhpO1xyXG4gICAgICAgIGxldCBhbHBoYTIgPSB0d29QaSAqICggKCBpICsgMSApIC8gKCBudW1SYXlzICkgKSArIHRoaXMucGhpO1xyXG5cclxuICAgICAgICB0ZXN0Q2FsYyA9IGJhc2VSICsgcmF5U2l6ZSArICggcmF5RGlmZiAqICggZmlwcGVyID09IHRydWUgPyBpbnZXYXZlIDogd2F2ZSApICk7XHJcblxyXG4gICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgICAgICB4ICsgTWF0aC5jb3MoIGFscGhhICkgKiB0ZXN0Q2FsYyxcclxuICAgICAgICAgICAgICAgIHkgKyBNYXRoLnNpbiggYWxwaGEgKSAqIHRlc3RDYWxjLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIGN0eC5xdWFkcmF0aWNDdXJ2ZVRvKFxyXG4gICAgICAgICAgICAgICAgeCArIE1hdGguY29zKCBhbHBoYSApICogYmFzZVIsXHJcbiAgICAgICAgICAgICAgICB5ICsgTWF0aC5zaW4oIGFscGhhICkgKiBiYXNlUixcclxuICAgICAgICAgICAgICAgIHggKyBNYXRoLmNvcyggYWxwaGEyICkgKiB0ZXN0Q2FsYyxcclxuICAgICAgICAgICAgICAgIHkgKyBNYXRoLnNpbiggYWxwaGEyICkgKiB0ZXN0Q2FsYyxcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpcHBlciA9ICFmaXBwZXI7XHJcbiAgICB9XHJcbiAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICBjdHguZmlsbCgpO1xyXG4gICAgLy8gY3R4LnN0cm9rZSgpO1xyXG4gICAgLy8gZW5kIGN1cnZlZCByYXlzXHJcblxyXG4gICAgdGhpcy5waGkgKz0gMC4wMDU7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1bkNvcm9uYTsiLCJ2YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgdHdvUGkgPSB0cmlnLnR3b1BpO1xyXG5cclxudmFyIHJhbmRJID0gcmVxdWlyZSgnLi9tYXRoVXRpbHMuanMnKS5tYXRoVXRpbHMucmFuZG9tSW50ZWdlcjtcclxudmFyIG51bXNwaWtlID0gODtcclxudmFyIHNwaWtlU2l6ZSA9IDE2MDA7XHJcblxyXG52YXIgc3VuU3Bpa2VzID0ge1xyXG4gICAgXHJcbiAgICBudW1zcGlrZTogbnVtc3Bpa2UsXHJcbiAgICByb3RhdGlvbjogKCAyICogTWF0aC5QSSAvIG51bXNwaWtlICksXHJcbiAgICBoYWxmUm90YXRpb246ICggMiAqIE1hdGguUEkgLyBudW1zcGlrZSApIC8gMixcclxuXHJcbiAgICByZW5kZXJDZmc6IHtcclxuICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgY29udGV4dDogbnVsbCxcclxuICAgICAgICBkZWJ1Z0NmZzogbnVsbFxyXG4gICAgfSxcclxuXHJcbiAgICBkaXNwbGF5Q2ZnOiB7XHJcbiAgICAgICAgZ2xhcmVTcGlrZXNSYW5kb206IHtcclxuICAgICAgICAgICAgaXNSZW5kZXJlZDogZmFsc2UsXHJcbiAgICAgICAgICAgIGlzRGlzcGxheWVkOiBmYWxzZSxcclxuICAgICAgICAgICAgY2FudmFzOiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgICB5OiAwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBnbGFyZVNwaWtlczoge1xyXG4gICAgICAgICAgICBpc1JlbmRlcmVkOiBmYWxzZSxcclxuICAgICAgICAgICAgaXNEaXNwbGF5ZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBjYW52YXM6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIHg6IDAsXHJcbiAgICAgICAgICAgIHk6IDBcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuXHJcbiAgICBnbGFyZVNwaWtlT3B0aW9uczoge1xyXG4gICAgICAgIHg6IDE1MCxcclxuICAgICAgICB5OiAxNTAsXHJcbiAgICAgICAgcjogNTAsXHJcbiAgICAgICAgbWFqb3JSYXlMZW46IDUwLFxyXG4gICAgICAgIG1ham9yUmF5V2lkdGg6IDAuNSxcclxuICAgICAgICBtaW5vclJheVdpZHRoOiAwLjUsXHJcbiAgICAgICAgYW5nbGU6IE1hdGguUEkgLyAwLFxyXG4gICAgICAgIGNvdW50OiAxNixcclxuICAgICAgICBibHVyOiAxNVxyXG4gICAgfSxcclxuXHJcbiAgICBnbGFyZVNwaWtlUmFuZG9tT3B0aW9uczoge1xyXG4gICAgICAgIHg6IDE1MCxcclxuICAgICAgICB5OiAxNTAsXHJcbiAgICAgICAgcjogNTAsXHJcbiAgICAgICAgbWFqb3JSYXlMZW46IDUwLFxyXG4gICAgICAgIG1ham9yUmF5V2lkdGg6IDAuNSxcclxuICAgICAgICBtaW5vclJheVdpZHRoOiAwLjUsXHJcbiAgICAgICAgYW5nbGU6IE1hdGguUEkgLyAwLFxyXG4gICAgICAgIGNvdW50OiAxNixcclxuICAgICAgICBibHVyOiAxNVxyXG4gICAgfSxcclxuXHJcbiAgICBmbGFyZU9wdGlvbnM6IHtcclxuICAgICAgICBjb250ZXh0OiBudWxsLFxyXG4gICAgICAgIGNhbnZhczogbnVsbCxcclxuICAgICAgICB4OiAxNTAsXHJcbiAgICAgICAgeTogMTUwLFxyXG4gICAgICAgIHI6IDUwLFxyXG4gICAgICAgIHJheUxlbjogODAwLFxyXG4gICAgICAgIGZsYXJlV2lkdGg6IDAuMSxcclxuICAgICAgICBhbmdsZTogTWF0aC5QSSAvIDAsXHJcbiAgICAgICAgY291bnQ6IDYsXHJcbiAgICAgICAgYmx1cjogOFxyXG4gICAgfSxcclxuXHJcbiAgICBmbGFyZVJlbmRlckNvdW50OiAwLFxyXG4gICAgZmxhcmVEaXNwbGF5Q291bnQ6IDAsXHJcblxyXG4gICAgZ2xhcmVTcGlrZUNvbnRyb2xJbnB1dENmZzoge1xyXG5cclxuICAgICAgICByOiB7IGlkOiAnc3Bpa2VSYWRpdXNJbnB1dCcsIG1pbjogMCwgbWF4OiAwLCBjdXJyOiAwLCByZXY6IGZhbHNlIH0sXHJcbiAgICAgICAgbWFqb3JSYXlMZW46IHsgaWQ6ICdzcGlrZU1ham9yU2l6ZScsIG1pbjogMCwgbWF4OiAyMDAwLCBjdXJyOiAwLCByZXY6IGZhbHNlIH0sXHJcbiAgICAgICAgbWlub3JSYXlMZW46IHsgaWQ6ICdzcGlrZU1pbm9yU2l6ZScsIG1pbjogMCwgbWF4OiA1MDAsIGN1cnI6IDAsIHJldjogZmFsc2UgfSxcclxuICAgICAgICBtYWpvclJheVdpZHRoOiB7aWQ6ICdzcGlrZU1ham9yV2lkdGgnLCAgbWluOiAwLCBtYXg6IDIsIGN1cnI6IDAsIHJldjogdHJ1ZSB9LFxyXG4gICAgICAgIG1pbm9yUmF5V2lkdGg6IHsgaWQ6ICdzcGlrZU1pbm9yV2lkdGgnLCBtaW46IDAsIG1heDogMiwgY3VycjogMCwgcmV2OiB0cnVlIH0sXHJcbiAgICAgICAgY291bnQ6IHsgaWQ6ICdzcGlrZUNvdW50SW5wdXQnLCBtaW46IDQsIG1heDogMTAwLCBjdXJyOiAwLCByZXY6IGZhbHNlIH0sXHJcbiAgICAgICAgYmx1cjogeyBpZDogJ3NwaWtlQmx1ckFtb3VudCcsIG1pbjogMCwgbWF4OiAxMDAsIGN1cnI6IDEwLCByZXY6IGZhbHNlIH1cclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGluaXRHbGFyZVNwaWtlQ29udHJvbElucHV0czogZnVuY3Rpb24oIHN0YWdlICkge1xyXG5cclxuICAgICAgICBsZXQgdGhpc0NmZyA9IHRoaXMuZ2xhcmVTcGlrZUNvbnRyb2xJbnB1dENmZztcclxuICAgICAgICBsZXQgY3Vyck9wdHMgPSB0aGlzLmdsYXJlU3Bpa2VPcHRpb25zO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLnIuY3VyciA9IGN1cnJPcHRzLnI7XHJcbiAgICAgICAgdGhpc0NmZy5yLm1heCA9IHRoaXNDZmcuci5jdXJyICogMjtcclxuXHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcuci5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcuci5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcuci5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5yLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLnByb3AoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5yLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5yLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLnIuY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLnIuY3VyciApO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLm1ham9yUmF5TGVuLmN1cnIgPSBjdXJyT3B0cy5tYWpvclJheUxlbjtcclxuXHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcubWFqb3JSYXlMZW4uaWQgKVxyXG4gICAgICAgICAgICAuYXR0cigge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLm1ham9yUmF5TGVuLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5tYWpvclJheUxlbi5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5tYWpvclJheUxlbi5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcubWFqb3JSYXlMZW4ubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1ham9yUmF5TGVuLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1ham9yUmF5TGVuLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLmNsb3Nlc3QoICcuY29udHJvbC0tcGFuZWxfX2l0ZW0nIClcclxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3V0cHV0JyApXHJcbiAgICAgICAgICAgICAgICAuaHRtbCggdGhpc0NmZy5tYWpvclJheUxlbi5jdXJyICk7XHJcblxyXG4gICAgICAgIHRoaXNDZmcubWlub3JSYXlMZW4uY3VyciA9IGN1cnJPcHRzLm1pbm9yUmF5TGVuO1xyXG5cclxuICAgICAgICAkKCAnIycrdGhpc0NmZy5taW5vclJheUxlbi5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IHRoaXNDZmcubWlub3JSYXlMZW4ubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1pbm9yUmF5TGVuLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLm1pbm9yUmF5TGVuLmN1cnJcclxuICAgICAgICAgICAgICAgIH0gKVxyXG4gICAgICAgICAgICAgICAgLnByb3AoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5taW5vclJheUxlbi5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcubWlub3JSYXlMZW4ubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWlub3JSYXlMZW4uY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAuY2xvc2VzdCggJy5jb250cm9sLS1wYW5lbF9faXRlbScgKVxyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdvdXRwdXQnIClcclxuICAgICAgICAgICAgICAgIC5odG1sKCB0aGlzQ2ZnLm1pbm9yUmF5TGVuLmN1cnIgKTtcclxuXHJcbiAgICAgICAgdGhpc0NmZy5jb3VudC5jdXJyID0gY3Vyck9wdHMuY291bnQ7XHJcblxyXG4gICAgICAgICQoICcjJyt0aGlzQ2ZnLmNvdW50LmlkIClcclxuICAgICAgICAgICAgLmF0dHIoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5jb3VudC5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgJ21heCc6IHRoaXNDZmcuY291bnQubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcuY291bnQuY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLmNvdW50Lm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5jb3VudC5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZhbHVlJzogdGhpc0NmZy5jb3VudC5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAgICAgLmh0bWwoIHRoaXNDZmcuY291bnQuY3VyciApO1xyXG5cclxuICAgICAgICB0aGlzQ2ZnLmJsdXIuY3VyciA9IGN1cnJPcHRzLmJsdXI7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdjdXJyT3B0cy5ibHVyOiAnLCBjdXJyT3B0cy5ibHVyICk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICd0aGlzQ2ZnLmJsdXIuY3VycjogJywgdGhpc0NmZy5ibHVyLmN1cnIgKTtcclxuICAgICAgICAkKCAnIycrdGhpc0NmZy5ibHVyLmlkIClcclxuICAgICAgICAgICAgLmF0dHIoIHtcclxuICAgICAgICAgICAgICAgICAgICAnbWluJzogdGhpc0NmZy5ibHVyLm1pbixcclxuICAgICAgICAgICAgICAgICAgICAnbWF4JzogdGhpc0NmZy5ibHVyLm1heCxcclxuICAgICAgICAgICAgICAgICAgICAndmFsdWUnOiB0aGlzQ2ZnLmJsdXIuY3VyclxyXG4gICAgICAgICAgICAgICAgfSApXHJcbiAgICAgICAgICAgICAgICAucHJvcCgge1xyXG4gICAgICAgICAgICAgICAgICAgICdtaW4nOiB0aGlzQ2ZnLmJsdXIubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLmJsdXIubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcuYmx1ci5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAgICAgLmh0bWwoIHRoaXNDZmcuYmx1ci5jdXJyICk7XHJcblxyXG4gICAgICAgIHRoaXNDZmcubWFqb3JSYXlXaWR0aC5jdXJyID0gY3Vyck9wdHMubWFqb3JSYXlXaWR0aCAqIHRoaXNDZmcubWFqb3JSYXlXaWR0aC5tYXg7XHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcubWFqb3JSYXlXaWR0aC5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IC10aGlzQ2ZnLm1ham9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1ham9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWFqb3JSYXlXaWR0aC5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IC10aGlzQ2ZnLm1ham9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1ham9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWFqb3JSYXlXaWR0aC5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAgICAgLmh0bWwoIHRoaXNDZmcubWFqb3JSYXlXaWR0aC5jdXJyICk7XHJcblxyXG4gICAgICAgIHRoaXNDZmcubWlub3JSYXlXaWR0aC5jdXJyID0gY3Vyck9wdHMubWlub3JSYXlXaWR0aCAqIHRoaXNDZmcubWlub3JSYXlXaWR0aC5tYXg7XHJcbiAgICAgICAgJCggJyMnK3RoaXNDZmcubWlub3JSYXlXaWR0aC5pZCApXHJcbiAgICAgICAgICAgIC5hdHRyKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IC10aGlzQ2ZnLm1pbm9yUmF5V2lkdGgubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWlub3JSYXlXaWR0aC5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5wcm9wKCB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ21pbic6IC10aGlzQ2ZnLm1pbm9yUmF5V2lkdGgubWluLFxyXG4gICAgICAgICAgICAgICAgICAgICdtYXgnOiB0aGlzQ2ZnLm1pbm9yUmF5V2lkdGgubWF4LFxyXG4gICAgICAgICAgICAgICAgICAgICd2YWx1ZSc6IHRoaXNDZmcubWlub3JSYXlXaWR0aC5jdXJyXHJcbiAgICAgICAgICAgICAgICB9IClcclxuICAgICAgICAgICAgICAgIC5jbG9zZXN0KCAnLmNvbnRyb2wtLXBhbmVsX19pdGVtJyApXHJcbiAgICAgICAgICAgICAgICAuZmluZCggJ291dHB1dCcgKVxyXG4gICAgICAgICAgICAgICAgLmh0bWwoIHRoaXNDZmcubWlub3JSYXlXaWR0aC5jdXJyICk7XHJcbiAgICB9LFxyXG5cclxuICAgIGNsZWFyUmVuZGVyQ3R4OiBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgcmVuZGVyQ2ZnID0gdGhpcy5yZW5kZXJDZmc7XHJcbiAgICAgICAgcmVuZGVyQ2ZnLmNvbnRleHQuY2xlYXJSZWN0KFxyXG4gICAgICAgICAgICAwLCAwLCByZW5kZXJDZmcuY2FudmFzLndpZHRoLCByZW5kZXJDZmcuY2FudmFzLmhlaWdodFxyXG5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuXHJcblxyXG52YXIgcmFuZG9tVyA9IFtdO1xyXG52YXIgcmFuZG9tSCA9IFtdO1xyXG5cclxuZm9yICh2YXIgaSA9IDEwMDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHJhbmRvbVcucHVzaCggcmFuZEkoIDEwMCwgMjAwICkgKTtcclxufVxyXG5cclxuZm9yICh2YXIgaSA9IDEwMDsgaSA+PSAwOyBpLS0pIHtcclxuICAgIHJhbmRvbUgucHVzaCggcmFuZEkoIDIwLCAxMDAgKSApO1xyXG59XHJcblxyXG5zdW5TcGlrZXMucmVuZGVyID0gZnVuY3Rpb24oIHgsIHksIGltZ2VDZmcsIGN0eCApIHtcclxuXHJcbiAgICBjb25zdCBpbWFnZSA9IGltZ2VDZmc7XHJcbiAgICBsZXQgY3VyclJvdGF0aW9uID0gdGhpcy5oYWxmUm90YXRpb247XHJcblxyXG4gICAgY3R4LnRyYW5zbGF0ZSggeCwgeSApO1xyXG5cclxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG51bXNwaWtlOyBpKysgKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnJvdGF0ZSggY3VyclJvdGF0aW9uICk7XHJcblxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIC8vIHNvdXJjZVxyXG4gICAgICAgICAgICBpbWFnZS5jYW52YXMsIGltYWdlLngsIGltYWdlLnksIGltYWdlLncsIGltYWdlLmgsXHJcbiAgICAgICAgICAgIC8vIGRlc3RpbmF0aW9uXHJcbiAgICAgICAgICAgIDAsIC1pbWFnZS5oIC8gMiwgaW1hZ2UudywgaW1hZ2UuaFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSggLWN1cnJSb3RhdGlvbiApO1xyXG4gICAgICAgIGN1cnJSb3RhdGlvbiArPSB0aGlzLnJvdGF0aW9uOyAgXHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGN0eC50cmFuc2xhdGUoIC14LCAteSApO1xyXG59XHJcblxyXG5zdW5TcGlrZXMucmVuZGVyUmFpbmJvd1NwaWtlcyA9IGZ1bmN0aW9uKCBvcHRpb25zLCBjb250ZXh0ICkge1xyXG5cclxuICAgIGNvbnN0IGN0eCA9IGNvbnRleHQ7XHJcbiAgICBjb25zdCBkZWJ1Z0NvbmZpZyA9IHRoaXMucmVuZGVyQ2ZnLmRlYnVnQ2ZnO1xyXG4gICAgY29uc3QgYmFzZU9wdHMgPSB0aGlzLmdsYXJlU3Bpa2VPcHRpb25zO1xyXG4gICAgY29uc3Qgb3B0cyA9IG9wdGlvbnM7XHJcbiAgICBjb25zb2xlLmxvZyggJ29wdHM6ICcsIG9wdHMgKTtcclxuICAgIC8vIGNvbmZpZ3VyYXRpb25cclxuICAgIGNvbnN0IHggPSBvcHRzLnggfHwgYmFzZU9wdHMueCB8fCBjdHgud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG9wdHMueSB8fCBiYXNlT3B0cy55O1xyXG4gICAgY29uc3QgYSA9IG9wdHMuYW5nbGUgfHwgYmFzZU9wdHMuYW5nbGU7XHJcbiAgICBjb25zdCBkID0gb3B0cy5kIHx8IGJhc2VPcHRzLmQgfHwgMjAwO1xyXG4gICAgY29uc3QgbnVtUmF5cyA9IG9wdHMuY291bnQgfHwgYmFzZU9wdHMuY291bnQgfHwgNDtcclxuICAgIGNvbnN0IG51bVJheXNNdWx0aXBsZSA9IG51bVJheXMgKiAyO1xyXG5cclxuICAgIGNvbnN0IGJhc2VSID0gb3B0cy5yIHx8IGJhc2VPcHRzLnIgfHwgMTUwO1xyXG4gICAgY29uc3QgY3VydmVSID0gb3B0cy5jdXJ2ZVIgfHwgYmFzZU9wdHMuY3VydmVSIHx8IGJhc2VSO1xyXG5cclxuICAgIGNvbnN0IGltYWdlID0gb3B0cy5pbWFnZUNmZztcclxuICAgIGNvbnN0IGltZ1NyYyA9IGltYWdlLnNyYztcclxuICAgIGxldCBhbXQgPSBudW1SYXlzO1xyXG4gICAgbGV0IHJvdGF0aW9uID0gKCAyICogTWF0aC5QSSAvIGFtdCApO1xyXG4gICAgLy8gbGV0IGhhbGZSb3RhdGlvbiA9ICggMiAqIE1hdGguUEkgLyBhbXQgKSAvIDI7XHJcbiAgICBsZXQgY3VyclJvdGF0aW9uID0gcm90YXRpb247XHJcbiAgICBsZXQgd2lkdGhTY2FsZSA9IGltYWdlLncgKiAyO1xyXG4gICAgbGV0IGhlaWdodFNjYWxlID0gaW1hZ2UuaCAqIDM7XHJcblxyXG4gICAgbGV0IGN1cnJCbGVuZCA9IGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb247XHJcblxyXG5cclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDAuNjtcclxuICAgIC8vIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnaHVlJztcclxuXHJcbiAgICBjdHgudHJhbnNsYXRlKCB4LCB5ICk7XHJcbiAgICBjdHgucm90YXRlKCAtYSApO1xyXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgYW10OyBpKysgKSB7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSggY3VyclJvdGF0aW9uICk7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xyXG4gICAgICAgIGN0eC5maWxsQ2lyY2xlKCAwLCAwLCAxMCApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIC8vIHNvdXJjZVxyXG4gICAgICAgICAgICBpbWdTcmMsIDAsIDAsIGltYWdlLncsIGltYWdlLmgsXHJcbiAgICAgICAgICAgIC8vIGRlc3RpbmF0aW9uXHJcbiAgICAgICAgICAgIGQsIC0oIGhlaWdodFNjYWxlLzIgKSwgd2lkdGhTY2FsZSwgaGVpZ2h0U2NhbGVcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5yb3RhdGUoIC1jdXJyUm90YXRpb24gKTtcclxuICAgICAgICBjdXJyUm90YXRpb24gKz0gcm90YXRpb247ICBcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGN0eC5yb3RhdGUoIGEgKTtcclxuICAgIGN0eC50cmFuc2xhdGUoIC14LCAteSApO1xyXG5cclxuICAgIGN0eC5nbG9iYWxBbHBoYSA9IDE7XHJcblxyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IGN1cnJCbGVuZDtcclxuXHJcbiAgICAvLyBvdXRwdXQgY29uZmlnIGZvciByZW5kZXJzXHJcbiAgICB0aGlzLmRpc3BsYXlDZmcucmFpbmJvd1NwaWtlcyA9IHtcclxuICAgICAgICB4OiB4IC0gKCBkICsgd2lkdGhTY2FsZSApLFxyXG4gICAgICAgIHk6IHkgLSAoIGQgKyB3aWR0aFNjYWxlICksIFxyXG4gICAgICAgIHc6ICggZCAqIDIgKSArICggd2lkdGhTY2FsZSAqIDIgKSxcclxuICAgICAgICBoOiAoIGQgKiAyICkgKyAoIHdpZHRoU2NhbGUgKiAyIClcclxuICAgIH1cclxufVxyXG5cclxuc3VuU3Bpa2VzLmNsZWFyQXNzZXRDYW52YXMgPSBmdW5jdGlvbiggY3R4LCBjYW52YXMgKSB7XHJcbiAgICBjdHguY2xlYXJSZWN0KCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQgKTtcclxufVxyXG5cclxuc3VuU3Bpa2VzLnJlbmRlckdsYXJlU3Bpa2VzID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XHJcblxyXG4gICAgY29uc3QgY3R4ID0gdGhpcy5yZW5kZXJDZmcuY29udGV4dDtcclxuICAgIGNvbnN0IGRlYnVnQ29uZmlnID0gdGhpcy5yZW5kZXJDZmcuZGVidWdDZmdcclxuICAgIGNvbnN0IG9wdHMgPSBvcHRpb25zIHx8IHRoaXMuZ2xhcmVTcGlrZU9wdGlvbnM7XHJcblxyXG4gICAgLy8gY29uZmlndXJhdGlvblxyXG4gICAgY29uc3QgeCA9IG9wdHMueCB8fCBjdHgud2lkdGggLyAyO1xyXG4gICAgY29uc3QgeSA9IG9wdHMueTtcclxuICAgIGNvbnN0IGEgPSBvcHRzLmFuZ2xlIHx8IDA7XHJcbiAgICBjb25zdCBudW1SYXlzID0gb3B0cy5jb3VudCB8fCA0O1xyXG4gICAgY29uc3QgbnVtUmF5c011bHRpcGxlID0gbnVtUmF5cyAqIDI7XHJcblxyXG4gICAgY29uc3QgYmFzZVIgPSBvcHRzLnIgfHwgMTUwO1xyXG4gICAgY29uc3QgY3VydmVSID0gb3B0cy5jdXJ2ZVIgfHwgYmFzZVI7XHJcblxyXG4gICAgY29uc3QgbWFqb3JSYXlMZW4gPSBiYXNlUiArIG9wdHMubWFqb3JSYXlMZW4gfHwgYmFzZVIgKyAzMDA7XHJcbiAgICBjb25zdCBtaW5vclJheUxlbiA9IGJhc2VSICsgb3B0cy5taW5vclJheUxlbiB8fCBiYXNlUiArIG9wdHMubWFqb3JSYXlMZW4gLyAyIHx8IGJhc2VSICsgMTUwO1xyXG5cclxuICAgIGNvbnN0IG1ham9yUmF5SW5wdXRGbGlwcGVkID0gMSAtIG9wdHMubWFqb3JSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1pbm9yUmF5SW5wdXRGbGlwcGVkID0gMSAtIG9wdHMubWlub3JSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1heFJheVdpZHRoID0gdHdvUGkgLyBudW1SYXlzTXVsdGlwbGU7XHJcbiAgICBjb25zdCBtYWpvclJheVdpZHRoID0gbWFqb3JSYXlJbnB1dEZsaXBwZWQgKiBtYXhSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1pbm9yUmF5V2lkdGggPSBtaW5vclJheUlucHV0RmxpcHBlZCAqIG1heFJheVdpZHRoO1xyXG5cclxuICAgIGNvbnN0IGJsdXIgPSBvcHRzLmJsdXIgfHwgMTA7XHJcblxyXG4gICAgY29uc3Qgc2hhZG93UmVuZGVyT2Zmc2V0ID0gZGVidWdDb25maWcuZGlzcGxheUdsYXJlU3Bpa2VzID09PSBmYWxzZSA/IDEwMDAwMCA6IDA7XHJcbiAgICBcclxuICAgIGxldCBmbGlwcGVyID0gdHJ1ZTtcclxuXHJcbiAgICAvLyBkcmF3aW5nXHJcbiAgICBjdHguZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gJ3NvdXJjZS1vdmVyJztcclxuICAgIGN0eC50cmFuc2xhdGUoIHgsIHkgLSBzaGFkb3dSZW5kZXJPZmZzZXQgKTtcclxuICAgIGN0eC5yb3RhdGUoIC1hICk7XHJcbiBcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IG51bVJheXNNdWx0aXBsZTsgaSsrICkge1xyXG5cclxuICAgICAgICBsZXQgaU51bVJheXMgPSBpIC8gbnVtUmF5cztcclxuICAgICAgICBsZXQgaU51bVJheXNNdWx0aSA9IGkgLyBudW1SYXlzTXVsdGlwbGU7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG4gICAgICAgIGxldCBhbHBoYTIgPSB0d29QaSAqICggKCBpICsgMSApIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG5cclxuICAgICAgICBsZXQgYWxwaGFNaWRQb2ludCA9IGFscGhhICsgKCB0d29QaSAqIG51bVJheXNNdWx0aXBsZSApO1xyXG5cclxuICAgICAgICBsZXQgY3VydmUxQWxwaGEgPSBhbHBoYU1pZFBvaW50IC0gKCBmbGlwcGVyID8gbWlub3JSYXlXaWR0aCA6IG1ham9yUmF5V2lkdGggKTtcclxuICAgICAgICBsZXQgY3VydmUyQWxwaGEgPSBhbHBoYU1pZFBvaW50ICsgKCBmbGlwcGVyID8gbWFqb3JSYXlXaWR0aCA6IG1pbm9yUmF5V2lkdGggKTtcclxuXHJcbiAgICAgICAgbGV0IGZsaXBwZWRSYXlTaXplID0gZmxpcHBlciA/IG1ham9yUmF5TGVuIDogbWlub3JSYXlMZW47XHJcblxyXG4gICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYSApICogZmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEgKSAqIGZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgY3R4LmJlemllckN1cnZlVG8oXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggY3VydmUxQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiBjdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggY3VydmUyQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMkFscGhhICkgKiBjdXJ2ZVIsXHJcbiAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEyICkgKiBmbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgIE1hdGguc2luKCBhbHBoYTIgKSAqIGZsaXBwZWRSYXlTaXplXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmbGlwcGVyID0gIWZsaXBwZXI7XHJcblxyXG4gICAgICAgIGlmICggaSA9PT0gbnVtUmF5c011bHRpcGxlIC0gMSApIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY3R4LmNsb3NlUGF0aCgpO1xyXG5cclxuXHJcbiAgICBpZiAoICFkZWJ1Z0NvbmZpZy5kaXNwbGF5R2xhcmVTcGlrZXMgKSB7XHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJ3doaXRlJztcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IGJsdXI7XHJcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSAwO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRZID0gc2hhZG93UmVuZGVyT2Zmc2V0O1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmVkJztcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LnJvdGF0ZSggYSApO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSggLXgsIC15ICsgc2hhZG93UmVuZGVyT2Zmc2V0ICk7XHJcblxyXG4gICAgLy8gZGVidWcgZGlzcGxheVxyXG5cclxuICAgIGxldCBkZWJ1Z0ZsaXBwZXIgPSB0cnVlO1xyXG4gICAgbGV0IGRlYnVnQ3VydmVSID0gY3VydmVSO1xyXG4gICAgbGV0IGRlYnVnVGV4dE9mZnNldCA9IDMwO1xyXG5cclxuICAgIGlmICggZGVidWdDb25maWcuZGlzcGxheUdsYXJlU3Bpa2VzICkge1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoIHgsIHkgKTtcclxuICAgICAgICBcclxuICAgICAgICBjdHguZm9udCA9IFwibm9ybWFsIDE0cHggVGFob21hXCI7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiIzY2NjY2NlwiO1xyXG4gICAgICAgIGN0eC5zZXRMaW5lRGFzaCggWyAxLCA2IF0gKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggMCwgMCwgYmFzZVIgKTtcclxuICAgICAgICAvLyBjdHguZmlsbFRleHQoICdSYWRpdXMnLCBiYXNlUiArIDEwLCAwICk7XHJcblxyXG4gICAgICAgIGN0eC5zdHJva2VDaXJjbGUoIDAsIDAsIGRlYnVnQ3VydmVSICk7XHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KCAnQ3VydmUgUG9pbnQgUmFkaXVzJywgZGVidWdDdXJ2ZVIgKyAxMCwgMCApO1xyXG5cclxuICAgICAgICBjdHguc3Ryb2tlQ2lyY2xlKCAwLCAwLCBtaW5vclJheUxlbiApO1xyXG4gICAgICAgIGN0eC5maWxsVGV4dCggJ01pbm9yIFNwaWtlIFJhZGl1cycsIG1pbm9yUmF5TGVuICsgMTAsIDAgKTtcclxuXHJcbiAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggMCwgMCwgbWFqb3JSYXlMZW4gKTtcclxuICAgICAgICBsZXQgdGV4dE1ldHJpY3MgPSBjdHgubWVhc3VyZVRleHQoXCJNYWpvciBTcGlrZSBSYWRpdXNcIik7XHJcbiAgICAgICAgbGV0IHRleHRXID0gdGV4dE1ldHJpY3Mud2lkdGggKyAxMDtcclxuICAgICAgICBjdHguZmlsbFRleHQoICdNYWpvciBTcGlrZSBSYWRpdXMnLCBtYWpvclJheUxlbiAtIHRleHRXLCAwICk7XHJcblxyXG4gICAgICAgIGN0eC5zZXRMaW5lRGFzaCggW10gKTtcclxuXHJcbiAgICAgICAgY3R4LnJvdGF0ZSggLWEgKTtcclxuXHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIm5vcm1hbCAxNHB4IFRhaG9tYVwiO1xyXG5cclxuICAgICAgICAvLyBwb2ludHMgYW5kIGxpbmVzXHJcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbnVtUmF5c011bHRpcGxlOyBpKysgKSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgaU51bVJheXMgPSBpIC8gbnVtUmF5cztcclxuICAgICAgICAgICAgbGV0IGlOdW1SYXlzTXVsdGkgPSBpIC8gbnVtUmF5c011bHRpcGxlO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGEgPSB0d29QaSAqICggaSAvICggbnVtUmF5c011bHRpcGxlICkgKTtcclxuICAgICAgICAgICAgbGV0IGFscGhhMiA9IHR3b1BpICogKCAoIGkgKyAxICkgLyAoIG51bVJheXNNdWx0aXBsZSApICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYWxwaGFNaWRQb2ludCA9IGFscGhhICsgKCB0d29QaSAqIG51bVJheXNNdWx0aXBsZSApO1xyXG5cclxuICAgICAgICAgICAgbGV0IGN1cnZlMUFscGhhID0gYWxwaGFNaWRQb2ludCAtICggZGVidWdGbGlwcGVyID8gbWlub3JSYXlXaWR0aCA6IG1ham9yUmF5V2lkdGggKTtcclxuICAgICAgICAgICAgbGV0IGN1cnZlMkFscGhhID0gYWxwaGFNaWRQb2ludCArICggZGVidWdGbGlwcGVyID8gbWFqb3JSYXlXaWR0aCA6IG1pbm9yUmF5V2lkdGggKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBkZWJ1Z0xpbmVBbHBoYSA9IHR3b1BpICogKCBpIC8gbnVtUmF5c011bHRpcGxlICk7XHJcbiAgICAgICAgICAgIGxldCBkZWJ1Z0ZsaXBwZWRSYXlTaXplID0gZGVidWdGbGlwcGVyID8gbWFqb3JSYXlMZW4gOiBtaW5vclJheUxlbjtcclxuXHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmaXJzdCBwb2ludFxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKCAyNTUsIDAsIDAsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAncmdiYSggMjU1LCAwLCAwLCAxICknO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2luKCBhbHBoYSApICogZGVidWdGbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICA1XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lKCBcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEgKSAqIGRlYnVnRmxpcHBlZFJheVNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplXHJcbiAgICAgICAgICAgICAgICApXHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KCBpLCBNYXRoLmNvcyggYWxwaGEgKSAqICggZGVidWdGbGlwcGVyID8gbWFqb3JSYXlMZW4gOiBtaW5vclJheUxlbiArIGRlYnVnVGV4dE9mZnNldCApLFxyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguc2luKCBhbHBoYSApICogZGVidWdGbGlwcGVkUmF5U2l6ZSArIGRlYnVnVGV4dE9mZnNldCApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjZW50cmUgYW5nbGUgb2YgY29udHJvbCBwb2ludHNcclxuICAgICAgICAgICAgICAgIGN0eC5zZXRMaW5lRGFzaCggWyAxLCA2IF0gKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lKCAwLCAwLCBNYXRoLmNvcyggYWxwaGFNaWRQb2ludCApICogbWFqb3JSYXlMZW4sIE1hdGguc2luKCBhbHBoYU1pZFBvaW50ICkgKiBtYWpvclJheUxlbiApO1xyXG4gICAgICAgICAgICAgICAgY3R4LnN0cm9rZUNpcmNsZSggMCwgMCwgY3VydmVSICk7XHJcbiAgICAgICAgICAgICAgICBjdHguc2V0TGluZURhc2goIFtdICk7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGZpcnN0IGNvbnRyb2wgcG9pbnQgb2YgY3VydmUgKCBtaW51cyBmcm9tIGNlbnRyZSBwb2ludCApXHJcbiAgICAgICAgICAgICAgICBpZiAoIGRlYnVnRmxpcHBlciApIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnZ3JlZW4nO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsdWUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdibHVlJztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbENpcmNsZSggTWF0aC5jb3MoIGN1cnZlMUFscGhhICkgKiBkZWJ1Z0N1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiBkZWJ1Z0N1cnZlUixcclxuICAgICAgICAgICAgICAgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lKCAwLCAwLCBNYXRoLmNvcyggY3VydmUxQWxwaGEgKSAqIGRlYnVnQ3VydmVSLCBNYXRoLnNpbiggY3VydmUxQWxwaGEgKSAqIGRlYnVnQ3VydmVSICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gY3R4LmZpbGxUZXh0KCBpLCBNYXRoLmNvcyggY3VydmUxQWxwaGEgKSAqICggZGVidWdDdXJ2ZVIgKyBkZWJ1Z1RleHRPZmZzZXQgKSwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiAoIGRlYnVnQ3VydmVSICsgZGVidWdUZXh0T2Zmc2V0ICkgKTtcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHNlY29uZCBjb250cm9sIHBvaW50IG9mIGN1cnZlICggcGx1cyBmcm9tIGNlbnRyZSBwb2ludCApXHJcbiAgICAgICAgICAgICAgICBpZiAoICFkZWJ1Z0ZsaXBwZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdncmVlbic7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ2dyZWVuJztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibHVlJztcclxuICAgICAgICAgICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnYmx1ZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxDaXJjbGUoXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGN1cnZlMkFscGhhICkgKiBkZWJ1Z0N1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMkFscGhhICkgKiBkZWJ1Z0N1cnZlUixcclxuICAgICAgICAgICAgICAgICAgICAzXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIC8vIGN0eC5maWxsVGV4dCggaSwgTWF0aC5jb3MoIGN1cnZlMkFscGhhICkgKiAoIGRlYnVnQ3VydmVSICsgZGVidWdUZXh0T2Zmc2V0ICksIE1hdGguc2luKCBjdXJ2ZTJBbHBoYSApICogKCBkZWJ1Z0N1cnZlUiArIGRlYnVnVGV4dE9mZnNldCApICk7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZSggMCwgMCwgTWF0aC5jb3MoIGN1cnZlMkFscGhhICkgKiBkZWJ1Z0N1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMkFscGhhICkgKiBkZWJ1Z0N1cnZlUiApO1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZW5kIHBvaW50IG9mIGN1cnZlXHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoIDI1NSwgMCwgMCwgMSApJztcclxuICAgICAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICdyZ2JhKCAyNTUsIDAsIDAsIDEgKSc7XHJcbiAgICAgICAgICAgICAgICBjdHguZmlsbENpcmNsZShcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEyICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplLCBNYXRoLnNpbiggYWxwaGEyICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgIDVcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KFxyXG4gICAgICAgICAgICAgICAgICAgIGkgKyAxLCBcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmNvcyggYWxwaGEyICkgKiAoIGRlYnVnRmxpcHBlZFJheVNpemUgKyBkZWJ1Z1RleHRPZmZzZXQgKSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEyICkgKiAoIGRlYnVnRmxpcHBlZFJheVNpemUgKyBkZWJ1Z1RleHRPZmZzZXQgKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lKFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhMiApICogZGVidWdGbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEyICkgKiBkZWJ1Z0ZsaXBwZWRSYXlTaXplXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgIGkgKz0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVidWdGbGlwcGVyID0gIWRlYnVnRmxpcHBlcjtcclxuXHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gbnVtUmF5c011bHRpcGxlIC0gMSApIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBodWxsc1xyXG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuXHJcbiAgICAgICAgbGV0IGh1bGxGbGlwcGVyID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1SYXlzTXVsdGlwbGU7IGkrKyApIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBpTnVtUmF5cyA9IGkgLyBudW1SYXlzO1xyXG4gICAgICAgICAgICBsZXQgaU51bVJheXNNdWx0aSA9IGkgLyBudW1SYXlzTXVsdGlwbGU7XHJcbiAgICAgICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzTXVsdGlwbGUgKSApO1xyXG4gICAgICAgICAgICBsZXQgYWxwaGEyID0gdHdvUGkgKiAoICggaSArIDEgKSAvICggbnVtUmF5c011bHRpcGxlICkgKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBhbHBoYU1pZFBvaW50ID0gYWxwaGEgKyAoIHR3b1BpICogbnVtUmF5c011bHRpcGxlICk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY3VydmUxQWxwaGEgPSBhbHBoYU1pZFBvaW50IC0gKCBodWxsRmxpcHBlciA/IG1pbm9yUmF5V2lkdGggOiBtYWpvclJheVdpZHRoICk7XHJcbiAgICAgICAgICAgIGxldCBjdXJ2ZTJBbHBoYSA9IGFscGhhTWlkUG9pbnQgKyAoIGh1bGxGbGlwcGVyID8gbWFqb3JSYXlXaWR0aCA6IG1pbm9yUmF5V2lkdGggKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBmbGlwcGVkUmF5U2l6ZSA9IGh1bGxGbGlwcGVyID8gbWFqb3JSYXlMZW4gOiBtaW5vclJheUxlbjtcclxuXHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuICAgICAgICAgICAgICAgIGN0eC5tb3ZlVG8oXHJcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5jb3MoIGFscGhhICkgKiBmbGlwcGVkUmF5U2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEgKSAqIGZsaXBwZWRSYXlTaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggY3VydmUxQWxwaGEgKSAqIGN1cnZlUiwgTWF0aC5zaW4oIGN1cnZlMUFscGhhICkgKiBjdXJ2ZVIgKTtcclxuICAgICAgICAgICAgICAgIGN0eC5saW5lVG8oIE1hdGguY29zKCBjdXJ2ZTJBbHBoYSApICogY3VydmVSLCBNYXRoLnNpbiggY3VydmUyQWxwaGEgKSAqIGN1cnZlUiApO1xyXG4gICAgICAgICAgICAgICAgY3R4LmxpbmVUbyggTWF0aC5jb3MoIGFscGhhMiApICogZmxpcHBlZFJheVNpemUsIE1hdGguc2luKCBhbHBoYTIgKSAqIGZsaXBwZWRSYXlTaXplICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBodWxsRmxpcHBlciA9ICFodWxsRmxpcHBlcjtcclxuXHJcbiAgICAgICAgICAgIGlmICggaSA9PT0gbnVtUmF5c011bHRpcGxlIC0gMSApIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICAgICAgY3R4LnNldExpbmVEYXNoKCBbXSApO1xyXG5cclxuXHJcbiAgICAgICAgY3R4LnJvdGF0ZSggYSApO1xyXG4gICAgICAgIGN0eC50cmFuc2xhdGUoIC14LCAteSApO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBtYXhSYXlMZW4gPSBtYWpvclJheUxlbiA+IG1pbm9yUmF5TGVuID8gbWFqb3JSYXlMZW4gOiBtaW5vclJheUxlbjtcclxuXHJcbiAgICAvLyBvdXRwdXQgY29uZmlnIGZvciByZW5kZXJzXHJcbiAgICB0aGlzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXMucmVuZGVyID0ge1xyXG4gICAgICAgIHg6IHggLSBtYXhSYXlMZW4gLSAxMCxcclxuICAgICAgICB5OiB5IC0gbWF4UmF5TGVuIC0gMTAsIFxyXG4gICAgICAgIHc6IG1heFJheUxlbiAqIDIgKyAyMCxcclxuICAgICAgICBoOiBtYXhSYXlMZW4gKiAyICsgMjBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXMuaXNSZW5kZXJlZCA9IHRydWU7XHJcblxyXG59XHJcblxyXG5zdW5TcGlrZXMucmVuZGVyR2xhcmVTcGlrZXNSYW5kb20gPSBmdW5jdGlvbiggb3B0aW9ucyApIHtcclxuXHJcbiAgICBjb25zdCBjdHggPSB0aGlzLnJlbmRlckNmZy5jb250ZXh0O1xyXG4gICAgY29uc3QgZGVidWdDb25maWcgPSB0aGlzLnJlbmRlckNmZy5kZWJ1Z0NmZ1xyXG4gICAgY29uc3Qgb3B0cyA9IG9wdGlvbnMgfHwgdGhpcy5nbGFyZVNwaWtlUmFuZG9tT3B0aW9ucztcclxuXHJcbiAgICAvLyBjb25maWd1cmF0aW9uXHJcbiAgICBjb25zdCB4ID0gb3B0cy54IHx8IGN0eC53aWR0aCAvIDI7XHJcbiAgICBjb25zdCB5ID0gb3B0cy55O1xyXG4gICAgY29uc3QgYSA9IG9wdHMuYW5nbGUgfHwgMDtcclxuICAgIGNvbnN0IG51bVJheXMgPSBvcHRzLmNvdW50IHx8IDQ7XHJcbiAgICBjb25zdCBudW1SYXlzTXVsdGlwbGUgPSBudW1SYXlzICogMjtcclxuXHJcbiAgICBjb25zdCBiYXNlUiA9IG9wdHMuciB8fCAxNTA7XHJcbiAgICBjb25zdCBjdXJ2ZVIgPSBvcHRzLmN1cnZlUiB8fCBiYXNlUjtcclxuXHJcbiAgICBsZXQgbWF4U2l6ZSA9IG9wdHMubWFqb3JSYXlMZW4gfHwgNjAwO1xyXG4gICAgbGV0IG1pblNpemUgPSBvcHRzLm1pbm9yUmF5TGVuIHx8IDMwMDtcclxuXHJcbiAgICBsZXQgcmFuZG9tU2l6ZSA9IFtdOyBcclxuICAgIGZvciAodmFyIGkgPSBudW1SYXlzTXVsdGlwbGU7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgcmFuZG9tU2l6ZS5wdXNoKCByYW5kSSggbWluU2l6ZSwgbWF4U2l6ZSApICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29uc3QgbWFqb3JSYXlMZW4gPSBiYXNlUiArIG9wdHMubWFqb3JSYXlMZW4gfHwgYmFzZVIgKyAzMDA7XHJcbiAgICAvLyBjb25zdCBtaW5vclJheUxlbiA9IGJhc2VSICsgb3B0cy5taW5vclJheUxlbiB8fCBiYXNlUiArIG9wdHMubWFqb3JSYXlMZW4gLyAyIHx8IGJhc2VSICsgMTUwO1xyXG5cclxuICAgIGNvbnN0IG1ham9yUmF5SW5wdXRGbGlwcGVkID0gMSAtIG9wdHMubWFqb3JSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1pbm9yUmF5SW5wdXRGbGlwcGVkID0gMSAtIG9wdHMubWlub3JSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1heFJheVdpZHRoID0gdHdvUGkgLyBudW1SYXlzTXVsdGlwbGU7XHJcbiAgICBjb25zdCBtYWpvclJheVdpZHRoID0gbWFqb3JSYXlJbnB1dEZsaXBwZWQgKiBtYXhSYXlXaWR0aDtcclxuICAgIGNvbnN0IG1pbm9yUmF5V2lkdGggPSBtaW5vclJheUlucHV0RmxpcHBlZCAqIG1heFJheVdpZHRoO1xyXG5cclxuICAgIGNvbnN0IGJsdXIgPSBvcHRzLmJsdXIgfHwgMTA7XHJcblxyXG4gICAgY29uc3Qgc2hhZG93UmVuZGVyT2Zmc2V0ID0gZGVidWdDb25maWcuZGlzcGxheUdsYXJlU3Bpa2VzID09PSBmYWxzZSA/IDEwMDAwMCA6IDA7XHJcbiAgICBcclxuXHJcblxyXG4gICAgbGV0IGZsaXBwZXIgPSB0cnVlO1xyXG5cclxuICAgIC8vIGRyYXdpbmdcclxuICAgIGN0eC5nbG9iYWxDb21wb3NpdGVPcGVyYXRpb24gPSAnc291cmNlLW92ZXInO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSggeCwgeSAtIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG4gICAgY3R4LnJvdGF0ZSggLWEgKTtcclxuIFxyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbnVtUmF5c011bHRpcGxlOyBpKysgKSB7XHJcblxyXG4gICAgICAgIGxldCBpTnVtUmF5cyA9IGkgLyBudW1SYXlzO1xyXG4gICAgICAgIGxldCBpTnVtUmF5c011bHRpID0gaSAvIG51bVJheXNNdWx0aXBsZTtcclxuXHJcbiAgICAgICAgbGV0IGFscGhhID0gdHdvUGkgKiAoIGkgLyAoIG51bVJheXNNdWx0aXBsZSApICk7XHJcbiAgICAgICAgbGV0IGFscGhhMiA9IHR3b1BpICogKCAoIGkgKyAxICkgLyAoIG51bVJheXNNdWx0aXBsZSApICk7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYU1pZFBvaW50ID0gYWxwaGEgKyAoIHR3b1BpICogbnVtUmF5c011bHRpcGxlICk7XHJcblxyXG4gICAgICAgIGxldCBjdXJ2ZTFBbHBoYSA9IGFscGhhTWlkUG9pbnQgLSBtYXhSYXlXaWR0aDtcclxuICAgICAgICBsZXQgY3VydmUyQWxwaGEgPSBhbHBoYU1pZFBvaW50ICsgbWF4UmF5V2lkdGg7XHJcblxyXG4gICAgICAgIGlmICggaSA9PT0gMCApIHtcclxuICAgICAgICAgICAgY3R4Lm1vdmVUbyhcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYSApICogKCBiYXNlUiArIHJhbmRvbVNpemVbIGkgXSApLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5zaW4oIGFscGhhICkgKiAoIGJhc2VSICsgcmFuZG9tU2l6ZVsgaSBdICksXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICBjdHguYmV6aWVyQ3VydmVUbyhcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKCBjdXJ2ZTFBbHBoYSApICogY3VydmVSLCBNYXRoLnNpbiggY3VydmUxQWxwaGEgKSAqIGN1cnZlUixcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKCBjdXJ2ZTJBbHBoYSApICogY3VydmVSLCBNYXRoLnNpbiggY3VydmUyQWxwaGEgKSAqIGN1cnZlUixcclxuICAgICAgICAgICAgICAgIE1hdGguY29zKCBhbHBoYTIgKSAqICggYmFzZVIgKyByYW5kb21TaXplWyBpICsgMSBdICksXHJcbiAgICAgICAgICAgICAgICBNYXRoLnNpbiggYWxwaGEyICkgKiAoIGJhc2VSICsgcmFuZG9tU2l6ZVsgaSArIDEgXSApXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCApXHJcbiAgICAgICAgZmxpcHBlciA9ICFmbGlwcGVyO1xyXG5cclxuICAgICAgICBpZiAoIGkgPT09IG51bVJheXNNdWx0aXBsZSAtIDEgKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuXHJcblxyXG4gICAgaWYgKCAhZGVidWdDb25maWcuZGlzcGxheUdsYXJlU3Bpa2VzICkge1xyXG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSBibHVyO1xyXG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gMDtcclxuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IHNoYWRvd1JlbmRlck9mZnNldDtcclxuICAgICAgICBjdHguZmlsbCgpO1xyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5yb3RhdGUoIGEgKTtcclxuICAgIGN0eC50cmFuc2xhdGUoIC14LCAteSArIHNoYWRvd1JlbmRlck9mZnNldCApO1xyXG5cclxuICAgIC8vIGRlYnVnIGRpc3BsYXlcclxuXHJcbiAgICBsZXQgbWF4UmF5TGVuID0gbWF4U2l6ZTtcclxuXHJcbiAgICAvLyBvdXRwdXQgY29uZmlnIGZvciByZW5kZXJzXHJcbiAgICB0aGlzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20ucmVuZGVyID0ge1xyXG4gICAgICAgIHg6IHggLSBtYXhSYXlMZW4gLSAxMCxcclxuICAgICAgICB5OiB5IC0gbWF4UmF5TGVuIC0gMTAsIFxyXG4gICAgICAgIHc6IG1heFJheUxlbiAqIDIgKyAyMCxcclxuICAgICAgICBoOiBtYXhSYXlMZW4gKiAyICsgMjBcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmRpc3BsYXlDZmcuZ2xhcmVTcGlrZXNSYW5kb20uaXNSZW5kZXJlZCA9IHRydWU7XHJcblxyXG59XHJcblxyXG5zdW5TcGlrZXMuZGlzcGxheUNvcm9uYSA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG4gICAgbGV0IGdsYXJlU3Bpa2VPcHRzID0gdGhpcy5kaXNwbGF5Q2ZnLmdsYXJlU3Bpa2VzO1xyXG4gICAgbGV0IGl0ZW1DZmcgPSBnbGFyZVNwaWtlT3B0cy5yZW5kZXI7XHJcbiAgICBsZXQgYyA9IGdsYXJlU3Bpa2VPcHRzLmNvbnRleHQ7XHJcbiAgICBsZXQgb3JpZ2luQ2FudmFzID0gdGhpcy5yZW5kZXJDZmcuY2FudmFzO1xyXG4gICAgbGV0IG9wdHMgPSBvcHRpb25zO1xyXG4gICAgbGV0IHggPSBvcHRzLnhQb3MgfHwgZ2xhcmVTcGlrZU9wdHMueDtcclxuICAgIGxldCB5ID0gb3B0cy55UG9zIHx8IGdsYXJlU3Bpa2VPcHRzLnk7XHJcblxyXG4gICAgaWYgKCBnbGFyZVNwaWtlT3B0cy5pc1JlbmRlcmVkID09PSBmYWxzZSApIHtcclxuICAgICAgICB0aGlzLnJlbmRlckdsYXJlU3Bpa2VzKCk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJGbGFyZXMoKTtcclxuICAgIH1cclxuICAgIGlmICggIWl0ZW1DZmcgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKCBnbGFyZVNwaWtlT3B0cy5pc0Rpc3BsYXllZCA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coICdpdGVtQ2ZnOiAnLCBpdGVtQ2ZnICk7XHJcbiAgICAgICAgYy5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIG9yaWdpbkNhbnZhcyxcclxuICAgICAgICAgICAgaXRlbUNmZy54LCBpdGVtQ2ZnLnksIGl0ZW1DZmcudywgaXRlbUNmZy5oLFxyXG4gICAgICAgICAgICAtKGl0ZW1DZmcudyAvIDIgKSwgLShpdGVtQ2ZnLmggLyAyICksIGl0ZW1DZmcudywgaXRlbUNmZy5oXHJcbiAgICAgICAgKTtcclxuICAgICAgICAvLyBnbGFyZVNwaWtlT3B0cy5pc0Rpc3BsYXllZCA9IHRydWU7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuXHJcbnN1blNwaWtlcy5yZW5kZXJGbGFyZXMgPSBmdW5jdGlvbiggb3B0aW9ucyApIHtcclxuXHJcbiAgICBjb25zdCBkZWJ1Z0NvbmZpZyA9IHRoaXMucmVuZGVyQ2ZnLmRlYnVnQ2ZnXHJcbiAgICBjb25zdCBvcHRzID0gdGhpcy5mbGFyZU9wdGlvbnM7XHJcbiAgICBjb25zdCBjdHggPSBvcHRzLmNvbnRleHQgfHwgdGhpcy5yZW5kZXJDZmcuY29udGV4dDtcclxuICAgIGNvbnN0IHJlbmRlckNhbnZhcyA9IG9wdHMuY2FudmFzIHx8IHRoaXMucmVuZGVyQ2ZnLmNhbnZhcztcclxuICAgIGNvbnN0IHJlbmRlck9mZnNldCA9IDEwMDAwMDtcclxuICAgIC8vIGNvbmZpZ3VyYXRpb25cclxuICAgIGNvbnN0IHggPSBvcHRzLnggfHwgY3R4LndpZHRoIC8gMjtcclxuICAgIGNvbnN0IHkgPSBvcHRzLnk7XHJcbiAgICBjb25zdCBhID0gb3B0cy5hbmdsZSB8fCAwO1xyXG4gICAgY29uc3QgbnVtUmF5cyA9IG9wdHMuY291bnQgfHwgNDtcclxuICAgIGNvbnN0IG51bVJheXNNdWx0aXBsZSA9IG51bVJheXMgKiAyO1xyXG4gICAgY29uc3QgcmF5V2lkdGggPSBvcHRzLnJheVdpZHRoIHx8IDAuMjtcclxuICAgIGNvbnN0IGdyYWRpZW50V2lkdGggPSBvcHRzLmdyYWRpZW50V2lkdGggfHwgMTAwMDtcclxuICAgIGNvbnN0IGJhc2VSID0gb3B0cy5yIHx8IDE1MDtcclxuICAgIGNvbnN0IGN1cnZlUiA9IG9wdHMuY3VydmVSIHx8IGJhc2VSO1xyXG4gICAgY29uc3QgYmx1ciA9IG9wdHMuYmx1ciB8fCA0O1xyXG4gICAgY29uc3QgcmF5TGVuID0gYmFzZVIgKyBvcHRzLnJheUxlbiB8fCBiYXNlUiArIDMwMDtcclxuXHJcbiAgICBjb25zdCBtYXhSYXlXaWR0aCA9IHR3b1BpIC8gbnVtUmF5cztcclxuICAgIGNvbnN0IHJheVNwcmVhZCA9IG1heFJheVdpZHRoICogcmF5V2lkdGg7XHJcblxyXG4gICAgLy8gZHJhd2luZ1xyXG4gICAgY3R4Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdzb3VyY2Utb3Zlcic7XHJcbiAgICBjdHgudHJhbnNsYXRlKCB4LCB5ICk7XHJcbiAgICBjdHgucm90YXRlKCAtYSApO1xyXG4gICAgY3R4LmZpbHRlciA9ICdibHVyKCcrYmx1cisncHgpJztcclxuICAgIGxldCBmbGFyZUdyZCA9IGN0eC5jcmVhdGVSYWRpYWxHcmFkaWVudCggMCwgMCwgMCwgMCwgMCwgZ3JhZGllbnRXaWR0aCApO1xyXG4gICAgZmxhcmVHcmQuYWRkQ29sb3JTdG9wKCAwLCAncmdiYSggMjU1LCAyNTUsIDI1NSwgMScgKTtcclxuICAgIGZsYXJlR3JkLmFkZENvbG9yU3RvcCggMC4zLCAncmdiYSggMjU1LCAyNTUsIDI1NSwgMC4zJyApO1xyXG4gICAgZmxhcmVHcmQuYWRkQ29sb3JTdG9wKCAxLCAncmdiYSggMjU1LCAyNTUsIDI1NSwgMCcgKTtcclxuICAgIFxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IGZsYXJlR3JkO1xyXG4gICAgXHJcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBudW1SYXlzOyBpKysgKSB7XHJcblxyXG4gICAgICAgIGxldCBhbHBoYSA9IHR3b1BpICogKCBpIC8gKCBudW1SYXlzICkgKTtcclxuXHJcbiAgICAgICAgbGV0IHBvaW50MUFscGhhID0gYWxwaGEgLSByYXlTcHJlYWQ7XHJcbiAgICAgICAgbGV0IHBvaW50MkFscGhhID0gYWxwaGEgKyByYXlTcHJlYWQ7XHJcblxyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHgubW92ZVRvKCAwLCAwICk7XHJcblxyXG4gICAgICAgIC8vIGN0eC5saW5lVG8oIDgwMCwgLTIwICk7XHJcbiAgICAgICAgLy8gY3R4LmxpbmVUbyggODAwLCAyMCApO1xyXG5cclxuICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggcG9pbnQxQWxwaGEgKSAqIHJheUxlbiwgTWF0aC5zaW4oIHBvaW50MUFscGhhICkgKiByYXlMZW4gKTtcclxuICAgICAgICBjdHgubGluZVRvKCBNYXRoLmNvcyggcG9pbnQyQWxwaGEgKSAqIHJheUxlbiwgTWF0aC5zaW4oIHBvaW50MkFscGhhICkgKiByYXlMZW4gKTtcclxuICAgICAgICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgLy8gY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5maWxsKCk7XHJcblxyXG4gICAgfVxyXG4gICAgY3R4LmZpbHRlciA9ICdibHVyKDBweCknO1xyXG4gICAgY3R4LnJvdGF0ZSggYSApO1xyXG4gICAgY3R4LnRyYW5zbGF0ZSggLXgsIC15ICk7XHJcblxyXG4gICAgLy8gb3V0cHV0IGNvbmZpZyBmb3IgcmVuZGVyc1xyXG4gICAgdGhpcy5kaXNwbGF5Q2ZnLmZsYXJlcyA9IHtcclxuICAgICAgICBjYW52YXM6IHJlbmRlckNhbnZhcyxcclxuICAgICAgICB4OiB4IC0gcmF5TGVuIC0gMTAsXHJcbiAgICAgICAgeTogeSAtIHJheUxlbiAtIDEwLCBcclxuICAgICAgICB3OiByYXlMZW4gKiAyICsgMjAsXHJcbiAgICAgICAgaDogcmF5TGVuICogMiArIDIwXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mbGFyZVJlbmRlckNvdW50Kys7XHJcbiAgICBjb25zb2xlLmxvZyggJ3RoaXMuZmxhcmVSZW5kZXJDb3VudDogJywgdGhpcy5mbGFyZVJlbmRlckNvdW50ICk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHN1blNwaWtlczsiLCJ2YXIgdHJpZyA9IHJlcXVpcmUoJy4vdHJpZ29ub21pY1V0aWxzLmpzJykudHJpZ29ub21pY1V0aWxzO1xyXG52YXIgdHdvUGkgPSB0cmlnLnR3b1BpO1xyXG52YXIgcmFuZEkgPSByZXF1aXJlKCcuL21hdGhVdGlscy5qcycpLm1hdGhVdGlscy5yYW5kb21JbnRlZ2VyO1xyXG52YXIgcmFuZCA9IHJlcXVpcmUoJy4vbWF0aFV0aWxzLmpzJykubWF0aFV0aWxzLnJhbmRvbTtcclxuXHJcbmxldCB0aGVTdGFycyA9IHtcclxuXHJcblx0c3RhcnNBcnI6IFtdLFxyXG5cclxuXHRjb25maWc6IHtcclxuXHRcdGNvdW50OiAzMDAwXHJcblx0fSxcclxuXHJcblx0cmVuZGVyQ29uZmlnOiB7XHJcblx0XHRjYW52YXM6IG51bGwsXHJcblx0XHRjdHg6IG51bGwsXHJcblx0XHR4OiAwLFxyXG5cdFx0eTogMCxcclxuXHRcdHc6IDAsXHJcblx0XHRoOiAwXHJcblx0fSxcclxuXHJcblx0Z2V0Q2FudmFzOiBmdW5jdGlvbiggY2FudmFzLCBjdHggKSB7XHJcblx0XHRsZXQgcmVuZGVyQ2ZnID0gdGhpcy5yZW5kZXJDb25maWc7XHJcblx0XHRyZW5kZXJDZmcuY2FudmFzID0gY2FudmFzO1xyXG5cdFx0cmVuZGVyQ2ZnLmN0eCA9IGN0eDtcclxuXHJcblx0XHRyZW5kZXJDZmcudyA9IGNhbnZhcy53aWR0aDtcclxuXHRcdHJlbmRlckNmZy5oID0gY2FudmFzLmhlaWdodDtcclxuXHJcblx0fSxcclxuXHJcblx0c2V0SW5pdGlhbENvbmZpZzogZnVuY3Rpb24oIHN1bkNmZyApIHtcclxuXHJcblx0XHRsZXQgc3VuQ29uZmlnID0gc3VuQ2ZnO1xyXG5cdFx0dGhpcy5jb25maWcuYXJjUmFkaXVzID0gc3VuQ29uZmlnLnBpdm90UG9pbnQucjtcclxuXHRcdHRoaXMuY29uZmlnLnRvdGFsQ2xvY2sgPSBzdW5Db25maWcub3JiaXRUaW1lO1xyXG5cdFx0dGhpcy5jb25maWcuYWxwaGFDbG9jayA9IHN1bkNvbmZpZy5vcmJpdENsb2NrO1xyXG5cclxuXHRcdGxldCB0Q2xvY2sgPSB0aGlzLmNvbmZpZy50b3RhbENsb2NrO1xyXG5cdFx0bGV0IHRDbG9ja1EgPSB0Q2xvY2sgLyA0O1xyXG5cdFx0bGV0IHRDbG9ja0ggPSB0Q2xvY2sgLyAyO1xyXG5cclxuXHRcdHRoaXMuY29uZmlnLmFscGhhSW50ZXJ2YWwgPSAxIC8gdENsb2NrUTtcclxuXHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gMDtcclxuXHJcblx0XHRsZXQgYUNsb2NrID0gdGhpcy5jb25maWcuYWxwaGFDbG9jaztcclxuXHRcdGxldCBhSW50ID0gdGhpcy5jb25maWcuYWxwaGFJbnRlcnZhbDtcclxuXHJcblx0XHRpZiAoIGFDbG9jayA8IHRDbG9ja1EgKSB7XHJcblx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gYUNsb2NrICogYUludCA7XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0aWYgKCBhQ2xvY2sgPCB0Q2xvY2tIICkge1xyXG5cdFx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gMSAtICggKCBhQ2xvY2sgLSB0Q2xvY2tRICkgKiBhSW50ICkgO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gMVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHR0aGlzLmNvbmZpZy5waXZvdCA9IHtcclxuXHRcdFx0eDogc3VuQ29uZmlnLnBpdm90UG9pbnQueCxcclxuXHRcdFx0eTogc3VuQ29uZmlnLnBpdm90UG9pbnQueSxcclxuXHRcdFx0clZlbDogc3VuQ29uZmlnLnJWZWxcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmNvbmZpZy5yZXNldEEgPSB0cmlnLmFuZ2xlKCB0aGlzLmNvbmZpZy5waXZvdC54LCB0aGlzLmNvbmZpZy5waXZvdC55LCAwLCB0aGlzLnJlbmRlckNvbmZpZy5oICk7XHJcblx0XHRjb25zb2xlLmxvZyggJ3RoaXMuY29uZmlnLnJlc2V0QTogJywgdGhpcy5jb25maWcucmVzZXRBICk7XHJcblx0XHRjb25zb2xlLmxvZyggJ3RoaXMuY29uZmlnLnBpdm90OiAnLCB0aGlzLmNvbmZpZy5waXZvdCApO1xyXG5cdH0sXHJcblxyXG5cdHVwZGF0ZUFscGhhOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRsZXQgdENsb2NrID0gdGhpcy5jb25maWcudG90YWxDbG9jaztcclxuXHRcdGxldCB0Q2xvY2tRID0gdENsb2NrIC8gNDtcclxuXHRcdGxldCB0Q2xvY2tIID0gdENsb2NrIC8gMjtcclxuXHRcdGxldCBhQ2xvY2sgPSB0aGlzLmNvbmZpZy5hbHBoYUNsb2NrO1xyXG5cdFx0bGV0IGFJbnQgPSB0aGlzLmNvbmZpZy5hbHBoYUludGVydmFsO1xyXG5cdFx0bGV0IGdBbHBoYSA9IHRoaXMuY29uZmlnLmdsb2JhbEFscGhhO1xyXG5cdFx0aWYgKCBhQ2xvY2sgPCB0Q2xvY2tRICkge1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLmNvbmZpZy5nbG9iYWxBbHBoYSA8IDEgKSB7XHJcblx0XHRcdFx0dGhpcy5jb25maWcuZ2xvYmFsQWxwaGEgKz0gYUludDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmNvbmZpZy5nbG9iYWxBbHBoYSA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0aWYgKCBhQ2xvY2sgPCB0Q2xvY2tIICkge1xyXG5cclxuXHRcdFx0XHRpZiAoIHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID4gYUludCApIHtcclxuXHRcdFx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhIC09IGFJbnQ7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gMDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICggYUNsb2NrID4gdENsb2NrSCApIHtcclxuXHRcdFx0XHRcdHRoaXMuY29uZmlnLmdsb2JhbEFscGhhID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBhQ2xvY2sgPT09IHRDbG9jayApIHtcclxuXHRcdFx0dGhpcy5jb25maWcuYWxwaGFDbG9jayA9IDA7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmNvbmZpZy5hbHBoYUNsb2NrKys7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblxyXG5cdHBvcHVsYXRlQXJyYXk6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGxldCB0aGlzQ291bnQgPSB0aGlzLmNvbmZpZy5jb3VudDtcclxuXHRcdGxldCB0aGlzQ2FudmFzID0gdGhpcy5yZW5kZXJDb25maWc7XHJcblx0XHRsZXQgaGFsZlN0YWdlVyA9ICB0aGlzQ2FudmFzLncgLyAyO1xyXG5cdFx0bGV0IGhhbGZTdGFnZUggPSAgdGhpc0NhbnZhcy5oIC8gMjtcclxuXHRcdGxldCBncm91cFBpdm90ID0gdGhpcy5jb25maWcucGl2b3Q7XHJcblxyXG5cdFx0bGV0IGRpc3RNYXggPSB0cmlnLmRpc3QoIDAsIDAsIGdyb3VwUGl2b3QueCwgZ3JvdXBQaXZvdC55ICk7XHJcblx0XHRsZXQgZGlzdE1pbiA9IHRyaWcuZGlzdCggKCB0aGlzQ2FudmFzLncgLzIgKSwgdGhpc0NhbnZhcy5oLCBncm91cFBpdm90LngsIGdyb3VwUGl2b3QueSApO1xyXG5cclxuXHRcdGZvciAodmFyIGkgPSB0aGlzQ291bnQgLSAxOyBpID49IDA7IGktLSkge1xyXG5cclxuXHRcdFx0bGV0IHJhbmRQb3NpdGlvbiA9IHRyaWcucmFkaWFsRGlzdHJpYnV0aW9uKCBncm91cFBpdm90LngsIGdyb3VwUGl2b3QueSwgcmFuZEkoIGRpc3RNaW4sIGRpc3RNYXggKSwgcmFuZCggMCwgTWF0aC5QSSAqIDIpICk7XHRcdFxyXG5cclxuXHRcdFx0bGV0IHJhbmRTaXplID0gcmFuZEkoIDAsIDEwICk7XHJcblxyXG5cdFx0XHRsZXQgc3RhciA9IHtcclxuXHRcdFx0XHR4OiByYW5kUG9zaXRpb24ueCxcclxuXHRcdFx0XHR5OiByYW5kUG9zaXRpb24ueSxcclxuXHRcdFx0XHRyOiByYW5kU2l6ZSA+IDggPyByYW5kKCAwLjMsIDMgKSA6IHJhbmQoIDAuMSwgMS41ICksXHJcblx0XHRcdFx0Y29sb3I6IHtcclxuXHRcdFx0XHRcdHI6IDI1NSwgZzogMjU1LCBiOiAyNTUsIGE6IDFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXIuZCA9IHRyaWcuZGlzdCggc3Rhci54LCBzdGFyLnksIHRoaXMuY29uZmlnLnBpdm90LngsIHRoaXMuY29uZmlnLnBpdm90LnkgKTtcclxuXHRcdFx0c3Rhci5hID0gdHJpZy5hbmdsZSggc3Rhci54LCBzdGFyLnksIHRoaXMuY29uZmlnLnBpdm90LngsIHRoaXMuY29uZmlnLnBpdm90LnkgKTtcclxuXHRcdFxyXG5cdFx0XHR0aGlzLnN0YXJzQXJyLnB1c2goIHN0YXIgKTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHJcblx0Y2hlY2tCb3VuZHM6IGZ1bmN0aW9uKCBzdGFyICkge1xyXG5cdFx0aWYgKCBzdGFyLnggLSBzdGFyLnIgPiB0aGlzLnJlbmRlckNvbmZpZy53ICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdH0sXHJcblxyXG5cdGNoZWNrUmVuZGVyQm91bmRzOiBmdW5jdGlvbiggc3RhciApIHtcclxuXHRcdGlmICggc3Rhci54IC0gc3Rhci5yID4gMCApIHtcclxuXHRcdFx0aWYgKCBzdGFyLnggLSBzdGFyLnIgPCB0aGlzLnJlbmRlckNvbmZpZy53ICkge1xyXG5cdFx0XHRcdGlmICggc3Rhci55IC0gc3Rhci5yID4gMCApIHtcclxuXHRcdFx0XHRcdGlmICggc3Rhci55IC0gc3Rhci5yIDwgdGhpcy5yZW5kZXJDb25maWcuaCApIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHJcblx0cmVzZXRQb3NpdGlvbjogZnVuY3Rpb24oIHN0YXIgKSB7XHJcblx0XHRzdGFyLmEgPSB0aGlzLmNvbmZpZy5yZXNldEE7XHJcblx0fSxcclxuXHJcblx0cmVuZGVyOiBmdW5jdGlvbiggc3RhciApIHtcclxuXHJcblx0XHRjID0gdGhpcy5yZW5kZXJDb25maWcuY3R4O1xyXG5cdFx0Yy5nbG9iYWxBbHBoYSA9IHRoaXMuY29uZmlnLmdsb2JhbEFscGhhO1xyXG5cdFx0Yy5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG5cdFx0Yy5maWxsQ2lyY2xlKCBzdGFyLngsIHN0YXIueSwgc3Rhci5yICk7XHJcblx0XHRjLmdsb2JhbEFscGhhID0gMTtcclxuXHR9LFxyXG5cclxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdGxldCB0aGlzQ291bnQgPSB0aGlzLmNvbmZpZy5jb3VudDtcclxuXHRcdGxldCBncm91cFBpdm90ID0gdGhpcy5jb25maWcucGl2b3Q7XHJcblxyXG5cdFx0Zm9yICggbGV0IGkgPSB0aGlzQ291bnQgLSAxOyBpID49IDA7IGktLSApIHtcclxuXHJcblx0XHRcdGxldCBzdGFyID0gdGhpcy5zdGFyc0FyclsgaSBdO1xyXG5cclxuXHRcdFx0aWYoIHRoaXMuY2hlY2tSZW5kZXJCb3VuZHMoIHN0YXIgKSA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHR0aGlzLnJlbmRlciggc3RhciApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRsZXQgbmV3UG9zID0gdHJpZy5yYWRpYWxEaXN0cmlidXRpb24oIGdyb3VwUGl2b3QueCwgZ3JvdXBQaXZvdC55LCBzdGFyLmQsIHN0YXIuYSApO1xyXG5cdFx0XHRcclxuXHJcblx0XHRcdHN0YXIueCA9IG5ld1Bvcy54O1xyXG5cdFx0XHRzdGFyLnkgPSBuZXdQb3MueTtcclxuXHJcblx0XHRcdHN0YXIuYSArPSBncm91cFBpdm90LnJWZWw7XHJcblxyXG5cdFx0XHQvLyBpZiggdGhpcy5jaGVja0JvdW5kcyggc3RhciApID09PSB0cnVlICkge1xyXG5cdFx0XHQvLyBcdHRoaXMucmVzZXRQb3NpdGlvbiggc3RhciApO1xyXG5cdFx0XHQvLyB9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlQWxwaGEoKTtcclxuXHJcblx0fVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHRoZVN0YXJzOyIsInZhciBfdHJpZ29ub21pY1V0aWxzO1xyXG5cclxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cclxuXHJcbi8qKlxyXG4qIGNhY2hlZCB2YWx1ZXNcclxuKi9cclxuXHJcbnZhciBwaUJ5SGFsZiA9IE1hdGguUGkgLyAxODA7XHJcbnZhciBoYWxmQnlQaSA9IDE4MCAvIE1hdGguUEk7XHJcbnZhciB0d29QaSA9IDIgKiBNYXRoLlBJO1xyXG5cclxuLyoqXHJcbiogcHJvdmlkZXMgdHJpZ29ubWljIHV0aWwgbWV0aG9kcy5cclxuKlxyXG4qIEBtaXhpblxyXG4qL1xyXG52YXIgdHJpZ29ub21pY1V0aWxzID0gKF90cmlnb25vbWljVXRpbHMgPSB7XHJcblxyXG5cdHR3b1BpOiB0d29QaSxcclxuXHRwaUJ5SGFsZjogcGlCeUhhbGYsXHJcblx0aGFsZkJ5UGk6IGhhbGZCeVBpLFxyXG5cclxuXHRhbmdsZTogZnVuY3Rpb24ob3JpZ2luWCwgb3JpZ2luWSwgdGFyZ2V0WCwgdGFyZ2V0WSkge1xyXG4gICAgICAgIHZhciBkeCA9IG9yaWdpblggLSB0YXJnZXRYO1xyXG4gICAgICAgIHZhciBkeSA9IG9yaWdpblkgLSB0YXJnZXRZO1xyXG4gICAgICAgIHZhciB0aGV0YSA9IE1hdGguYXRhbjIoLWR5LCAtZHgpO1xyXG4gICAgICAgIHJldHVybiB0aGV0YTtcclxuICAgIH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY2FsY3VsYXRlIGRpc3RhbmNlIGJldHdlZW4gMiB2ZWN0b3IgY29vcmRpbmF0ZXMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB4MSAtIFggY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHkxIC0gWSBjb29yZGluYXRlIG9mIHZlY3RvciAxLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDIgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MiAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMi5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRkaXN0OiBmdW5jdGlvbiBkaXN0KHgxLCB5MSwgeDIsIHkyKSB7XHJcblx0XHR4MiAtPSB4MTt5MiAtPSB5MTtcclxuXHRcdHJldHVybiBNYXRoLnNxcnQoeDIgKiB4MiArIHkyICogeTIpO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gY29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnMuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWVzIC0gdGhlIGRlZ3JlZSB2YWx1ZSB0byBjb252ZXJ0LlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGRlZ3JlZXNUb1JhZGlhbnM6IGZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlcykge1xyXG5cdFx0cmV0dXJuIGRlZ3JlZXMgKiBwaUJ5SGFsZjtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gcmFkaWFucyAtIHRoZSBkZWdyZWUgdmFsdWUgdG8gY29udmVydC5cclxuICogQHJldHVybnMge251bWJlcn0gcmVzdWx0LlxyXG4gKi9cclxuXHRyYWRpYW5zVG9EZWdyZWVzOiBmdW5jdGlvbiByYWRpYW5zVG9EZWdyZWVzKHJhZGlhbnMpIHtcclxuXHRcdHJldHVybiByYWRpYW5zICogaGFsZkJ5UGk7XHJcblx0fSxcclxuXHJcblx0LypcclxuIHJldHVybiB1c2VmdWwgVHJpZ29ub21pYyB2YWx1ZXMgZnJvbSBwb3NpdGlvbiBvZiAyIG9iamVjdHMgaW4geC95IHNwYWNlXHJcbiB3aGVyZSB4MS95MSBpcyB0aGUgY3VycmVudCBwb2lzdGlvbiBhbmQgeDIveTIgaXMgdGhlIHRhcmdldCBwb3NpdGlvblxyXG4gKi9cclxuXHQvKipcclxuICogQGRlc2NyaXB0aW9uIGNhbGN1bGF0ZSB0cmlnb21vbWljIHZhbHVlcyBiZXR3ZWVuIDIgdmVjdG9yIGNvb3JkaW5hdGVzLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geDEgLSBYIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDEuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB5MSAtIFkgY29vcmRpbmF0ZSBvZiB2ZWN0b3IgMS5cclxuICogQHBhcmFtIHtudW1iZXJ9IHgyIC0gWCBjb29yZGluYXRlIG9mIHZlY3RvciAyLlxyXG4gKiBAcGFyYW0ge251bWJlcn0geTIgLSBZIGNvb3JkaW5hdGUgb2YgdmVjdG9yIDIuXHJcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENhbGN1bGF0aW9uXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaXN0YW5jZSBUaGUgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhbmdsZSBUaGUgYW5nbGUgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqIEByZXR1cm5zIHsgQ2FsY3VsYXRpb24gfSB0aGUgY2FsY3VsYXRlZCBhbmdsZSBhbmQgZGlzdGFuY2UgYmV0d2VlbiB2ZWN0b3JzXHJcbiAqL1xyXG5cdGdldEFuZ2xlQW5kRGlzdGFuY2U6IGZ1bmN0aW9uIGdldEFuZ2xlQW5kRGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHJcblx0XHQvLyBzZXQgdXAgYmFzZSB2YWx1ZXNcclxuXHRcdHZhciBkWCA9IHgyIC0geDE7XHJcblx0XHR2YXIgZFkgPSB5MiAtIHkxO1xyXG5cdFx0Ly8gZ2V0IHRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBwb2ludHNcclxuXHRcdHZhciBkID0gTWF0aC5zcXJ0KGRYICogZFggKyBkWSAqIGRZKTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdC8vIHZhciByYWRpYW5zID0gTWF0aC5hdGFuMih5RGlzdCwgeERpc3QpICogMTgwIC8gTWF0aC5QSTtcclxuXHRcdC8vIGFuZ2xlIGluIHJhZGlhbnNcclxuXHRcdHZhciByID0gTWF0aC5hdGFuMihkWSwgZFgpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0ZGlzdGFuY2U6IGQsXHJcblx0XHRcdGFuZ2xlOiByXHJcblx0XHR9O1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG4gKiBAZGVzY3JpcHRpb24gZ2V0IG5ldyBYIGNvb3JkaW5hdGUgZnJvbSBhbmdsZSBhbmQgZGlzdGFuY2UuXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW5zIC0gdGhlIGFuZ2xlIHRvIHRyYW5zZm9ybSBpbiByYWRpYW5zLlxyXG4gKiBAcGFyYW0ge251bWJlcn0gZGlzdGFuY2UgLSB0aGUgZGlzdGFuY2UgdG8gdHJhbnNmb3JtLlxyXG4gKiBAcmV0dXJucyB7bnVtYmVyfSByZXN1bHQuXHJcbiAqL1xyXG5cdGdldEFkamFjZW50TGVuZ3RoOiBmdW5jdGlvbiBnZXRBZGphY2VudExlbmd0aChyYWRpYW5zLCBkaXN0YW5jZSkge1xyXG5cdFx0cmV0dXJuIE1hdGguY29zKHJhZGlhbnMpICogZGlzdGFuY2U7XHJcblx0fVxyXG5cclxufSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwiZ2V0QWRqYWNlbnRMZW5ndGhcIiwgZnVuY3Rpb24gZ2V0QWRqYWNlbnRMZW5ndGgocmFkaWFucywgZGlzdGFuY2UpIHtcclxuXHRyZXR1cm4gTWF0aC5zaW4ocmFkaWFucykgKiBkaXN0YW5jZTtcclxufSksIF9kZWZpbmVQcm9wZXJ0eShfdHJpZ29ub21pY1V0aWxzLCBcImZpbmROZXdQb2ludFwiLCBmdW5jdGlvbiBmaW5kTmV3UG9pbnQoeCwgeSwgYW5nbGUsIGRpc3RhbmNlKSB7XHJcblx0cmV0dXJuIHtcclxuXHRcdHg6IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlICsgeCxcclxuXHRcdHk6IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlICsgeVxyXG5cdH07XHJcbn0pLCBfZGVmaW5lUHJvcGVydHkoX3RyaWdvbm9taWNVdGlscywgXCJjYWxjdWxhdGVWZWxvY2l0aWVzXCIsIGZ1bmN0aW9uIGNhbGN1bGF0ZVZlbG9jaXRpZXMoeCwgeSwgYW5nbGUsIGltcHVsc2UpIHtcclxuXHR2YXIgYTIgPSBNYXRoLmF0YW4yKE1hdGguc2luKGFuZ2xlKSAqIGltcHVsc2UgKyB5IC0geSwgTWF0aC5jb3MoYW5nbGUpICogaW1wdWxzZSArIHggLSB4KTtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eFZlbDogTWF0aC5jb3MoYTIpICogaW1wdWxzZSxcclxuXHRcdHlWZWw6IE1hdGguc2luKGEyKSAqIGltcHVsc2VcclxuXHR9O1xyXG59KSwgX2RlZmluZVByb3BlcnR5KF90cmlnb25vbWljVXRpbHMsIFwicmFkaWFsRGlzdHJpYnV0aW9uXCIsIGZ1bmN0aW9uIHJhZGlhbERpc3RyaWJ1dGlvbihjeCwgY3ksIHIsIGEpIHtcclxuXHRyZXR1cm4ge1xyXG5cdFx0eDogY3ggKyByICogTWF0aC5jb3MoYSksXHJcblx0XHR5OiBjeSArIHIgKiBNYXRoLnNpbihhKVxyXG5cdH07XHJcbn0pLCBfdHJpZ29ub21pY1V0aWxzKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLnRyaWdvbm9taWNVdGlscyA9IHRyaWdvbm9taWNVdGlsczsiXX0=
