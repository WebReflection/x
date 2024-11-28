// @ts-check

import { text } from './utils.js';

/**
 * @param {DocumentFragment} fragment
 * @returns {DocumentFragment | HTMLElement | SVGElement | Node}
 */
const getContent = fragment => {
  const { firstChild, lastChild } = fragment;
  return firstChild ?
    (firstChild === lastChild ? fragment.removeChild(firstChild) : fragment) :
    text('')
  ;
};

let template = document.createElement('template');

/** @type {(text:string) => DocumentFragment | HTMLElement | Node} */
export const html = text => {
  template.innerHTML = text;
  const { content } = template;
  const node = getContent(content);
  if (node === content)
    template = /** @type {HTMLTemplateElement} */(template.cloneNode(false));
  return node;
};

/** @type {Range} */
let range;

/** @type {(text:string) => DocumentFragment | SVGElement | Node} */
export const svg = text => {
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
  }
  return getContent(range.createContextualFragment(text));
};
