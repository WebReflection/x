import {
  ANY,
  ARRAY,
  ATTRIBUTE_NODE,
  COMMENT_NODE,
  ELEMENT_NODE,
  HOLE,
  OBJECT,
  TEXT_ELEMENTS,
} from './constants.js';

import parser from '@webreflection/uparser';

import Hole from './classes/hole.js';
import Keyed from './classes/keyed.js';
import Node from './classes/node.js';

import { html, svg } from './create.js';
import { attribute, empty, isArray, isObject } from './utils.js';

const { indexOf } = empty;

/**
 * @param {Node} node
 * @returns {number[]}
 */
const map = node => {
  const path = [];
  let i = 0, parentNode;
  while ((parentNode = node.parentNode)) {
    path[i++] = indexOf.call(parentNode.childNodes, node);
    node = parentNode;
  }
  return i ? path : empty;
};

/**
 * @param {1 | 2 | 8} type the node type at that path
 * @param {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
 * @param {{k:string, v:string} | ANY | ARRAY | HOLE | OBJECT | null} extra
 * @returns 
 */
const info = (type, path, extra) => ({ type, path, extra });

const keyValue = ['key', ''];
const prefix = 'isµ';

/**
 * @param {boolean} SVG indicate SVG parser VS an HTML one
 * @returns {(template:TemplateStringsArray|string[]) => import("./types.js").Node | import("./types.js").Keyed}
 */
export default SVG => {
  const content = SVG ? svg : html;
  return (template, values, attr, update) => {
    const text = parser(template, prefix, SVG);
    const node = content(text);
    const length = template.length - 1;
    let paths = empty, key = -1, i = 0, tw, target;
    if (length) {
      paths = [];
      while (i < length) {
        target = tw?.nextNode() || node;
        switch (target.nodeType) {
          case COMMENT_NODE: {
            // holes
            if (target.data === (prefix + i)) {
              const value = values[i];
              paths[i++] = info(
                COMMENT_NODE,
                map(target),
                isObject(value) ?
                  (value instanceof Hole ?
                    HOLE : (isArray(value) ? ARRAY : OBJECT)) :
                  ANY,
              );
            }
            break;
          }
          case ELEMENT_NODE: {
            let path, search;
            // attributes
            while (target.hasAttribute((search = prefix + i))) {
              const name = target.getAttribute(search);
              let extra = keyValue;
              if (name === 'key') key = i;
              else {
                let c = name[0];
                let k = c in attr ? c : (name in attr ? name : attribute);
                extra = [k, c === k ? name.slice(1) : name];
              }
              path ??= map(target);
              paths[i++] = info(ATTRIBUTE_NODE, path, extra);
              target.removeAttribute(search);
            }
            // text only elements:
            // plaintext, script, style, textarea, title, xmp
            if (
              !SVG &&
              TEXT_ELEMENTS.test(target.localName) &&
              target.textContent.trim() === `<!--${search}-->`
            ) {
              paths[i++] = info(ELEMENT_NODE, path || map(target), null);
            }
            break;
          }
        }
        if (i < length && !tw) tw = document.createTreeWalker(node, 1 | 128);
      }
    }
    const Class = key < 0 ? Node : Keyed;
    return new Class(node, paths, update, key);
  };
};
