import { DOCUMENT_FRAGMENT_NODE } from '../constants.js';

import Fragment from '../classes/fragment.js';

import { empty } from '../utils.js';
import { kv } from '../literals.js';

export default (node, paths, holes, update) => {
  const isFragment = node.nodeType === DOCUMENT_FRAGMENT_NODE;
  return kv(
    holes,
    once => {
      const { length } = paths;
      const updates = length ? [] : empty;
      let dom = document.importNode(node, true);
      for (let prevPath = empty, node = dom, i = 0; i < length; i++) {
        const { a: type, b: path, c: extra } = paths[i];
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
