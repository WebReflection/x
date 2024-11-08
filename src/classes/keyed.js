import Node from './node.js';

const fr = new FinalizationRegistry(([map, value]) => { map.delete(value); });

export default class Keyed extends Node {
  constructor(node, paths, update, key) {
    super(node, paths, update);
    this.key = key;
    this.map = new Map;
  }
  /**
   * @param {import("../types.js").Update} update
   * @param {boolean} once
   * @returns {{update: (values: unknown[]) => GenericNode}}
   */
  create(once) {
    const wrap = {
      /**
       * @param {unknown[]} values 
       * @returns
       */
      update: values => {
        const { key, map } = this;
        const value = values[key];
        let info = map.get(value);
        if (!info) {
          info = super.create(once);
          map.set(value, info);
          fr.register(wrap, [map, value]);
        }
        return info.update(values);
      },
    };
    return wrap;
  }
}
