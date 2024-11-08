import { COMMENT_NODE } from 'domconstants/constants';

import {
  STACK,
  ANY,
  ARRAY,
  HOLE,
  OBJECT,
} from '../constants.js';

import empty from '@webreflection/empty/array';

import { diffNode } from '../utils.js';

/**
 * @typedef {Object} ReplaceChildren
 * @prop {(node:Node) => void} replaceChildren
 */

const array = ({ cache }, values) => {
  const { length } = values;
  if (length < cache.length)
    cache.splice(length);
  for (let i = 0; i < length; i++) {
    values[i] = diffNode(
      cache[i] || (cache[i] = new Stack(HOLE)),
      values[i]
    )[1];
  }
};

export default class Stack {
  /**
   * @param {STACK | ANY | ARRAY | HOLE | OBJECT} type
   */
  constructor(type) {
    this.type = type;
    /** @type {import("../types.js").ParsedNode?} */
    this.node = null;
    /** @type {import("../types.js").Info | import("../types.js").Keyed | null} */
    this.value = null;
    /** @type {Stack[]} */
    this.cache = type === ARRAY ? [] : empty;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {boolean}
   */
  as({ node, values: { length } }) {
    const different = this.node !== node;
    if (different) {
      this.node = node;
      this.value = node.create(false);
      this.cache = length ? [] : empty;
    }
    return different;
  }

  /**
   * @param {import("../types.js").Hole} hole
   * @returns {import("../types.js").GenericNode}
   */
  get({ values }) {
    const { cache, value, node: { paths } } = this;
    for (let j = 0, i = 0; i < paths.length; i++) {
      const path = paths[i];
      if (path.type === COMMENT_NODE) {
        const prev = cache[j] || (cache[j] = new Stack(path.extra));
        j++;
        switch (prev.type) {
          case HOLE: {
            const [diff, node] = diffNode(prev, values[i]);
            values[i] = diff ? node.valueOf() : node;
            break;
          }
          case ARRAY: {
            array(prev, values[i]);
            break;
          }
          // TODO: not sure about this one ... 
          // case OBJECT: {
          //   const curr = values[i];
          //   if (prev.value !== curr) {
          //     prev.value = curr;
          //     values[i] = curr.valueOf();
          //   }
          //   break;
          // }
        }
      }
    }
    return value.update(values);
  }
}
