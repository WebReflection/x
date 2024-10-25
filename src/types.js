/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./classes/live.js").default} Live */
/** @typedef {import("./classes/node.js").default} Node */
/** @typedef {import("./classes/path.js").default} Path */


/** @typedef {HTMLElement | SVGElement | Text | Comment | Fragment} ParsedNode */
/** @typedef {(value: string | bigint | boolean | number | null | void) => void} UpdateText */
/** @typedef {{1: (node: HTMLElement | SVGElement, once: boolean) => UpdateText; 2: (node: Element, name: string, once: boolean) => function; 8: (node: Comment, once: boolean) => function; }} Update */
/** @typedef {string} AttributeName */

/**
 * @param {Fragment} Fragment
 * @param {Live} Live
 * @param {Node} Node
 * @param {Path} Path
 * @param {AttributeName} AttributeName
 * @param {ParsedNode} ParsedNode
 * @param {Update} Update
 */
export default (
  Fragment,
  Live,
  Node,
  Path,
  AttributeName,
  ParsedNode,
  Update,
) => [
  Fragment,
  Live,
  Node,
  Path,
  AttributeName,
  ParsedNode,
  Update,
];
