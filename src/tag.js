import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE
} from 'domconstants/constants';

import Hole from './classes/hole.js';
import Stack from './classes/stack.js';

import { direct } from './utils.js';
import parser from './parser.js';

/**
 * @param {import("./types.js").Node} node
 * @param {import("./types.js").Update} update
 * @param {unknown[]} values
 * @returns {import("./types.js").ParsedNode}
 */
const once = (node, update, values) => node.create(update, true).update(values);

/**
 * @param {import("./types.js").Node} node
 * @param {import("./types.js").Update} update
 * @param {unknown[]} values
 * @returns {import("./types.js").Hole}
 */
const many = (node, update, values) => new Hole(node, update, values);

const DirectWeakMap = direct(WeakMap);

const dwm = new DirectWeakMap;

let rendering = null;

/**
 * @param {ParentNode} where
 * @param {() => import("../types.js").ParsedNode} what
 * @returns {ParentNode}
 */
export const render = (where, what) => {
  const prev = rendering;
  rendering = dwm.get(where) || dwm.set(where, new Stack);
  try { rendering.update(where, what()) }
  finally { rendering = prev }
  return where;
};

/**
 * @param {boolean} SVG
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {import("./types.js").ParsedNode}
 */
export const tag = (SVG, attr, diff, text) => {
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = {
    [ATTRIBUTE_NODE]: (node, once, { k, v }) => attr[k](node, v, once, SVG),
    [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once, SVG),
    [ELEMENT_NODE]: text,
  };

  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {...unknown} values
   */
  return (template, ...values) => (rendering === null ? once : many)(
    dwm.get(template) || dwm.set(template, parse(template, values, attr)),
    update,
    values,
  )
};
