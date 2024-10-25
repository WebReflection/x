const { isArray } = Array;
const attribute = Symbol();
export { isArray, attribute };

let range;
export const drop = (start, end) => {
  if (!range) range = document.createRange();
  range.setStartBefore(start);
  range.setEndAfter(end);
  range.deleteContents();
};

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
    const different = curr[0] != prev[0];
    if (different && prev[0])
      node.removeEventListener(type, ...prev);
    if (different)
      node.addEventListener(type, ...curr);
    prev = curr;
  };
};

export const diffOnce = node => value => {
  const nullish = value == null;
  node.replaceWith(
    nullish || typeof value !== 'object' ?
      document.createTextNode(nullish ? '' : value) : value.valueOf()
  );
};
