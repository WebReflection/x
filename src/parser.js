
import {
  ATTRIBUTE_NODE as A,
  COMMENT_NODE,
  ELEMENT_NODE,
} from 'domconstants/constants';

import { TEXT_ELEMENTS } from 'domconstants/re';

import {
  ANY,
  ARRAY,
  HOLE,
  OBJECT,
} from './constants.js';

import empty from '@webreflection/empty/array';
import parser from '@webreflection/uparser';

import Hole from './classes/hole.js';
import Keyed from './classes/keyed.js';
import Node from './classes/node.js';

import { html, svg } from './create.js';
import { attribute, isArray, isObject } from './utils.js';

const prefix = '_x';
const { indexOf } = empty;

let key = -1;

/**
 * @param {Node} node
 * @returns {number[]}
 */
const map = node => {
  const path = [];
  let i = 0, parentNode;
  while (parentNode = node.parentNode) {
    i = path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return i < 1 ? empty : path;
};

/**
 * @param {1 | 2 | 8} type the node type at that path
 * @param {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
 * @param {{k:string, v:string} | ANY | ARRAY | HOLE | OBJECT | null} extra
 * @returns 
 */
const info = (type, path, extra) => ({ type, path, extra });

const kv = (k, v) => ({ k, v });

/**
 * @param {Element | DocumentFragment} target
 * @returns {TreeWalker}
 */
const treeWalker = target => document.createTreeWalker(target, 1 | 128);

/**
 * @param {boolean} SVG indicate SVG parser VS an HTML one
 * @returns {(template:TemplateStringsArray|string[]) => Node}
 */
export default SVG => {
  const content = SVG ? svg : html;
  return (template, values, attr) => {
    const text = parser(template, prefix, SVG);
    const node = content(text);
    const length = template.length - 1;
    let paths = empty;
    if (length) {
      let tw, target, i = 0;
      paths = [];
      while (i < length) {
        target = tw?.nextNode() || node;
        switch (target.nodeType) {
          case COMMENT_NODE: {
            // holes
            if (target.data === prefix + i) {
              const value = values[i];
              const extra = value instanceof Hole ? HOLE : (
                isArray(value) ? ARRAY : (
                  isObject(value) ? OBJECT : ANY
                )
              );
              paths.push(info(COMMENT_NODE, map(target), extra));
              i++;
            }
            break;
          }
          case ELEMENT_NODE: {
            let path, search;
            // attributes
            while (target.hasAttribute(search = prefix + i)) {
              let extra;
              const name = target.getAttribute(search);
              if (name === 'key') {
                extra = kv(name, name);
                key = i;
              }
              else {
                let c = name[0];
                let k = c in attr ? c : (name in attr ? name : attribute);
                extra = kv(k, c === k ? name.slice(1) : name);
              }
              paths.push(info(A, path || (path = map(target)), extra));
              target.removeAttribute(search);
              i++;
            }
            // text only elements:
            // plaintext, script, style, textarea, title, xmp
            if (
              !SVG &&
              TEXT_ELEMENTS.test(target.localName) &&
              target.textContent.trim() === `<!--${search}-->`
            ) {
              paths.push(info(ELEMENT_NODE, path || map(target), null));
              i++;
            }
            break;
          }
        }
        if (i < length && !tw) tw = treeWalker(node);
      }
    }
    const Class = key < 0 ? Node : Keyed;
    const parsed = new Class(node.nodeType, node, paths, key);
    key = -1;
    return parsed;
  };
};
