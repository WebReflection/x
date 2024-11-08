import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE
} from 'domconstants/constants';

import { STACK } from './constants.js';

import Hole from './classes/hole.js';
import Stack from './classes/stack.js';

import { direct, diffNode } from './utils.js';
import parser from './parser.js';

/**
 * @param {import("./types.js").Node} node
 * @param {import("./types.js").Update} update
 * @param {unknown[]} values
 * @returns {import("./types.js").ParsedNode}
 */
const once = (node, values) => node.create(true).update(values);

/**
 * @param {import("./types.js").Node} node
 * @param {unknown[]} values
 * @returns {import("./types.js").Hole}
 */
const many = (node, values) => new Hole(node, values);

const DirectWeakMap = direct(WeakMap);

const dwm = new DirectWeakMap;

let rendering = null;

/**
 * @param {ParentNode} where
 * @param {() => import("./types.js").Hole} what
 * @returns {ParentNode}
 */
export const render = (where, what) => {
  const prev = rendering;
  rendering = dwm.get(where) || dwm.set(where, new Stack(STACK));
  try {
    const [diff, node] = diffNode(rendering, what());
    if (diff) where.replaceChildren(node.valueOf());
  }
  finally {
    rendering = prev;
  }
  return where;
};

/**
 * @param {boolean} SVG
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {(template:TemplateStringsArray | string[], ...interpolations:unknown) => import("./types.js").ParsedNode | import("./types.js").Hole}
 */
export const tag = (SVG, attr, diff, text) => {
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = {
    [ATTRIBUTE_NODE]: (node, once, [k, v]) => attr[k](node, v, once, SVG),
    [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once, SVG),
    [ELEMENT_NODE]: text,
  };
  return (t, ...v) => (rendering === null ? once : many)(
    dwm.get(t) || dwm.set(t, parse(t, v, attr, update)),
    v,
  )
};
