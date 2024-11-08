import {
  ANY,
  ARRAY,
  COMMENT_NODE,
  HOLE,
  OBJECT,
  STACK,
} from '../constants.js';

import { empty } from '../utils.js';

/**
 * @typedef {Object} ReplaceChildren
 * @prop {(node:Node) => void} replaceChildren
 */

const diff = (stack, hole) => [
  stack.as(hole),
  stack.get(hole),
];

/**
 * @param {Stack[]} cache
 * @param {import("../types.js").Hole[]} holes
 */
const array = (cache, holes) => {
  const { length } = holes;
  if (length < cache.length)
    cache.splice(length);
  for (let i = 0; i < length; i++) {
    holes[i] = diff(
      cache[i] || (cache[i] = new Stack(HOLE)),
      holes[i]
    )[1];
  }
};

export default class Stack {
  static diff = diff;

  /**
   * @param {STACK | ANY | ARRAY | HOLE | OBJECT} type
   */
  constructor(type) {
    this.type = type;
    /** @type {import("../types.js").Node | import("../types.js").Keyed | null} */
    this.node = null;
    /** @type {{ update: (values: unknown[]) => GenericNode }?} */
    this.value = null;
    /** @type {Stack[]} */
    this.cache = empty;
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
    const { node: { paths }, value, cache } = this;
    for (let j = 0, i = 0; i < paths.length; i++) {
      const { type, extra } = paths[i];
      if (type === COMMENT_NODE) {
        if (extra === HOLE) {
          const [different, node] = diff(
            cache[j] || (cache[j] = new Stack(extra)),
            values[i]
          );
          values[i] = different ? node.valueOf() : node;
          j++;
        }
        else if (extra === ARRAY) {
          array(
            cache[j] || (cache[j] = []),
            values[i]
          );
          j++;
        }
        // TODO: not sure about this one ...
        // else if (extra === OBJECT) {
        //   const curr = values[i];
        //   if (cache[j] != curr) {
        //     cache[j] = curr;
        //     values[i] = curr.valueOf();
        //   }
        //   j++;
        // }
      }
    }
    return value.update(values);
  }
}
