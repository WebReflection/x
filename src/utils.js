const { isArray } = Array;
const attribute = Symbol();
export { isArray, attribute };

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
    if (prev !== empty && value !== prev[0]) {
      const curr = value ? (isArray(value) ? value : [value]) : empty;
      const different = curr[0] != prev[0];
      if (different && prev[0])
        node.removeEventListener(type, ...prev);
      if (different)
        node.addEventListener(type, ...curr);
      prev = curr;
    }
  };
};
