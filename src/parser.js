import { ATTRIBUTE_NODE, COMMENT_NODE, ELEMENT_NODE } from 'domconstants/constants';
import { TEXT_ELEMENTS } from 'domconstants/re';
import { html, svg } from './create.js'; // 'create-contextual-content';
import empty from '@webreflection/empty/array';
import parser from '@webreflection/uparser';

const prefix = '_x';
const { indexOf } = empty;

/**
 * @typedef {Object} Path
 * @prop {1 | 2 | 8} type the node type at that path
 * @prop {string} name either `#text`, `#comment` or the attribute name
 * @prop {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
 */

/**
 * @param {1 | 2 | 8} type the node type at that path
 * @param {string} name either `#text`, `#comment` or the attribute name
 * @param {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
 * @returns {Path}
 */
const createPath = (type, name, path) => ({ type, name, path });

/**
 * @param {Node} node
 * @returns {number[]}
 */
const nodePath = node => {
  const path = [];
  let i = 0, parentNode;
  while (parentNode = node.parentNode) {
    i = path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return i < 2 ? (i ? path : empty) : path.reverse();
};

/**
 * @param {boolean} SVG
 * @param {Node} node
 * @param {number[]} paths
 * @param {number} i
 * @returns {number}
 */
const parse = (SVG, node, paths, i) => {
  switch (node.nodeType) {
    case COMMENT_NODE: {
      if (node.data === prefix + i) {
        paths.push(createPath(COMMENT_NODE, '#comment', nodePath(node)));
        i++;
      }
      break;
    }
    case ELEMENT_NODE: {
      let path, search;
      // these are attributes
      while (node.hasAttribute(search = prefix + i)) {
        paths.push(createPath(
          ATTRIBUTE_NODE,
          node.getAttribute(search),
          path || (path = nodePath(node)))
        );
        node.removeAttribute(search);
        i++;
      }
      if (
        !SVG &&
        TEXT_ELEMENTS.test(node.localName) &&
        node.textContent.trim() === `<!--${search}-->`
      ) {
        paths.push(createPath(ELEMENT_NODE, '#text', path || nodePath(node)));
        i++;
      }
      break;
    }
  }
  return i;
};

/**
 * @param {boolean} SVG indicate SVG parser VS an HTML one
 * @returns {(template:TemplateStringsArray|string[]) => { type:number, node:Node, paths:Path[] }}
 */
export default SVG => {
  const content = SVG ? svg : html;
  return template => {
    const text = parser(template, prefix, SVG);
    const node = content(text);
    const length = template.length - 1;
    let paths = empty;
    if (length) {
      let i = parse(SVG, node, paths = [], 0);
      if (i < length) {
        const tw = document.createTreeWalker(node, 1 | 128);
        while (i < length) i = parse(SVG, tw.nextNode(), paths, i);
      }
    }
    return { type: node.nodeType, node, paths };
  };
};
