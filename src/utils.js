import Hole from './classes/hole.js';

const { isArray } = Array;
const attribute = Symbol();
export { isArray, attribute };

export const isHole = value => value instanceof Hole;

export const isObject = value => value && typeof value === 'object';

export const direct = Map => class extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
};

export const key = () => key;

export const setAttribute = (node, name, value) => {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
};

export const toggleAttribute = (node, name, value) => {
  node.toggleAttribute(name, value);
};

export const setProperty = (node, prop, value) => {
  node[prop] = value;
};

const empty = [null];
export const handleListener = (node, type) => {
  let prev = empty;
  return value => {
    const curr = value ? (isArray(value) ? value : [value]) : empty;
    if (curr[0] != prev[0]) {
      if (prev[0]) node.removeEventListener(type, ...prev);
      if (curr[0]) node.addEventListener(type, ...curr);
      prev = curr;
    }
  };
};
