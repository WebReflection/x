const { ORDERED_NODE_SNAPSHOT_TYPE } = XPathResult;

// Ad-hoc revisited version of:
// https://github.com/WebReflection/uparser/blob/main/esm/index.js
const p = new DOMParser;
const t = document.createElement('template');

const elements = /(<[a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?>)/g;
const attributes = /([^\s\\>"'=]+)\s*=\s*(["']?)\x01\2/g;
const holes = /[\x01\x02]/g; // [Element | Attribute]
const { indexOf } = [];

const adopt = node => document.adoptNode(node, true);
const attrs = (_, f, i, x) => `${f}${i.replace(attributes, value)}${x}`;
const parse = content => p.parseFromString(`<x>${content}</x>`, 'text/xml');
const value = (_, name) => `\x02="${name}"`;
const nodePath = node => {
  let path = [], parentNode;
  while (parentNode = node.parentNode) {
    path.push(indexOf.call(parentNode.childNodes, node));
    node = parentNode;
  }
  return path.reverse().slice(1);
};

/**
 * @typedef {Object} Path
 * @prop {2 | 8} type the node type at that path
 * @prop {string} name either `#comment` or the attribute name
 * @prop {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the comment node
 */

/**
 * Given a template or an array of strings, parses and map all holes
 * and return an array with a new document fragment and all details
 * to map back those holes.
 * @param {TemplateStringsArray | string[]} template the content to parse
 * @param {boolean} [svg=false] if `true` returns a fragment containing SVG elements, `false` by default
 * @returns {[DocumentFragment, Path[]]}
 */
export default (template, svg = false) => {
  let i = 0;
  const xml = parse(
    template
      .join('\x01').trim()
      .replace(elements, attrs)
      .replace(holes, hole => hole === '\x01' ? `<!--_${i++}-->` : `_${i++}`)
  );
  const query = document.evaluate(
    '//comment()|//@*[starts-with(name(), "_")]',
    xml,
    null,
    ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  const paths = [];
  for (let i = 0, j = i, { snapshotLength } = query; i < snapshotLength; i++) {
    const node = query.snapshotItem(i);
    const { nodeType } = node;
    const isComment = nodeType === 8;
    const value = `_${j}`;
    if (
      (isComment && node.data !== value) ||
      (!isComment && node.name !== value)
    ) continue;
    paths.push({
      type: nodeType,
      name: isComment ? '#comment' : node.value,
      path: nodePath(isComment ? node : node.ownerElement)
    });
    if (isComment) node.data = 'x';
    else node.ownerElement.removeAttribute(value);
    j++;
  }
  const html = adopt(xml.firstChild).outerHTML.slice(3, -4);
  t.innerHTML = svg ? `<svg>${html}</svg>` : html;
  let fragment = adopt(t.content);
  if (svg) fragment.replaceChildren(...fragment.firstChild.childNodes);
  return [fragment, paths];
};
