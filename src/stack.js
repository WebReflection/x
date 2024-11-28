// @ts-check

import { ARRAY, HOLE } from './constants.js';

import { empty, kv, valueOf } from './utils.js';

/**
 * @template {typeof ARRAY | typeof HOLE} T
 * @typedef {Object} Cache
 * @prop {number} i
 * @prop {T} type
 * @prop {T extends typeof HOLE ? Stack : Stack[]} value
 */

/** @typedef {(once:boolean) => Update} Create */

/**
 * @template {typeof ARRAY | typeof HOLE} T
 * @typedef {Object} Interpolation
 * @prop {number} k
 * @prop {T} v
 */

/**
 * @typedef {Object} Stack
 * @prop {Create?} create
 * @prop {Update?} update
 * @prop {Cache<typeof ARRAY | typeof HOLE>[] | never[]} cache
 */

/** @typedef {(...values:any[]) => Node | DocumentFragment} Update */

/**
 * @template {typeof ARRAY | typeof HOLE} T
 * @param {Stack} stack
 * @param {{k:Create, v: Interpolation<T>[] | never[]}} entry
 * @returns {boolean}
 */
const as = (stack, entry) => {
  const different = stack.create !== entry.k;
  if (different) {
    const { k: create, v: holes } = entry;
    stack.create = create;
    stack.update = create(false);
    stack.cache = holes === empty ? empty : holes.map(entries);
  }
  return different;
};

/**
 * @param {Stack[]} cache
 * @param {any[]} values
 */
const array = (cache, values) => {
  const { length } = values;
  if (length < cache.length)
    cache.splice(length);
  for (let i = 0; i < length; i++) {
    const { v: node } = diff(
      cache[i] || (cache[i] = stack()),
      values[i]
    );
    values[i] = node;
  }
};

/**
 * @template T
 * @param {number} i
 * @param {T} type
 * @param {T extends typeof HOLE ? Stack : Stack[]} value
 * @returns {Cache<T>}
 */
const cache = (i, type, value) => ({ i, type, value });

/**
 * @param {Stack} stack
 * @param {*} param1
 * @returns
 */
export const diff = (stack, { k, v }) => kv(
  as(stack, k),
  get(stack, v)
);

/**
 * @template {typeof ARRAY | typeof HOLE} T
 * @param {Interpolation<T>} detail
 * @returns {Cache<T>}
 */
const entries = ({ k, v }) => cache(
  k, v,
  /** @type {T extends typeof HOLE ? Stack : Stack[]} */(
    v === HOLE ? stack() : []
  )
);

/**
 * @param {Stack} stack
 * @param {any[]} values
 * @returns
 */
const get = ({ update, cache }, values) => {
  for (const { i, type, value } of cache) {
    if (type === ARRAY)
      array(/** @type {Stack[]} */(value), values[i]);
    else {
      const { k: different, v: node } = diff(
        /** @type {Stack} */(value),
        values[i]
      );
      values[i] = different ? valueOf(node) : node;
    }
  }
  return /** @type {Update} */(update)(values);
};

/** @returns {Stack} */
export const stack = () => ({ create: null, update: null, cache: empty });
