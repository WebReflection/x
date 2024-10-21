const getContent = fragment => {
  const { firstChild: $, lastChild } = fragment;
  return $ === lastChild && $ ? fragment.removeChild($) : fragment;
};

const newTemplate = () => document.createElement('template');
let template;

/** @type {(text:string) => DocumentFragment | HTMLElement | Node} */
export const html = text => {
  template = newTemplate();
  template.innerHTML = text;
  return getContent(template.content);
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
