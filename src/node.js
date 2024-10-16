import Fragment from './fragment.js';
import tag from './tag.js';

const { assign, create } = Object;
const { isArray } = Array;

export const skip = Symbol();

const cache = new WeakMap;
export const update = (dom, values) => {
  const updates = cache.get(dom);
  for (let i = 0, { length } = values; i < length; i++) {
    const value = values[i];
    if (value !== skip) updates[i](values[i]);
  }
  return dom;
};

const find = ({ childNodes }, i) => childNodes[i];
const attributes = {
  [skip]: (node, name) => value => {
      if (value == null) node.removeAttribute(name);
      else node.setAttribute(name, value);
  },
  ['@'](node, name) {
    let listener = [null];
    return value => {
      node.removeEventListener(name, ...listener);
      listener = isArray(value) ? value : [value || null];
      node.addEventListener(name, ...listener);
    };
  },
  ['?']: (node, name) => value => { node.toggleAttribute(name, value) },
  ['.']: (node, name) => value => { node[name] = value },
};
const differ = node => {
  let previous;
  return value => {
    if (previous) previous.remove();
    previous = value && typeof value === 'object' ? value.valueOf() : document.createTextNode(value || '');
    node.before(previous);
  };
};

export const x = (svg, attrs, diff = differ) => {
  const parse = tag(svg);
  attrs = assign(create(null), attributes, attrs);
  return (template, ...values) => {
    const { type, node, paths } = parse(template);
    const copy = document.importNode(node, true);
    const dom = type === 11 ? new Fragment(copy) : copy;
    const updates = [];
    cache.set(dom, updates);
    for (let i = 0, { length } = values; i < length; i++) {
      const { type, name, path } = paths[i];
      const node = path.reduce(find, dom);
      const value = values[i];
      if (type === 8)
        (updates[i] = diff(node))(value);
      else {
        let c = name[0], key = c in attrs ? c : (name in attrs ? name : skip);
        (updates[i] = attrs[key](node, c === key ? name.slice(1) : name))(value);
      }
    }
    return dom;
  };
};

export const html = x(false);
export const svg = x(true);
