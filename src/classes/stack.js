import empty from '@webreflection/empty/array';

import { COMMENT_NODE } from 'domconstants/constants';

import {
  STACK,
  ANY,
  ARRAY,
  HOLE,
  OBJECT,
} from '../constants.js';

/**
 * @typedef {Object} ReplaceChildren
 * @prop {(node:Node) => void} replaceChildren
 */

export default class Stack {
  /**
   * @param {STACK | ANY | ARRAY | HOLE | OBJECT} type
   */
  constructor(type = STACK) {
    this.type = type;
    /** @type {import("../types.js").ParsedNode?} */
    this.node = null;
    /** @type {import("../types.js").Info | import("../types.js").Keyed | null} */
    this.value = null;
    /** @type {Stack[]} */
    this.cache = type === ARRAY ? [] : empty;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {boolean}
   */
  as({ node, update, values: { length } }) {
    const different = this.node !== node;
    if (different) {
      this.node = node;
      this.value = node.create(update, false);
      this.cache = length ? [] : empty;
    }
    return different;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {import("../types.js").GenericNode}
   */
  unroll({ values }) {
    const { cache, value, node: { paths } } = this;
    for (let i = 0, { length } = values; i < length; i++) {
      const curr = values[i];
      const { type, extra } = paths[i];
      if (type === COMMENT_NODE) {
        const prev = cache[i] || (cache[i] = new Stack(extra));
        switch (prev.type) {
          case HOLE: {
            const different = prev.as(curr);
            const node = prev.unroll(curr);
            values[i] = different ? node.valueOf() : node;
            break;
          }
          case ARRAY: {
            prev.unrollArray(curr);
            break;
          }
          case OBJECT: {
            if (prev.value !== curr) {
              prev.value = curr;
              values[i] = curr.valueOf();
            }
            break;
          }
        }
      }
      else cache[i] = null;
    }
    return value.update(values);
  }

  unrollArray(values) {
    const { cache } = this;
    const { length } = values;
    if (length < cache.length) cache.splice(length);
    for (let i = 0; i < length; i++) {
      const curr = values[i];
      const prev = cache[i] || (cache[i] = new Stack(HOLE));
      prev.as(curr);
      values[i] = prev.unroll(curr);
    }
  }

  /**
   * @param {Element | DocumentFragment | ReplaceChildren} where
   * @param {import("../types.js").Hole} what
   */
  update(where, what) {
    const different = this.as(what);
    const node = this.unroll(what);
    if (different) where.replaceChildren(node.valueOf());
  }
}
