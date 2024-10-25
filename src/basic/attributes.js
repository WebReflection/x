import {
  attribute,
  handleListener,
  key,
  setAttribute,
  setProperty,
  toggleAttribute,
} from '../utils.js';

export default {
  __proto__: null,
  // this is by default a no-op as it does nothing on updates but
  // it's passed value is used to return the keyed node
  key,
  // default attribute
  [attribute]: (node, name) => value => setAttribute(node, name, value),
  // special prefixed cases where `name` is already sliced
  ['@']: (node, type) => handleListener(node, type),
  ['?']: (node, name) => value => toggleAttribute(node, name, value),
  ['.']: (node, prop) => value => setProperty(node, prop, value),
};
