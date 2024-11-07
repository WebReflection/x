import { attribute, isArray } from '../utils.js';

const args = value => isArray(value) ? value : [value];

const handleListener = (node, prev, type) => value => {
  const curr = args(value);
  if (curr[0] != prev[0]) {
    if (prev[0]) node.removeEventListener(type, ...prev);
    if (curr[0]) node.addEventListener(type, ...curr);
    prev = curr;
  }
};

const key = () => key;

const setAttribute = (node, value, name) => {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
};

const setClassName = (node, value) => {
  node.className = value == null ? '' : value;
};

const setProperty = (node, value, prop) => {
  node[prop] = value;
};

const setStyle = (style, value) => {
  style.cssText = value == null ? '' : value;
};

const storeValueFor = (callback, node, prev, name) => curr => {
  if (prev != curr) {
    prev = curr;
    callback(node, curr, name);
  }
};

const toggleAttribute = (node, value, name) => {
  node.toggleAttribute(name, value);
};

// pretty much what uhtml exports except
// onclick and others are not that smart
// use .onclick or others to signal accessors intent
// (explicit is better than implicit and related reason)
export default {
  __proto__: null,
  // this is by default a no-op as it does nothing on updates but
  // it's passed value is used to return the keyed node
  key,
  // default attributes handler
  [attribute]: (node, name, once) => once ?
    value => setAttribute(node, value, name) :
    storeValueFor(setAttribute, node, null, name)
  ,
  // special attributes handlers
  ['@']: (node, type, once) => once ?
    value => node.addEventListener(type, ...args(value)) :
    handleListener(node, [null], type)
  ,
  ['?']: (node, name, once) => once ?
    value => toggleAttribute(node, value, name) :
    storeValueFor(toggleAttribute, node, false, name)
  ,
  ['.']: (node, prop, once) => once ?
    value => setProperty(node, value, prop) :
    storeValueFor(setProperty, node, null, prop)
  ,
  // augmented attributes handler
  aria: node => props => {
    for (const key in props) {
      const name = key === 'role' ? key : `aria-${key}`;
      setAttribute(node, props[key], name);
    }
  },
  class: (node, name, once, SVG) => (once || SVG) ?
    value => setAttribute(node, value, name) :
    storeValueFor(setClassName, node, '')
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
  style: (node, name, once) => (once || SVG) ?
    value => setAttribute(node, value, name) :
    storeValueFor(setStyle, node.style, '')
  ,
};
