import {
  attribute,
  handleListener,
  setAttribute,
  setProperty,
  toggleAttribute,
} from '../utils.js';

const setClassName = (node, _, value) => {
  node.className = value == null ? '' : value;
};

const setStyle = (style, _, value) => {
  style.cssText = value == null ? '' : value;
};

const storeValueFor = (callback, node, name) => {
  let prev;
  return curr => {
    if (curr != prev) {
      prev = curr;
      callback(node, name, curr);
    }
  };
};

// pretty much what uhtml exports except
// onclick and others are not that smart
// use .onclick or others to signal accessors intent
// (explicit is better than implicit and related reason)
export default {
  __proto__: null,
  // default attributes handler
  [attribute]: (node, name, once) => once ?
    value => setAttribute(node, name, value) :
    storeValueFor(setAttribute, node, name)
  ,
  // special attributes handlers
  ['@']: (node, type, once) => once ?
    value => {
      const listener = isArray(value) ? value : [value || null];
      node.addEventListener(type, ...listener);
    } :
    handleListener(node, type)
  ,
  ['?']: (node, name, once) => once ?
    value => toggleAttribute(node, name, value) :
    storeValueFor(toggleAttribute, node, name)
  ,
  ['.']: (node, prop, once) => once ?
    value => setProperty(node, prop, value) :
    storeValueFor(setProperty, node, prop)
  ,
  // augmented attributes handler
  aria: node => props => {
    for (const key in props) {
      const name = key === 'role' ? key : `aria-${key}`;
      setAttribute(node, name, props[key]);
    }
  },
  class: (node, name, once, SVG) => (once || SVG) ?
    value => setAttribute(node, name, value) :
    storeValueFor(setClassName, node, name)
  ,
  data: ({ dataset }) => props => {
    for (const key in props) {
      const value = props[key];
      if (value == null) delete dataset[key];
      else dataset[key] = value;
    }
  },
  ref: node => value => {
    if (typeof value === 'function') value(node);
    else value.current = node;
  },
  style: ({ style }, name, once) => once ?
    value => setStyle(style, name, value) :
    storeValueFor(setStyle, style, name)
  ,
};
