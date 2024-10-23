import {
  attribute,
  handleListener,
  setAttribute,
  setProperty,
  toggleAttribute,
} from './utils.js';

export default {
  __proto__: null,
  // default attribute
  [attribute]: (node, name) => value => setAttribute(node, name, value),
  // special prefixed cases where `name` is already sliced
  ['@']: (node, type) => handleListener(node, type),
  ['?']: (node, name) => value => toggleAttribute(node, name, value),
  ['.']: (node, prop) => value => setProperty(node, prop, value),
};
