const setContent = (node, value) => {
  node.textContent = value == null ? '' : value;
};

const multi = node => {
  let prev;
  return curr => {
    if (prev != curr) {
      prev = curr;
      setContent(node, curr);
    }
  };
};

const oneOff = node => value => setContent(node, value);

export default (node, once) => (once ? oneOff : multi)(node);
