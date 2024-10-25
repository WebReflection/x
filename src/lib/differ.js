import udomdiff from 'udomdiff';
import empty from '@webreflection/empty/array';
import Fragment from '../classes/fragment.js';
import { drop, diffOnce, isArray } from '../utils.js';

const { diff } = Fragment;

const array = (node, prev) => curr => {
  if (curr.length)
    prev = udomdiff(node.parentNode, prev, curr, diff, node);
  else if (prev !== empty) {
    drop(prev.at(0), prev.at(-1));
    prev = empty;
  }
};

const dom = prev => curr => {
  if (prev !== curr) {
    const value = curr.valueOf();
    prev.replaceWith(value);
    prev = value;
  }
};

const multi = node => {
  let init = true;
  let update;
  return value => {
    if (init) {
      init = false;
      if (value && typeof value === 'object') {
        if (isArray(value)) update = array(node, empty);
        else update = dom(node);
      }
      else {
        let prev = '';
        const text = document.createTextNode(prev);
        node.replaceWith(text);
        update = value => {
          const curr = value == null ? '' : value;
          if (curr !== prev) {
            prev = curr;
            text.data = curr;
          }
        };
      }
    }
    update(value);
  };
};

export default (node, once) => (once ? diffOnce : multi)(node);
