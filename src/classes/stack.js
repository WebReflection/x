import {
  ANY,
  ARRAY,
  COMMENT_NODE,
  HOLE,
  OBJECT,
  STACK,
} from '../constants.js';

import { empty } from '../utils.js';
import { abc, kv } from '../literals.js';

/**
 * @typedef {Object} ReplaceChildren
 * @prop {(node:Node) => void} replaceChildren
 */

/**
 * @param {Stack} stack
 * @param {import("../types.js").Hole} hole
 * @returns {{ k: boolean, v: import("../types.js").GenericNode] }}
 */
const diff = (stack, { k, v }) => kv(stack.as(k), stack.get(v));

/**
 * @param {Stack[]} cache
 * @param {import("../types.js").Hole[]} holes
 */
const array = (cache, holes) => {
  const { length } = holes;
  if (length < cache.length)
    cache.splice(length);
  for (let i = 0; i < length; i++) {
    const { v: node } = diff(
      cache[i] || (cache[i] = new Stack),
      holes[i]
    );
    holes[i] = node;
  }
};

const asCache = ({ k, v }) => abc(k, v, v === HOLE ? new Stack : []);

export default class Stack {
  static diff = diff;

  /** @type {import("../types.js").Node | import("../types.js").Keyed | null} */
  node = null;
  /** @type {{ update: (values: unknown[]) => GenericNode }?} */
  value = null;
  /** @type {[number, number, Stack | Stack[]][]} */
  cache = empty;

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {boolean}
   */
  as(node) {
    if (this.node !== node) {
      const cache = node.holes.map(asCache);
      this.node = node;
      this.value = node.create(false);
      this.cache = cache.length ? cache : empty;
      return true;
    }
    return false;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {import("../types.js").GenericNode}
   */
  get(values) {
    const { value, cache } = this;
    for (let j = 0, { length } = cache; j < length; j++) {
      const { a: i, b: type, c: value } = cache[j];
      if (type === ARRAY)
        array(value, values[i]);
      else {
        const { k: different, v: node } = diff(value, values[i]);
        values[i] = different ? node.valueOf() : node;
      }
    }
    return value.update(values);
  }
}
