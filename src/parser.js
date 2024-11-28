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
import KeyValue from './classes/key-value.js';

import { html, svg } from './create.js';
import { attribute, empty, isArray, isObject, kv, path, text } from './utils.js';

import keyed from './handle/keyed.js';
import nonKeyed from './handle/non-keyed.js';

const { indexOf } = empty;

/**
 * @param {Node} node
 * @returns {number[]}
 */
const map = node => {
  const p = [];
  let parentNode;
  while ((parentNode = node.parentNode)) {
    p.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return p.length ? p : empty;
};

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
    const node = content(parser(template, prefix, SVG));
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
            const extra = value instanceof Hole ? HOLE : (
              isArray(value) ? ARRAY : (
                isObject(value) ? OBJECT : ANY
              )
            );
            if (extra === ANY) comments.push(currentNode);
            // TODO: objects as holes is currently not supported
            else if (extra !== OBJECT) {
              if (extra === ARRAY) currentNode.data = '[]';
              holes.push(kv(i, extra));
            }
            i = paths.push(path(COMMENT_NODE, map(currentNode), extra));
          }
          break;
        }
        case ELEMENT_NODE: {
          let p, search, name;
          // attributes
          while ((name = currentNode.getAttribute((search = prefix + i)))) {
            let extra = null;
            if (name === 'key') key = i;
            else {
              const c = name[0];
              const s = attr.has(c);
              extra = kv(
                s ? c : (attr.has(name) ? name : attribute),
                s ? name.slice(1) : name
              );
            }
            p ??= map(currentNode);
            currentNode.removeAttribute(search);
            i = paths.push(path(ATTRIBUTE_NODE, p, extra));
          }
          // text only elements: plaintext, script, style, textarea, title, xmp
          if (
            !SVG &&
            TEXT_ELEMENTS.test(currentNode.localName) &&
            currentNode.textContent.trim() === `<!--${search}-->`
          ) {
            i = paths.push(path(ELEMENT_NODE, p ?? map(currentNode), null));
          }
          break;
        }
      }
      tw.nextNode();
    }

    for (const comment of comments)
      comment.replaceWith(text(''));

    return (key < 0 ? nonKeyed : keyed)(
      node,
      i ? paths : empty,
      update,
      holes.length ? holes : empty,
      key
    );
  };
};
