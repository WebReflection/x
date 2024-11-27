// @WTF-ts-check

import native from 'custom-function/factory';

// // cool for SSR but too much noise at runtime
// /**
//  * @param {string} content
//  * @returns
//  */
// const comment = content => document.createComment(content);
// /**
//  * @param {DocumentFragment} fragment
//  */
// const surround = fragment => {
//   fragment.insertBefore(comment('<>'), fragment.firstChild);
//   fragment.appendChild(comment('</>'));
// };

let active = false;

/** @type {Range} */
let range;

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
        (op ? /* remove */ node.#remove(true) : /* after */ node.#childNodes.at(-1)) :
        (op ? /* insert */ node.valueOf() : /* before */ node.#childNodes[0])) :
      node
  );

  // privates
  /** @type {Node[]} */
  #childNodes;

  /**
   * Drop known nodes from their parents and optionally keep its lastChild in there
   * @param {boolean} keepLast
   * @returns {Node}
   */
  #remove(keepLast) {
    const lastChild = this.#childNodes.at(-1);
    range.setStartBefore(this.#childNodes[0]);
    if (keepLast) range.setEndBefore(lastChild);
    else range.setEndAfter(lastChild);
    range.deleteContents();
    return lastChild;
  }

  // public utilities and accessors
  /** @param {DocumentFragment} fragment */
  constructor(fragment) {
    // surround(fragment);
    // @ts-ignore
    super(fragment);
    this.#childNodes = [...super.childNodes];
    if (!range) range = document.createRange();
    active = true;
  }

  remove() { this.#remove(false); }

  /** @param {Node} node */
  replaceWith(node) {
    this.#remove(true).replaceWith(node);
  }

  valueOf() {
    if (!super.hasChildNodes())
      super.replaceChildren(...this.#childNodes);
    return this;
  }
}
