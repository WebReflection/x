import { attribute, isArray } from '../utils.js';

const { entries } = Object;

const key = () => key;

/**
 * @param {unknown | unknown[]} value
 * @returns {unknown[]}
 */
const args = value => isArray(value) ? value : [value];

/**
 * @param {Element} node
 * @param {string} type
 * @param {unknown[]} prev
 * @returns {(value:unknown | unknown[]) => void}
 */
const handleListener = (node, type, prev) => value => {
  const curr = args(value);
  if (curr[0] != prev[0]) {
    if (prev[0]) node.removeEventListener(type, ...prev);
    if (curr[0]) node.addEventListener(type, ...curr);
    prev = curr;
  }
};

/**
 * Set or remove an attribute
 * @param {Element} node
 * @param {string} name
 * @param {unknown} value
 */
const setAttribute = (node, name, value) => {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
};

/**
 * Directly set an element property as value
 * @param {Element} node
 * @param {string} prop
 * @param {unknown} value
 */
const setProperty = (node, prop, value) => {
  node[prop] = value;
};

/**
 * @template {Function} T
 * @param {T} callback
 * @param {Element} node
 * @param {string} name
 * @param {unknown} prev
 * @returns {(value:unknown) => void}
 */
const storeValueFor = (callback, node, name, prev) => curr => {
  if (prev != curr) callback(node, name, (prev = curr));
};

/**
 * Toggle an element attribute
 * @param {Element} node
 * @param {string} name
 * @param {boolean} value
 */
const toggleAttribute = (node, name, value) => {
  node.toggleAttribute(name, value);
};

const noListener = [null];

export default {
  __proto__: null,
  // DEFAULT ATTRIBUTE HANDLER
  /**
   * @param {Element} node
   * @param {string} name
   * @param {boolean} once
   * @returns
   */
  [attribute]: (node, name, once) => once ?
    value => setAttribute(node, name, value) :
    storeValueFor(setAttribute, node, name, null)
  ,
  // SINGLE CHAR SHORTCUTS
  /**
   * Events listeners
   * @param {Element} node
   * @param {string} type
   * @param {boolean} once
   * @returns
   */
  ['@']: (node, type, once) => once ?
    value => node.addEventListener(type, ...args(value)) :
    handleListener(node, type, noListener)
  ,
  /**
   * Attribute toggle
   * @param {Element} node
   * @param {string} name
   * @param {boolean} once
   * @returns
   */
  ['?']: (node, name, once) => once ?
    value => toggleAttribute(node, name, value) :
    storeValueFor(toggleAttribute, node, name, false)
  ,
  /**
   * Direct accessor
   * @param {Element} node
   * @param {string} prop
   * @param {boolean} once
   * @returns
   */
  ['.']: (node, prop, once) => once ?
    value => setProperty(node, prop, value) :
    storeValueFor(setProperty, node, prop, null)
  ,
  // SPECIAL KEY HANDLER
  key,
  // SPECIAL ATTRIBUTES
  /**
   * Aria attributes as object literal
   * @param {Element} node
   * @returns
   */
  aria: node => props => {
    for (let [key, value] of entries(props))
      setAttribute(node, key === 'role' ? key : `aria-${key}`, value);
  },
  /**
   * Dataset attributes as object literal
   * @param {Element} node
   * @returns
   */
  data: ({ dataset }) => props => {
    for (const [key, value] of entries(props)) {
      if (value == null) delete dataset[key];
      else dataset[key] = value;
    }
  },
};
