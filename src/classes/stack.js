import empty from '@webreflection/empty/array';

import { isArray, isHole, isObject } from '../utils.js';

const STACK = 0;
const ANY = 1;
const ARRAY = 2;
const HOLE = 3;
const OBJECT = 4;

const type = value => {
  if (isHole(value)) return HOLE;
  // disambiguate between listeners as array and holes as nodes
  if (isArray(value)) return value.length && !isHole(value[0]) ? ANY : ARRAY;
  return isObject(value) ? OBJECT : ANY;
};

/**
 * @param {ANY | ARRAY | HOLE | OBJECT} type 
 * @returns {Stack}
 */
const create = type => {
  const stack = new Stack(type);
  if (type === ARRAY) stack.cache = [];
  return stack;
};

/**
 * @param {unknown[]} values
 * @param {Stack[]} cache
 * @returns {unknown[]}
 */
const unroll = (values, { cache }) => {
  const { length } = values;
  if (length < cache.length) cache.splice(length);
  for (let i = 0; i < length; i++) {
    const curr = values[i];
    const prev = cache[i] || (cache[i] = create(type(curr)));
    switch (prev.type) {
      case HOLE: {
        const different = prev.as(curr);
        const value = prev.value.update(unroll(curr.values, prev));
        values[i] = different ? value.valueOf() : value;
        break;
      }
      case ARRAY: {
        values[i] = unroll(curr, prev);
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
  return values;
};

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
    /** @type {import("../types.js").Info | import("../types.js").GenericNode | null} */
    this.value = null;
    /** @type {Stack[]} */
    this.cache = empty;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {boolean}
   */
  as({ node, update, values }) {
    const different = this.node !== node;
    if (different) {
      this.node = node;
      this.value = node.create(update, false);
      this.cache = values.length ? [] : empty;
    }
    return different;
  }

  /**
   * @param {Element | DocumentFragment | ReplaceChildren} where
   * @param {import("../types.js").Hole} what
   */
  update(where, what) {
    const different = this.as(what);
    /** @type {import("../types.js").Info} */
    const value = this.value;
    const node = value.update(unroll(what.values, this));
    if (different) where.replaceChildren(node.valueOf());
  }
}
