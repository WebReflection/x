import Node from './node.js';

const fr = new FinalizationRegistry(([map, value]) => { map.delete(value); });

// class KeyedInfo {
//   constructor({ key, map }, create) {
//     this.key = key;
//     this.map = map;
//     this.create = create;
//   }
//   update(values) {
//     const { key, map, create } = this;
//     const value = values[key];
//     let info = map.get(value);
//     if (!info) {
//       info = create();
//       map.set(value, info);
//       fr.register(this, [map, value]);
//     }
//     return info.update(values);
//   }
// }

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
    const { key, map } = this;
    const wrap = {
      update: values => {
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
