import { ARRAY, HOLE } from '../constants.js';

import Cache from './cache.js';
import KeyValue from './key-value.js';

import { empty } from '../utils.js';

/**
 * @typedef {Object} ReplaceChildren
 * @prop {(node:Node) => void} replaceChildren
 */

/** @typedef {import("./cache.js").CachedEntries} CachedEntries */
/** @typedef {import("./key-value.js").HoleDetails} HoleDetails */
/** @typedef {import("./key-value.js").Keyed} Keyed */
/** @typedef {import("./key-value.js").NonKeyed} NonKeyed */
/** @typedef {import("./key-value.js").TagResult} TagResult */

/**
 * @param {Stack} stack
 * @param {TagResult} tagReturn
 * @returns
 */
const diff = (stack, { k, v }) => new KeyValue(stack.as(k), stack.get(v));

/**
 * @param {Stack[]} cache
 * @param {TagResult[]} values
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

/**
 * @param {HoleDetails} details
 * @returns {CachedEntries}
 */
const entries = ({ k, v }) => new Cache(k, v, v === HOLE ? new Stack : []);

export default class Stack {
  static diff = diff;

  /** @type {import("./key-value.js").CreateUpdate?} */
  create = null;
  /** @type {null | (values: any[]) => Node} */
  update = null;
  /** @type {never[] | CachedEntries[]} */
  cache = empty;

  /**
   * @param {Keyed | NonKeyed} entry
   * @returns
   */
  as(entry) {
    const different = this.create !== entry.k;
    if (different) {
      const { k: create, v: holes } = entry;
      this.create = create;
      this.update = create(false);
      this.cache = holes === empty ? empty : holes.map(entries);
    }
    return different;
  }

  /**
   * @param {any[]} values
   * @returns {Node}
   */
  get(values) {
    for (const { i, type, value } of this.cache) {
      if (type === ARRAY)
        array(value, values[i]);
      else {
        const { k: different, v: node } = diff(value, values[i]);
        values[i] = different ? node.valueOf() : node;
      }
    }
    return this.update(values);
  }
}
