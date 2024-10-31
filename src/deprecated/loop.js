import Live from './classes/live.js';

export default stack => ({
  /**
   * @param {import("./types.js").ParsedNode} node
   * @param {import("./types.js").Update} update
   * @param {unknown[]} values
   * @returns {import("./types.js").ParsedNode}
   */
  parse: (node, update, values) => {
    if (init || live[i].node !== node) {
      live[i] = new Live(node, update);
      init = true;
    }
    return live[i++].update(values);
  },

  /**
   * @param {ParentNode} where
   * @param {() => import("./types.js").ParsedNode} what
   */
  update: (where, what) => {
    if (init) {
      init = false;
      where.replaceChildren(what.valueOf());
    }
    i = 0;
  },
});
