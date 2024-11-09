export default class Hole {
  /**
   * @param {import("../types.js").Node} node
   * @param {unknown[]} values
   */
  constructor(node, values) {
    this.k = node;
    this.v = values;
  }
}
