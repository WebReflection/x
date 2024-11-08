import { DOCUMENT_FRAGMENT_NODE } from '../constants.js';

import Fragment from './fragment.js';

import { empty } from '../utils.js';

// class NodeInfo {
//   constructor(node, updates) {
//     this.node = node;
//     this.updates = updates;
//   }
//   update(values) {
//     const { node, updates } = this;
//     for (let i = 0; i < updates.length; i++) updates[i](values[i]);
//     return node;
//   }
// }

export default class Node {
  /**
   * @param {import("../types.js").GenericNode} node
   * @param {import("../types.js").Path[]} paths
   */
  constructor(node, paths, update) {
    this.type = node.nodeType;
    this.node = node;
    this.paths = paths;
    this.update = update;
  }

  /**
   * @param {import("../types.js").Update} update
   * @param {boolean} once
   * @returns
   */
  create(once) {
    const { type, node, paths, update } = this;
    const { length } = paths;
    const updates = length ? [] : empty;
    let dom = document.importNode(node, true);
    for (let prevPath = empty, node = dom, i = 0; i < length; i++) {
      const { type, path, extra } = paths[i];
      // speed up multiple attributes per same node
      if (prevPath !== path) {
        prevPath = path;
        node = dom;
        for (let { length: i } = path; i--; node = node.childNodes[path[i]]);
      }
      updates[i] = update[type](node, once, extra);
    }
    if (type === DOCUMENT_FRAGMENT_NODE) dom = new Fragment(dom);
    return {
      update: values => {
        for (let i = 0; i < length; i++) updates[i](values[i]);
        return dom;
      },
    };
  }
}
