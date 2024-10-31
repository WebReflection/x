/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./classes/hole.js").default} Hole */
/** @typedef {import("./classes/info.js").default} Info */
/** @typedef {import("./classes/keyed.js").default} Keyed */
/** @typedef {import("./classes/lazy.js").default} Lazy */
/** @typedef {import("./classes/node.js").default} Node */
/** @typedef {import("./classes/path.js").default} Path */
/** @typedef {import("./classes/stack.js").default} Stack */

/** @typedef {string} AttributeName */
/** @typedef {Element | Text | Comment | DocumentFragment} GenericNode */
/** @typedef {HTMLElement | SVGElement | Text | Comment | Fragment} ParsedNode */
/** @typedef {(value: string | bigint | boolean | number | null | void) => void} UpdateText */
/** @typedef {{1: (node: HTMLElement | SVGElement, once: boolean) => UpdateText; 2: (node: Element, name: string, once: boolean) => function; 8: (node: Comment, once: boolean) => function; }} Update */

/**
 * @param {Fragment} Fragment
 * @param {Hole} Hole
 * @param {Info} Info
 * @param {Keyed} Keyed
 * @param {Lazy} Lazy
 * @param {Node} Node
 * @param {Path} Path
 * @param {Stack} Stack
 * @param {AttributeName} AttributeName
 * @param {GenericNode} GenericNode
 * @param {ParsedNode} ParsedNode
 * @param {Update} Update
 */
export default (
  Fragment,
  Hole,
  Info,
  Keyed,
  Lazy,
  Node,
  Path,
  Stack,
  AttributeName,
  GenericNode,
  ParsedNode,
  Update,
) => [
  Fragment,
  Hole,
  Info,
  Keyed,
  Lazy,
  Node,
  Path,
  Stack,
  AttributeName,
  GenericNode,
  ParsedNode,
  Update,
];
