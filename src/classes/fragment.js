import { COMMENT_NODE } from 'domconstants/constants';

import native from 'custom-function/factory';

let active = false;

/** @extends {DocumentFragment} for real! */
export default class Fragment extends native(DocumentFragment) {
  // static u/domdiff utility
  static diff(node, op) {
    return active && node instanceof Fragment ?
      ((1 / op) < 0 ?
        (op ? /* remove */ node.#remove(true) : /* after */ node.#lastChild) :
        (op ? /* insert */ node.valueOf() : /* before */ node.#firstChild)) :
      node;
  }

  // privates
  #firstChild;  // the virtual firstChild as reference
  #lastChild;   // the virtual lastChild as reference

  /**
   * Drop known nodes from their parents and optionally keep its lastChild in there
   * @param {boolean} keepLast
   * @returns {ChildNode | void}
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
    // empty html`` fragment or array as first node html`${[]}!`
    this.#firstChild = !firstChild || firstChild.nodeType === COMMENT_NODE ?
      super.insertBefore(document.createComment('<>'), firstChild) :
      firstChild;
    this.#lastChild = super.lastChild;
    active = true;
  }

  get firstChild() { return this.#firstChild; }
  get lastChild() { return this.#lastChild; }
  get parentNode() { return this.#lastChild.parentNode; }

  get childNodes() {
    let firstChild = this.#firstChild;
    const childNodes = [firstChild], lastChild = this.#lastChild;
    while (firstChild != lastChild)
      childNodes.push(firstChild = firstChild.nextSibling);
    return childNodes;
  }

  remove() { this.#remove(false); }

  /** @param {Node} node */
  replaceWith(node) {
    const last = this.#remove(true);
    const child = this.#lastChild;
    // conflict with u/domdiff remove(true)
    if (last !== child) super.appendChild(last);
    // let it throw if child wasn't even connected
    child.replaceWith(node);
  }

  valueOf() {
    const { parentNode } = this.#lastChild;
    // fragment is not even connected
    if (!parentNode) super.appendChild(this.#lastChild);
    // fragment is being moved/appended elsewhere
    else if (parentNode !== this) super.replaceChildren(...this.childNodes);
    return this;
  }
}
