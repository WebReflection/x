import {
  ATTRIBUTE_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from 'domconstants/constants';

import empty from '@webreflection/empty/array';

import Fragment from './fragment.js';

export default class Node {
  /**
   * @param {1 | 3 | 8 | 11} type
   * @param {import("../types.js").GenericNode} node
   * @param {import("../types.js").Path[]} paths
   */
  constructor(type, node, paths) {
    this.type = type;
    this.node = node;
    this.paths = paths;
  }

  /**
   * @param {import("../types.js").Update} update
   * @param {boolean} once
   * @returns {Info}
   */
  create(update, once) {
    const { type, node, paths } = this;
    const { length } = paths;
    const updates = length ? [] : empty;
    let dom = document.importNode(node, true);
    for (let prevPath, node = dom, i = 0; i < length; i++) {
      const { type, name, path } = paths[i];
      // speed up multiple attributes per same node
      if (path !== empty && path !== prevPath) {
        prevPath = path;
        node = dom;
        for (let { length: i } = path; i--; node = node.childNodes[path[i]]);
      }
      updates[i] = type === ATTRIBUTE_NODE ?
        update[ATTRIBUTE_NODE](node, name, once) :
        update[type](node, once);
    }
    dom = type === DOCUMENT_FRAGMENT_NODE ? new Fragment(dom) : dom;
    return {
      update: values => {
        for (let i = 0; i < length; i++) updates[i](values[i]);
        return dom;
      },
    };
  }
}
