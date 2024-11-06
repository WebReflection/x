import {
  ANY,
  ARRAY,
} from '../constants.js';

import udomdiff from 'udomdiff';
import empty from '@webreflection/empty/array';
import Fragment from '../classes/fragment.js';

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

const multi = (node, hint) => {
  if (hint === ARRAY)
    return array(node, empty);
  if (hint === ANY) {
    let prev = '';
    const text = document.createTextNode(prev);
    node.replaceWith(text);
    return value => {
      const curr = value == null ? '' : value;
      if (curr !== prev) {
        prev = curr;
        text.data = curr;
      }
    };
  }
  return curr => {
    if (node !== curr) {
      const value = curr.valueOf();
      node.replaceWith(value);
      node = value;
    }
  };
};

const oneOff = (node, hint) => value => {
  if (hint === ARRAY) {
    udomdiff(
      node.parentNode,
      empty,
      value,
      diff,
      node
    );
    node.remove();
  }
  else {
    node.replaceWith(
      hint === ANY ?
        document.createTextNode(value == null ? '' : value) :
        value.valueOf()
    );
  }
};

export default (node, hint, once) => (once ? oneOff : multi)(node, hint);
