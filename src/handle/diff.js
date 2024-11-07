import { ANY, ARRAY } from '../constants.js';

import empty from '@webreflection/empty/array';
import udomdiff from 'udomdiff';

import Fragment from '../classes/fragment.js';
import { asString } from '../utils.js';

const any = (node, prev) => {
  const text = document.createTextNode(prev);
  node.replaceWith(text);
  return curr => {
    if (curr != prev) {
      prev = curr;
      text.data = asString(curr);
    }
  };
};

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

const object = node => curr => {
  if (node !== curr) {
    const value = curr.valueOf();
    node.replaceWith(value);
    node = value;
  }
};

const multi = (node, hint) => {
  if (hint === ARRAY) return array(node, empty);
  if (hint === ANY) return any(node, '');
  return object(node);
};

const oneOff = (node, hint) => value => {
  if (hint === ARRAY) {
    array(node, empty)(value);
    node.remove();
  }
  else if (hint === ANY) {
    any(node, '')(value);
  }
  else {
    node.replaceWith(value.valueOf());
  }
};

export default (node, hint, once) => (once ? oneOff : multi)(node, hint);
