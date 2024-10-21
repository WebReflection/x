import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE
} from 'domconstants/constants';
import Fragment from './fragment.js';
import parser from './parser.js';

let isRendering = false;

export const render = (where, what) => {
  isRendering = true;
};

const childNodes = (p, i) => p.childNodes[i];

const textContent = node => value => {
  node.textContent = value;
};

const createAndApplyUpdates = (dom, paths, values, update) => {
  const updates = [];
  for (let i = 0, { length } = values; i < length; i++) {
    const { type, name, path } = paths[i];
    const node = path.reduce(childNodes, dom);
    const value = values[i];
    (updates[i] = type === COMMENT_NODE ?
      update[COMMENT_NODE](node) :
      (type === ATTRIBUTE_NODE ?
        update[ATTRIBUTE_NODE](node, name) :
        update[ELEMENT_NODE](node))
    )(value);
  }
  return updates;
};

const oneOff = ([{ type, node, paths }], values, update) => {
  const dom = document.importNode(node, true);
  createAndApplyUpdates(dom, paths, values, update);
  return type === DOCUMENT_FRAGMENT_NODE ? new Fragment(dom) : dom;
};

export const tag = (svg, attr, diff) => {
  const cache = new WeakMap;
  const parse = parser(svg);
  const update = {
    [ATTRIBUTE_NODE]: (node, name) => {
      let c = name[0], k = c in attr ? c : (name in attr ? name : 'default');
      return attr[k](node, c === k ? name.slice(1) : name);
    },
    [COMMENT_NODE]: node => diff(node),
    [ELEMENT_NODE]: node => textContent(node),
  };
  return (template, ...values) => {
    let details = cache.get(template);
    if (!details) cache.set(template, details = [parse(template)]);
    if (!isRendering) return oneOff(details, values, update);
  };
};
