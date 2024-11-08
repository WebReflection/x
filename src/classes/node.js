import { DOCUMENT_FRAGMENT_NODE } from 'domconstants/constants';

import empty from '@webreflection/empty/array';

import Fragment from './fragment.js';

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
      if (path !== prevPath) {
        prevPath = path;
        node = dom;
        for (let { length: i } = path; i--; node = node.childNodes[path[i]]);
      }
      updates[i] = update[type](node, once, extra);
    }
    if (type === DOCUMENT_FRAGMENT_NODE) dom = new Fragment(dom);
    return {
      /**
       * @param {unknown[]} values
       * @returns
       */
      update: values => {
        for (let i = 0; i < length; i++) updates[i](values[i]);
        return dom;
      },
    };
  }
}
