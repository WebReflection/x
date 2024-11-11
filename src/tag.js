import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE,
} from './constants.js';

import Hole from './classes/hole.js';
import Stack from './classes/stack.js';

import { direct, keys } from './utils.js';
import parser from './parser.js';

const DirectWeakMap = direct(WeakMap);

const dwm = new DirectWeakMap;
const { diff } = Stack;

/**
 * @param {import("./types.js").Node} kv
 * @param {unknown[]} values
 * @returns {import("./types.js").ParsedNode}
 */
const once = ({ v: create }, values) => create(true)(values);

/**
 * @param {import("./types.js").Node} node
 * @param {unknown[]} values
 * @returns {import("./types.js").Hole}
 */
const many = (node, values) => new Hole(node, values);

let resolve = once;

/**
 * @param {ParentNode} where
 * @param {() => import("./types.js").Hole} what
 * @returns {ParentNode}
 */
export const render = (where, what) => {
  const resolver = resolve;
  resolve = many;
  const { k: different, v: node } = diff(
    dwm.get(where) || dwm.set(where, new Stack),
    what()
  );
  if (different) where.replaceChildren(node.valueOf());
  resolve = resolver;
  return where;
};

/**
 * @param {boolean} SVG
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {(template:TemplateStringsArray | string[], ...interpolations:unknown) => import("./types.js").ParsedNode | import("./types.js").Hole}
 */
export const tag = (SVG, attr, diff, text) => {
  const attributes = new Set(keys(attr));
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = {
    [ATTRIBUTE_NODE]: (node, once, [k, v]) => attr[k](node, v, once, SVG),
    [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once, SVG),
    [ELEMENT_NODE]: text,
  };
  return (t, ...v) => resolve(
    dwm.get(t) || dwm.set(t, parse(t, v, attributes, update)),
    v,
  )
};
