import { isArray, skip } from './utils.js';

export default Object.freeze({
  __proto__: null,
  [skip]: (_, node, name) => value => {
      if (value == null) node.removeAttribute(name);
      else node.setAttribute(name, value);
  },
  ['@']: (_, node, name) => {
    let listener;
    return value => {
      const current = isArray(value) ? value : [value || null];
      if (listener && current[0] !== listener[0])
        node.removeEventListener(name, ...listener);
      if (current[0])
        node.addEventListener(name, ...current);
      listener = current;
    };
  },
  ['?']: (_, node, name) => value => { node.toggleAttribute(name, value) },
  ['.']: (_, node, name) => value => { node[name] = value },
});
