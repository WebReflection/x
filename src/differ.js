export default previous => {
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
      previous.replaceWith(current.valueOf());
      previous = current;
    }
  };
};
