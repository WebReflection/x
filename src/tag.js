// @ts-check

import {
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE,
} from './constants.js';

import KeyValue from './classes/key-value.js';
import Stack from './classes/stack.js';

import { keys } from './utils.js';
import parser from './parser.js';

/** @typedef {import("./handle/diff.js").HINT} HINT */
/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./classes/key-value.js").Keyed} Keyed */
/** @typedef {import("./classes/key-value.js").AttributeDetails} AttributeDetails */
/** @typedef {import("./classes/key-value.js").NonKeyed} NonKeyed */
/** @typedef {import("./classes/key-value.js").TagResult} TagResult */
/** @typedef {{2: (node: Element, once: boolean, { k, v }: AttributeDetails) => any, 8: (node: Comment, once: boolean, hint: HINT) => ((curr: Node[]) => void) | ((curr: Node) => void) | ((curr: string | null) => void), 1: (node: HTMLElement, once: boolean) => (curr: any | null) => void}} Update */

// @ts-ignore
class DirectWeakMap extends WeakMap {
  /**
   * @param {WeakKey} key
   * @param {any} value
   * @returns
   */
  set(key, value) {
    super.set(key, value);
    return value;
  }
}

const dwm = new DirectWeakMap;
const { diff } = Stack;

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
const many = (details, values) => new KeyValue(details, values);

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
      dwm.get(where) || dwm.set(where, new Stack),
      what()
    );
    if (different) {
      where.replaceChildren(
        /** @type {Node} */ (node.valueOf())
      );
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
  const dwm = new DirectWeakMap;
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
    dwm.get(t) || dwm.set(t, parse(t, v, attributes, update)),
    v,
  )
};
