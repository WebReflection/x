import parse from './parse.js';

/**
 * Create an `html` or `svg` parser that retrieves once details per each passed template.
 * @param {boolean} svg specify if the tag should be for SVG or HTML.
 * @returns {(template:TemplateStringsArray | string[]) => import("./parse.js").Details}
 */
export default svg => {
  const cache = new WeakMap;
  const get = template => {
    const details = parse(template, svg);
    cache.set(template, details);
    return details;
  };
  return template => cache.get(template) || get(template);
};
