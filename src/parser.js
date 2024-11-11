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

import KeyValue from './classes/key-value.js';
import Path from './classes/path.js';

import { html, svg } from './create.js';
import { attribute, empty, isArray, isObject } from './utils.js';

import keyed from './handle/keyed.js';
import nonKeyed from './handle/non-keyed.js';

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

const keyValue = new KeyValue('key', '');
const prefix = 'isµ';

/**
 * @param {boolean} SVG indicate SVG parser VS an HTML one
 * @returns
 */
export default SVG => {
  const content = SVG ? svg : html;
  /**
   * @param {TemplateStringsArray | string[]} template
   * @param {any[]} values
   * @param {Set<string>} attr
   * @param {import("./tag.js").Update} update
   * @returns
   */
  return (template, values, attr, update) => {
    const text = parser(template, prefix, SVG);
    const node = content(text);
    const length = template.length - 1;
    const paths = [], holes = [], comments = [];
    // TODO: the only thing I am not convinced is that
    // a TreeWalker is any better or faster for the task
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
              (value instanceof KeyValue ?
                HOLE : (isArray(value) ? ARRAY : OBJECT)) :
              ANY
            ;
            if (extra === ANY) comments.push(currentNode);
            // TODO: objects as holes is currently not supported
            else if (extra !== OBJECT) holes.push(new KeyValue(i, extra));
            i = paths.push(new Path(COMMENT_NODE, map(currentNode), extra));
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
              const c = name[0];
              const k = attr.has(c) ? c : (attr.has(name) ? name : attribute);
              /** @type {KeyValue<string, string>} */
              extra = new KeyValue(k, c === k ? name.slice(1) : name);
            }
            path ??= map(currentNode);
            currentNode.removeAttribute(search);
            i = paths.push(new Path(ATTRIBUTE_NODE, path, extra));
          }
          // text only elements: plaintext, script, style, textarea, title, xmp
          if (
            !SVG &&
            TEXT_ELEMENTS.test(currentNode.localName) &&
            currentNode.textContent.trim() === `<!--${search}-->`
          ) {
            path ??= map(currentNode);
            i = paths.push(new Path(ELEMENT_NODE, path, null));
          }
          break;
        }
      }
      tw.nextNode();
    }

    for (const comment of comments)
      comment.replaceWith(document.createTextNode(''));

    return (key < 0 ? nonKeyed : keyed)(
      node,
      i ? paths : empty,
      holes.length ? holes : empty,
      update,
      key
    );
  };
};
