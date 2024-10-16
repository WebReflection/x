import native from './native.js';

const range = document.createRange();

const drop = ({ firstChild, lastChild }, preserve) => {
  if (preserve) range.setStartAfter(firstChild);
  else range.setStartBefore(firstChild);
  range.setEndAfter(lastChild);
  range.deleteContents();
  return firstChild;
};

export default class Fragment extends native(DocumentFragment) {
  static diff(node, operation) {
    return #childNodes in node ?
      ((1 / operation) < 0 ?
        (operation ? drop(node, true) : node.lastChild) :
        (operation ? node.valueOf() : node.firstChild)) :
      node;
  }
  #childNodes;
  constructor(fragment) {
    super(fragment);
    this.#childNodes = [...fragment.childNodes];
  }
  get firstChild() { return this.#childNodes.at(0); }
  get lastChild() { return this.#childNodes.at(-1); }
  get parentNode() { return this.#childNodes.at(0)?.parentNode; }
  remove() { drop(this, false); }
  replaceWith(node) { drop(this, true).replaceWith(node); }
  valueOf() {
    if (this.parentNode !== this)
      this.replaceChildren(...this.#childNodes);
    return this;
  }
}
