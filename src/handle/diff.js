import { ANY, ARRAY } from '../constants.js';

import udomdiff from 'udomdiff';

import Fragment from '../classes/fragment.js';

import { empty } from '../utils.js';

const any = (node, prev) => curr => {
  if (prev !== curr) {
    prev = curr;
    node.data = curr ?? '';
  }
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

const object = prev => curr => {
  if (prev !== curr) {
    prev.replaceWith(curr.valueOf());
    prev = curr;
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
  else if (hint === ANY) any(node, '')(value);
  else object(node)(value);
};

export default (node, hint, once) => (once ? oneOff : multi)(node, hint);
