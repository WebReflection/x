export default class Lazy {
  constructor(key, map, create) {
    this.key = key;
    this.map = map;
    this.create = create;
  }

  /**
   * @param {unknown[]} values
   * @returns {import("../types.js").ParsedNode}
   */
  update(values) {
    const { key, map, create } = this;
    const value = values[key];
    const info = map.get(value) || map.set(value, create());
    return info.update(values);
  }
}
