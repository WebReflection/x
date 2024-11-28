// @ts-check

import { ATTRIBUTE_NODE, DOCUMENT_FRAGMENT_NODE } from '../constants.js';

import Fragment from '../classes/fragment.js';

import { empty } from '../utils.js';

const noop = () => {};

/**
 * @param {Node} node
 * @param {import("../parser.js").Path<import("../parser.js").Type,any?>[] | never[]} paths
 * @param {import("../tag.js").Update} update
 * @returns
 */
export default (node, paths, update) => {
  const isFragment = node.nodeType === DOCUMENT_FRAGMENT_NODE;
  /**
   * @param {boolean} once
   * @returns {(values:any[]) => Node}
   */
  return once => {
    const { length } = paths;
    const updates = /** @type {function[] | never[]} */(length ? [] : empty);
    let dom = document.importNode(node, true);
    for (let
      /** @type {number[] | never[]} */ prevPath = empty, node = dom, i = 0;
      i < length; i++
    ) {
      const { type, path, extra } = paths[i];
      if (prevPath !== path) {
        prevPath = path;
        node = dom;
        for (let { length: i } = path; i--; node = node.childNodes[path[i]]);
      }
      updates[i] = type === ATTRIBUTE_NODE && !extra ?
        noop : update[type](/** @type {Element & Comment & HTMLElement} */(node), once, extra);
    }
    if (isFragment) dom = new Fragment(/** @type {DocumentFragment} */(dom));
    return values => {
      for (let i = 0; i < length; i++) updates[i](values[i]);
      return dom;
    };
  };
};
