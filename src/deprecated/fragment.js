import native from 'custom-function/factory';
import { drop } from '../utils.js';

/** @extends {DocumentFragment} for real! */
export default class Fragment extends native(DocumentFragment) {
  // static u/domdiff utility
  static diff(node, op) {
    return node instanceof Fragment ?
      ((1 / op) < 0 ?
        (op ? /* remove */ node.#remove(true) : /* after */ node.lastChild) :
        (op ? /* insert */ node.valueOf() : /* before */ node.firstChild)) :
      node;
  }

  // privates
  #childNodes;

  /**
   * Drop known nodes from their parents and optionally keep its lastChild in there
   * @param {boolean} keepLast
   * @returns {ChildNode | null}
   */
  #remove(keepLast) {
    const childNodes = this.#childNodes;
    let lastChild;
    drop(
      childNodes.at(0),
      keepLast ? childNodes.at(-2) : (lastChild = childNodes.at(-1))
    );
    return lastChild;
  }

  // public utilities and accessors
  /** @param {DocumentFragment} fragment */
  constructor(fragment) {
    super(fragment);
    this.#childNodes = [...super.childNodes];
  }

  get childNodes() { return this.#childNodes; }
  get firstChild() { return this.#childNodes.at(0); }
  get lastChild() { return this.#childNodes.at(-1); }
  get parentNode() { return this.lastChild?.parentNode; }

  remove() { this.#remove(false); }

  /** @param {Node} node */
  replaceWith(node) {
    this.#remove(true).replaceWith(node);
  }

  valueOf() {
    if (this.parentNode !== this)
      super.replaceChildren(...this.#childNodes);
    return this;
  }
}
