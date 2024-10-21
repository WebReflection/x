export default class Live {
  /**
   * @param {import("../types.js").Node} node
   * @param {import("../types.js").Update} update
   */
  constructor(node, update) {
    this.node = node;
    this.info = node.create(false, update);
  }

  /**
   * @param {unknown[]} values
   * @returns {import("../types.js").ParsedNode}
   */
  update(values) {
    return this.info.update(values).node;
  }
}
