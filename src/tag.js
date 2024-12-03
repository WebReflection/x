// @ts-check

import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE,
} from './constants.js';

import Hole from './classes/hole.js';

import { diff, stack } from './stack.js';
import { keys, valueOf } from './utils.js';
import parser from './parser.js';

/** @typedef {import("./handle/diff.js").HINT} HINT */
/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./gone/key-value.js").Keyed} Keyed */
/** @typedef {import("./gone/key-value.js").AttributeDetails} AttributeDetails */
/** @typedef {import("./gone/key-value.js").NonKeyed} NonKeyed */
/** @typedef {import("./gone/key-value.js").TagResult} TagResult */

/** @typedef {{2: (node: Element, once: boolean, { k, v }: AttributeDetails) => any, 8: (node: Comment, once: boolean, hint: HINT) => ((curr: Node[]) => void) | ((curr: Node) => void) | ((curr: string | null) => void), 1: (node: HTMLElement, once: boolean) => (curr: any | null) => void}} Update */

const wm = new WeakMap;

/**
 * @template V
 * @param {WeakMap<WeakKey,V>} wm
 * @param {WeakKey} key
 * @param {V} value
 * @returns
 */
const set = (wm, key, value) => {
  wm.set(key, value);
  return value;
};

/**
 * @param {Keyed | NonKeyed} details
 * @param {any[]} values
 * @returns
 */
const once = ({ k: create }, values) => create(true)(values);

/**
 * @param {Keyed | NonKeyed} details
 * @param {any[]} values
 * @returns
 */
const many = (details, values) => new Hole(details, values);

let resolve = once;

/**
 * @param {ParentNode} where
 * @param {() => TagResult} what
 * @returns
 */
export const render = (where, what) => {
  const resolver = resolve;
  // @ts-ignore
  resolve = many;
  try {
    const { k: different, v: node } = diff(
      wm.get(where) || set(wm, where, stack()),
      what()
    );
    if (different) {
      where.replaceChildren(valueOf(node));
    }
  }
  finally {
    resolve = resolver;
  }
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
  const wm = new WeakMap;
  const parse = parser(SVG);
  const update = {
    /**
     * @param {Element} node
     * @param {boolean} once
     * @param {AttributeDetails} kv
     * @returns
     */
    [ATTRIBUTE_NODE]: (node, once, { k, v }) => attr[k](node, v, once, SVG),
    /**
     * @param {Comment} node
     * @param {boolean} once
     * @param {HINT} hint
     * @returns
     */
    [COMMENT_NODE]: (node, once, hint) => diff(node, hint, once),
    [ELEMENT_NODE]: text,
  };
  /**
   * @param {TemplateStringsArray | string[]} t
   * @param {...any} v
   * @returns {Node | TagResult}
   */
  return (t, ...v) => resolve(
    wm.get(t) || set(wm, t, parse(t, v, attributes, update)),
    v,
  )
};
