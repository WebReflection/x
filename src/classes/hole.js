export default class Hole {
  /**
   * @param {import("../types.js").Node} key
   * @param {unknown[]} values
   */
  constructor(key, values) {
    this.k = key;
    this.v = values;
  }
}
