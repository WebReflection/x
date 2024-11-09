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
import { abc, kv } from './literals.js';

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
    const paths = [], holes = [], comments = [];
    const tw = document.createTreeWalker(node, 1 | 128);
    let key = -1, i = 0;
    while (i < length) {
      const { currentNode } = tw;
      switch (currentNode.nodeType) {
        case COMMENT_NODE: {
          // holes
          if (currentNode.data === (prefix + i)) {
            const value = values[i];
            const extra = isObject(value) ?
              (value instanceof Hole ?
                HOLE : (isArray(value) ? ARRAY : OBJECT)) :
              ANY
            ;
            if (extra === ANY) comments.push(currentNode);
            // TODO: objects as holes is currently not supported
            else if (extra !== OBJECT) holes.push(kv(i, extra));
            i = paths.push(abc(COMMENT_NODE, map(currentNode), extra));
          }
          break;
        }
        case ELEMENT_NODE: {
          let path, search;
          // attributes
          while (currentNode.hasAttribute((search = prefix + i))) {
            const name = currentNode.getAttribute(search);
            let extra = keyValue;
            if (name === 'key') key = i;
            else {
              let c = name[0];
              let k = c in attr ? c : (name in attr ? name : attribute);
              extra = [k, c === k ? name.slice(1) : name];
            }
            path ??= map(currentNode);
            currentNode.removeAttribute(search);
            i = paths.push(abc(ATTRIBUTE_NODE, path, extra));
          }
          // text only elements:
          // plaintext, script, style, textarea, title, xmp
          if (
            !SVG &&
            TEXT_ELEMENTS.test(currentNode.localName) &&
            currentNode.textContent.trim() === `<!--${search}-->`
          ) {
            i = paths.push(abc(ELEMENT_NODE, path || map(currentNode), null));
          }
          break;
        }
      }
      tw.nextNode();
    }

    for (let i = 0, { length } = comments; i < length; i++)
      comments[i].replaceWith(document.createTextNode(''));

    const Class = key < 0 ? Node : Keyed;
    return new Class(
      node,
      i ? paths : empty,
      holes.length ? holes : empty,
      update,
      key
    );
  };
};
