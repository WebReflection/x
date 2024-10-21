/** @typedef {import("./classes/fragment.js").default} Fragment */
/** @typedef {import("./classes/live.js").default} Live */
/** @typedef {import("./classes/node.js").default} Node */
/** @typedef {import("./classes/path.js").default} Path */


/** @typedef {HTMLElement | SVGElement | Text | Comment | Fragment} ParsedNode */
/** @typedef {(value: string | bigint | boolean | number | null | void) => void} UpdateText */
/** @typedef {{1: (once: boolean, node: HTMLElement) => UpdateText; 2: (once: boolean, node: Element, name: string) => function; 8: (once: boolean, node: Comment) => function; }} Update */
/** @typedef {string} AttributeName */

/**
 * @param {Fragment} Fragment
 * @param {Live} Live
 * @param {Node} Node
 * @param {Path} Path
 * @param {AttributeName} AttributeName
 * @param {ParsedNode} ParsedNode
 * @param {Update} Update
 * @param {UpdateText} UpdateText
 */
export default (
  Fragment,
  Live,
  Node,
  Path,
  AttributeName,
  ParsedNode,
  Update,
  UpdateText,
) => [
  Fragment,
  Live,
  Node,
  Path,
  AttributeName,
  ParsedNode,
  Update,
  UpdateText,
];
