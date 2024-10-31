import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE
} from 'domconstants/constants';

import Stack from './classes/stack.js';

import { direct, attribute } from './utils.js';
import parser from './parser.js';

const DirectWeakMap = direct(WeakMap);

let rendering = null;
const dwm = new DirectWeakMap;
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
 * @param {import("./types.js").Node} node
 * @param {import("./types.js").Update} update
 * @param {unknown[]} values
 * @returns {import("./types.js").ParsedNode}
 */
const one = (node, update, values) => node.create(update, true).update(values);

/**
 * @param {boolean} SVG
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {import("./types.js").ParsedNode}
 */
export const tag = (SVG, attr, diff) => {
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = {
    [ATTRIBUTE_NODE]: (node, name, once) => {
      let c = name[0], k = c in attr ? c : (name in attr ? name : attribute);
      return attr[k](node, c === k ? name.slice(1) : name, once, SVG);
    },
    [COMMENT_NODE]: (node, once) => diff(node, once, SVG),
    [ELEMENT_NODE]: node => value => {
      node.textContent = value == null ? '' : value;
    },
  };

  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {...unknown} values
   */
  return (template, ...values) => (rendering?.parse || one)(
    dwm.get(template) || dwm.set(template, parse(template)),
    update,
    values,
  )
};
