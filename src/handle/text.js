import { asStringProp } from '../utils.js';

const setContent = asStringProp('textContent');

const multi = (node, prev) => curr => {
  if (prev != curr) {
    prev = curr;
    setContent(node, curr);
  }
};

const oneOff = node => value => setContent(node, value);

export default (node, once) => (once ? oneOff : multi)(node);
