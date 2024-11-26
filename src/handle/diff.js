import { ANY, ARRAY } from '../constants.js';

// import udomdiff from 'udomdiff';
import udomdiff from '../domdiff.js';

import Fragment from '../classes/fragment.js';
const { diff } = Fragment;

import { empty } from '../utils.js';

const valueOf = node => node.valueOf();
const remove = node => node.remove();

/** @typedef {ANY | ARRAY | import("../constants.js").OBJECT} HINT */

/**
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

/**
 * 
 * @param {Comment} node
 * @param {Node[]} prev
 * @returns {(curr:Node[]) => void}
 */
const array = (node, prev) => curr => {
  const { length } = curr;
  if (length && prev !== empty)
    prev = udomdiff(prev, curr, diff, node);
  else {
    prev = length ? curr : empty;
    node.parentNode.replaceChildren(...prev, node);
  }
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
const multi = (node, hint) => (
  hint === ARRAY ?
    array(node, empty) :
    (hint === ANY ?
      any(node, '') :
      object(node)
    )
);

/**
 * @param {Element} node
 * @param {HINT} hint
 * @returns {(value: any) => void}
 */
const oneOff = (node, hint) => value => {
  multi(node, hint)(value);
  if (hint === ARRAY) node.remove();
};

/**
 * @param {Node} node
 * @param {HINT} hint
 * @param {boolean} once
 */
export default (node, hint, once) => (once ? oneOff : multi)(node, hint);
