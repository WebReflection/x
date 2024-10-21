export default class Path {
  /**
   * @param {1 | 2 | 8} type the node type at that path
   * @param {'#comment' | '#text' | import("../types.js").AttributeName} name either `#comment`, `#text` or the attribute's name
   * @param {number[]} path a list of indexes from the top parent node to retrieve either the attribute element owner, or the node
   */
  constructor(type, name, path) {
    this.type = type;
    this.name = name;
    this.path = path;
  }
}
