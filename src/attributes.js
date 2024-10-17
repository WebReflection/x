import { isArray, skip } from './utils.js';

export default {
  __proto__: null,
  [skip]: (node, name) => value => {
      if (value == null) node.removeAttribute(name);
      else node.setAttribute(name, value);
  },
  ['@']: (node, name, listener = [null]) => value => {
    node.removeEventListener(name, ...listener);
    listener = isArray(value) ? value : [value || null];
    node.addEventListener(name, ...listener);
  },
  ['?']: (node, name) => value => { node.toggleAttribute(name, value) },
  ['.']: (node, name) => value => { node[name] = value },
};
