export default class Hole {
  /**
   * @param {import("./types.js").Node | import("./types.js").Keyed} node
   * @param {unknown[]} values
   */
  constructor(node, values) {
    this.node = node;
    this.values = values;
  }
}
