import {
  ATTRIBUTE_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from 'domconstants/constants';

import empty from '@webreflection/empty/array';

import Fragment from "./fragment.js";

class Info {
  /**
   * @param {Node} node
   * @param {((value:unknown) => void)[]} updates
   */
  constructor(node, updates) {
    this.node = node;
    this.updates = updates;
  }

  /**
   * @param {unknown[]} values
   * @returns {this}
   */
  update(values) {
    const { updates } = this;
    for (let { length } = updates, i = 0; i < length; i++)
      updates[i](values[i]);
    return this;
  }
}

export default class Node {
  /**
   * @param {1 | 3 | 8 | 11} type the node type
   * @param {Element | Text | Comment | DocumentFragment} node
   * @param {import("../types.js").Path[]} paths
   */
  constructor(type, node, paths) {
    this.type = type;
    this.node = node;
    this.paths = paths;
  }

  /**
   * 
   * @param {boolean} once create it once live or render it and update it multiple times
   * @param {*} update
   * @returns {Info}
   */
  create(once, update) {
    const { type, node, paths } = this;
    const { length } = paths;
    const updates = length ? [] : empty;
    const dom = document.importNode(node, true);
    for (let prevPath, node = dom, i = 0; i < length; i++) {
      const { type, name, path } = paths[i];
      // speed up multiple attributes per same node
      if (path !== empty && path !== prevPath) {
        prevPath = path;
        node = dom;
        for (let { length } = path, i = 0; i < length; i++)
          node = node.childNodes[path[i]];
      }
      updates[i] = type === ATTRIBUTE_NODE ?
        update[ATTRIBUTE_NODE](once, node, name) :
        update[type](once, node);
    }
    return new Info(
      type === DOCUMENT_FRAGMENT_NODE ? new Fragment(dom) : dom,
      updates,
    );
  }
}
