import { diffOnce } from '../utils.js';

const multi = previous => {
  let text;
  return value => {
    let nullish = value == null, current;
    if (nullish || typeof value !== 'object') {
      const data = nullish ? '' : value;
      if (!text) text = document.createTextNode(data);
      else if (text.data !== data) text.data = data;
      current = text;
    }
    else current = value;
    if (previous !== current) {
      const node = current.valueOf();
      previous.replaceWith(node);
      previous = node;
    }
  };
};

export default (node, once) => (once ? diffOnce : multi)(node);
