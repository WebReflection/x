export default class Hole {
  /**
   * @param {import("../types.js").Node} node
   * @param {unknown[]} values
   */
  constructor(node, values) {
    this.node = node;
    this.values = values;
  }
}
