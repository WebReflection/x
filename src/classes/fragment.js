// @wtf-ts-check

import { COMMENT_NODE } from '../constants.js';

import native from 'custom-function/factory';

let active = false;

/** @extends {DocumentFragment} for real! */
export default class Fragment extends native(DocumentFragment) {
  // u/domdiff helper
  /**
   * @param {Node | Fragment} node
   * @param {1 | 0 | -0 | -1} op
   * @returns
   */
  static diff = (node, op) => /** @type {Node | Fragment} */(
    active && node instanceof Fragment ?
      ((1 / op) < 0 ?
        (op ? /* remove */ node.#remove(true) : /* after */ node.lastChild) :
        (op ? /* insert */ node.valueOf() : /* before */ node.firstChild)) :
      node
  );

  // privates
  /** @type {Node[]} */
  #childNodes;

  /**
   * @param {Node} child
   * @param {0 | 1} op
   * @param  {...Node} rest
   */
  #splice(child, op, ...rest) {
    const i = this.#childNodes.indexOf(child);
    if (-1 < i) this.#childNodes.splice(i, op, ...rest);
  }

  /**
   * Drop known nodes from their parents and optionally keep its lastChild in there
   * @param {boolean} keepLast
   * @returns {Node | void}
   */
  #remove(keepLast) {
    let { childNodes } = this, lastChild;
    if (keepLast) lastChild = childNodes.pop();
    super.replaceChildren(...childNodes);
    return lastChild;
  }

  // public utilities and accessors
  /** @param {DocumentFragment} fragment */
  constructor(fragment) {
    super(fragment);
    const firstChild = super.firstChild;
    // TODO: no need to check for the COMMENT_NODE ???
    if (!firstChild || firstChild.nodeType === COMMENT_NODE)
      super.insertBefore(document.createComment('<>'), firstChild);
    this.#childNodes = [...super.childNodes];
    active = true;
  }

  /** @type {Node[]} */
  get childNodes() { return this.#childNodes.slice(0) }

  /** @type {Node?} */
  get firstChild() { return this.#childNodes.at(0) }

  /** @type {Node?} */
  get lastChild() { return this.#childNodes.at(-1) }

  get parentNode() { return this.#childNodes.at(-1).parentNode }

  /** @type {<T extends Node>(node: T) => T} */
  appendChild(child) {
    this.#childNodes.push(child);
    this.lastChild?.after(child);
    return child;
  }

  /** @type {<T extends Node>(node: T, child: Node | null) => T} */
  insertBefore(child, referenceNode) {
    if (referenceNode) {
      referenceNode.before(child);
      this.#splice(referenceNode, 0, child);
    }
    else {
      const { length } = this.#childNodes;
      if (length) this.#childNodes[length - 1].after(child);
      this.#childNodes[length] = child;
    }
    return child;
  }

  /**
   * @param {Node} child 
   * @param {Node?} referenceNode
   * @returns
   */
  moveBefore(child, referenceNode) {
    if (referenceNode) {
      const { parentNode } = referenceNode;
      // @ts-ignore
      parentNode.moveBefore(child, referenceNode);
      this.#splice(referenceNode, 0, child);
    }
    else
      this.insertBefore(child, referenceNode);
    return child;
  }

  /** @type {<T extends Node>(child: T) => T} */
  removeChild(child) {
    child.remove();
    this.#splice(child, 1);
    return child;
  }

  /** @type {<T extends Node>(node: Node, child: T) => T} */
  replaceChild(child, referenceNode) {
    referenceNode.replaceWith(child);
    this.#splice(child, 1, referenceNode);
    return referenceNode;
  }

  remove() { this.#remove(false); }

  /** @param {Node} node */
  replaceWith(node) {
    const last = this.#remove(true);
    if (last.isConnected)
      child.replaceWith(node);
  }

  valueOf() {
    if (this.parentNode !== this)
      super.replaceChildren(...this.#childNodes);
    return this;
  }
}
