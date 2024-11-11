import {
  ARRAY,
  HOLE,
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
 * @param {import("../types.js").Hole[]} values
 */
const array = (cache, values) => {
  const { length } = values;
  if (length < cache.length)
    cache.splice(length);
  for (let i = 0; i < length; i++) {
    const { v: node } = diff(
      cache[i] || (cache[i] = new Stack),
      values[i]
    );
    values[i] = node;
  }
};

const entries = ({ k, v }) => abc(k, v, v === HOLE ? new Stack : []);

export default class Stack {
  static diff = diff;

  /** @type {import("../types.js").Node | import("../types.js").Keyed | null} */
  holes = null;
  /** @type {{ update: (values: unknown[]) => GenericNode }?} */
  update = null;
  /** @type {[number, number, Stack | Stack[]][]} */
  cache = empty;

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {boolean}
   */
  as({ k: holes, v: create }) {
    if (this.holes !== holes) {
      this.holes = holes;
      this.update = create(false);
      this.cache = holes.length ? holes.map(entries) : empty;
      return true;
    }
    return false;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {import("../types.js").GenericNode}
   */
  get(values) {
    for (const { a: i, b: type, c: ref } of this.cache) {
      if (type === ARRAY)
        array(ref, values[i]);
      else {
        const { k: different, v: node } = diff(ref, values[i]);
        values[i] = different ? node.valueOf() : node;
      }
    }
    return this.update(values);
  }
}
