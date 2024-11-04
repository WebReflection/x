export default class Info {
  /**
   * @param {import("../types.js").GenericNode} node
   * @param {((value:unknown) => void)[]} updates
   */
  constructor(node, updates) {
    this.node = node;
    this.updates = updates;
  }

  /**
   * @param {unknown[]} values
   * @returns {import("../types.js").GenericNode}
   */
  update(values) {
    const { updates } = this;
    for (let { length } = updates, i = 0; i < length; i++)
      updates[i](values[i]);
    return this.node;
  }
}
