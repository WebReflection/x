import { ANY, ARRAY } from '../constants.js';

import udomdiff from 'udomdiff';

import Fragment from '../classes/fragment.js';

import { empty } from '../utils.js';

/** @typedef {ANY | ARRAY | import("../constants.js").OBJECT} HINT */

/**
 * 
 * @param {Text} node
 * @param {string?} prev
 * @returns {(curr:string?) => void}
 */
const any = (node, prev) => curr => {
  if (prev !== curr) {
    prev = curr;
    node.data = curr ?? '';
  }
};

const { diff } = Fragment;
/**
 * 
 * @param {Comment} node
 * @param {Node[]} prev
 * @returns {(curr:Node[]) => void}
 */
const array = (node, prev) => curr => {
  prev = udomdiff(
    node.parentNode,
    prev,
    curr.length ? curr : empty,
    diff,
    node
  );
};

/**
 * @param {Node} prev
 * @returns {(curr:Node) => void}
 */
const object = prev => curr => {
  if (prev !== curr) {
    prev.replaceWith(curr.valueOf());
    prev = curr;
  }
};

/**
 * @param {Element} node
 * @param {HINT} hint
 * @returns
 */
const multi = (node, hint) => {
  if (hint === ARRAY) return array(node, empty);
  if (hint === ANY) return any(node, '');
  return object(node);
};

/**
 * @param {Element} node
 * @param {HINT} hint
 * @returns {(value: any) => void}
 */
const oneOff = (node, hint) => value => {
  if (hint === ARRAY) {
    array(node, empty)(value);
    node.remove();
  }
  else if (hint === ANY) any(node, '')(value);
  else object(node)(value);
};

/**
 * @param {Element} node
 * @param {HINT} hint
 * @param {boolean} once
 */
export default (node, hint, once) => (once ? oneOff : multi)(node, hint);
