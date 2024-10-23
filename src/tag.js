import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE
} from 'domconstants/constants';

import Live from './classes/live.js';

import { direct, attribute } from './utils.js';
import parser from './parser.js';

const DirectWeakMap = direct(WeakMap);

/**
 * @param {number} i
 * @param {boolean} init
 * @param {Live[]} live
 * @returns
 */
const parse = (i, init, live) => ({
  parse: (node, update, values) => {
    if (init || live[i].node !== node) {
      live[i] = new Live(node, update);
      init = true;
    }
    return live[i++].update(values);
  },
  update: (where, what) => {
    if (init) where.replaceChildren(what);
    init = false;
    i = 0;
  }
});

let rendering = null;

const dwm = new DirectWeakMap;
export const render = (where, wonders) => {
  const prev = rendering;
  rendering = dwm.get(where) || dwm.set(where, parse(0, true, []));
  try { rendering.update(where, wonders()) }
  finally { rendering = prev }
  return where;
};

/**
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {import("./types.js").Update}
 */
const getUpdate = (SVG, attr, diff) => ({
  [ATTRIBUTE_NODE]: (once, node, name) => {
    let c = name[0], k = c in attr ? c : (name in attr ? name : attribute);
    return attr[k](node, c === k ? name.slice(1) : name, once, SVG);
  },
  [COMMENT_NODE]: (once, node) => diff(node, once, SVG),
  [ELEMENT_NODE]: (_, node) => value => {
    node.textContent = value == null ? '' : value;
  },
});

/**
 * @param {import("./types.js").Node} node
 * @param {import("./types.js").Update} update
 * @param {unknown[]} values
 * @returns {import("./types.js").ParsedNode}
 */
const create = (node, update, values) => (
  node.create(true, update).update(values)
).node;

/**
 * 
 * @param {boolean} SVG
 * @param {unknown} attr
 * @param {unknown} diff
 * @returns {import("./types.js").ParsedNode}
 */
export const tag = (SVG, attr, diff) => {
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = getUpdate(SVG, attr, diff);
  /**
   * @param {TemplateStringsArray} template
   * @param {...unknown} values
   */
  return (template, ...values) => (rendering?.parse || create)(
    dwm.get(template) || dwm.set(template, parse(template)),
    update,
    values,
  )
};

export { attribute };
