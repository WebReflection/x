import empty from '@webreflection/empty/array';

import Hole from './hole.js';
import Live from './live.js';

import { isArray } from '../utils.js';

const STACK = 0;
const ANY = 1;
const ARRAY = 2;
const HOLE = 3;
const OBJECT = 4;

const type = value => {
  if (typeof value === OBJECT && value) {
    if (value instanceof Hole) return HOLE;
    if (isArray(value)) return ARRAY;
    return OBJECT;
  }
  return ANY;
};

const unroll = (values, cache) => {
  const { length } = values;
  for (let i = 0; i < length; i++) {
    const curr = values[i];
    const prev = cache[i] || (cache[i] = new Stack(type(curr)));
    switch (prev.type) {
      case HOLE: {
        const replaceChildren = prev.as(curr);
        const value = prev.value.update(unroll(curr.values, prev.cache));
        values[i] = replaceChildren ? value.valueOf() : value;
        break;
      }
      case ARRAY: {
        if (prev.value === null && curr.length) {
          const value = type(curr[0]) === HOLE ? HOLE : ANY;
          prev.value = value;
          if (value === HOLE) prev.cache = [];
        }
        if (prev.value === HOLE)
          values[i] = unroll(curr, prev.cache);
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
  if (length < cache.length) cache.splice(length);
  return values;
};

export default class Stack {
  /**
   * @param {0 | 1 | 2 | 3 | 4} type
   */
  constructor(type = STACK) {
    /** @type {0 | 1 | 2 | 3 | 4} */
    this.type = type;
    /** @type {unknown} */
    this.value = null;
    /** @type {unknown[]} */
    this.cache = empty;
  }
  parse(node, update, values) {
    return new Hole(node, update, values);
  }
  as({ node, update, values }) {
    if (this.value?.node !== node) {
      this.value = new Live(node, update);
      this.cache = values.length ? [] : empty;
      return true;
    }
    return false;
  }
  update(where, what) {
    const replaceChildren = this.as(what);
    const value = this.value.update(unroll(what.values, this.cache));
    if (replaceChildren) where.replaceChildren(value.valueOf());
  }
}
