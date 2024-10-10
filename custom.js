export default ({ DOMParser, document, transform = (v => v) } = globalThis) => {
  const p = new DOMParser;
  const t = document.createElement('template');

  // move nodes and upgrade Custom Elements in the process
  const adopt = node => document.adoptNode(node, true);

  // parse any valid XML within an <x> root node
  const parse = content => p.parseFromString(`<x>${content}</x>`, 'text/xml');

  // x`<this is="${it}" />`
  return (template, ...values) => {
    // create a plain string representation of the XML content
    let { length } = template, [content] = template, i = 0;
    while (++i < length) content += transform(values[i - 1]) + template[i];
    // free nodes from the parsed node to make outerHTML work for HTML
    t.innerHTML = adopt(parse(content).firstChild).outerHTML.slice(3, -4);
    // free nodes from the template content so these won't leak in RAM
    return adopt(t.content);
  };
}
