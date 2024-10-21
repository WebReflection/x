const getContent = fragment => {
  const { firstChild: $ } = fragment;
  return $ && $ === fragment.lastChild ? fragment.removeChild($) : fragment;
};

let template = document.createElement('template')

/** @type {(text:string) => DocumentFragment | HTMLElement | Node} */
export const html = text => {
  template.innerHTML = text;
  const { content } = template;
  const node = getContent(content);
  if (node === content) template = template.cloneNode(false);
  return node;
};

let range;

/** @type {(text:string) => DocumentFragment | SVGElement | Node} */
export const svg = text => {
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(
      document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    );
  }
  return getContent(range.createContextualFragment(text));
};
