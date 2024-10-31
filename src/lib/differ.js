import udomdiff from 'udomdiff';
import empty from '@webreflection/empty/array';
import Fragment from '../classes/fragment.js';
import { isArray, isObject } from '../utils.js';

const { diff } = Fragment;

const array = (node, prev) => curr => {
  prev = udomdiff(
    node.parentNode,
    prev,
    curr.length ? curr : empty,
    diff,
    node
  );
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
      if (isObject(value)) {
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

const oneOff = node => value => {
  if (isObject(isObject)) {
    if (isArray(value)) {
      const f = document.createDocumentFragment();
      f.replaceChildren(...value.map(v => v.valueOf()));
      value = f;
    }
    else value = value.valueOf();
  }
  else {
    value = document.createTextNode(value == null ? '' : value);
  }
  node.replaceWith(value);
};

export default (node, once) => (once ? oneOff : multi)(node);
