import Fragment from './fragment.js';
import parser from './tag.js';
import { skip } from './utils.js';

export const cache = new WeakMap;
export const update = (dom, values, { updates } = cache.get(dom)) => {
  for (let i = 0, { length } = values; i < length; i++) {
    const value = values[i];
    if (value !== skip) updates[i](value);
  }
  return dom;
};

const find = (p, i) => p.childNodes[i];
export const tag = (svg, attrs, differ) => {
  const parse = parser(svg);
  return (template, ...values) => {
    const { type, node, paths } = parse(template);
    const copy = document.importNode(node, true);
    const dom = type === 11 ? new Fragment(copy) : copy;
    const updates = [];
    cache.set(dom, { updates });
    for (let i = 0, { length } = values; i < length; i++) {
      const { type, name, path } = paths[i];
      const node = path.reduce(find, dom);
      const value = values[i];
      if (type === 8)
        (updates[i] = differ(node))(value);
      else {
        let c = name[0], k = c in attrs ? c : (name in attrs ? name : skip);
        (updates[i] = attrs[k](node, c === k ? name.slice(1) : name))(value);
      }
    }
    return dom;
  };
};
