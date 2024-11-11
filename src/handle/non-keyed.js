import { DOCUMENT_FRAGMENT_NODE } from '../constants.js';

import Fragment from '../classes/fragment.js';
import KeyValue from '../classes/key-value.js';

import { empty } from '../utils.js';

/**
 * @param {Node} node
 * @param {import("../classes/path.js").AnyPath[]} paths
 * @param {import("../classes/key-value.js").HoleDetails[]} holes
 * @param {import("../tag.js").Update} update
 * @returns
 */
export default (node, paths, holes, update) => {
  const isFragment = node.nodeType === DOCUMENT_FRAGMENT_NODE;
  return new KeyValue(
    holes,
    /**
     * @param {boolean} once
     * @returns {(values:any[]) => Node}
     */
    once => {
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
      if (isFragment) dom = new Fragment(dom);
      return values => {
        for (let i = 0; i < length; i++) updates[i](values[i]);
        return dom;
      };
    }
  );
};
