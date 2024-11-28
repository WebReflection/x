// @ts-check

import Fragment from './classes/fragment.js';
const valueOf = Fragment.value;

const { isArray } = Array;
const { keys } = Object;
export { isArray, keys, valueOf };

export const attribute = Symbol();

/** @type {never[]} */
export const empty = [];

/**
 * @template K,V
 * @param {K} k
 * @param {V} v
 * @returns
 */
export const kv = (k, v) => ({ k, v });

/**
 * @param {any} value
 * @returns
 */
export const isObject = value => typeof value === 'object' && value !== null;

/**
 * @param {string} content
 * @returns
 */
export const text = content => document.createTextNode(content);
