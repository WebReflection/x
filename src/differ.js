export default node => {
  let previous, text;
  return value => {
    let current;
    if (typeof value === 'object' && value)
      current = value;
    else {
      if (!text) text = document.createTextNode(value || '');
      else text.data = value || '';
      current = text;
    }
    if (previous !== current) {
      previous?.remove();
      node.before(previous = current.valueOf());
    }
  };
};
