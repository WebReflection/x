export default class Hole {
  /**
   * @param {import("../types.js").Node} node
   * @param {import("../types.js").Update} update
   * @param {unknown[]} values
   */
  constructor(node, update, values) {
    this.node = node;
    this.update = update;
    this.values = values;
  }
}
