import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE,
} from './constants.js';

import KeyValue from './classes/key-value.js';
import Stack from './classes/stack.js';

import { direct, keys } from './utils.js';
import parser from './parser.js';

/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./classes/key-value.js").HoleDetails} HoleDetails */
/** @typedef {import("./classes/key-value.js").TagResult} TagResult */

const DirectWeakMap = direct(WeakMap);

const dwm = new DirectWeakMap;
const { diff } = Stack;

/**
 * @param {KeyValue<HoleDetails[], (once: boolean) => (values: any[]) => Node>} details
 * @param {any[]} values
 * @returns
 */
const once = ({ v: create }, values) => create(true)(values);

/**
 * @param {KeyValue<HoleDetails[], (once: boolean) => (values: any[]) => Node>} details
 * @param {any[]} values
 * @returns
 */
const many = (details, values) => new KeyValue(details, values);

let resolve = once;

/**
 * @param {ParentNode} where
 * @param {() => TagResult} what
 * @returns
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
 * @param {import("./handle/attr.js").default} attr
 * @param {import("./handle/diff.js").default} diff
 * @param {import("./handle/text.js").default} text
 * @returns
 */
export const tag = (SVG, attr, diff, text) => {
  const attributes = new Set(keys(attr));
  const dwm = new DirectWeakMap;
  const parse = parser(SVG);
  const update = {
    /**
     * @param {Element} node
     * @param {boolean} once
     * @param {import("./classes/key-value.js").AttributeDetails} kv
     * @returns
     */
    [ATTRIBUTE_NODE]: (node, once, { k, v }) => attr[k](node, v, once, SVG),
    /**
     * @param {Comment} node
     * @param {boolean} once
     * @param {import("./handle/diff.js").HINT} hint
     * @returns
     */
    [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once, SVG),
    [ELEMENT_NODE]: text,
  };
  /**
   * @param {TemplateStringsArray | string[]} t
   * @param {...any} v
   * @returns {Fragment | Node | TagResult}
   */
  return (t, ...v) => resolve(
    dwm.get(t) || dwm.set(t, parse(t, v, attributes, update)),
    v,
  )
};
