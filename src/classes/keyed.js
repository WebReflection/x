import Node from './node.js';

import { direct } from '../utils.js';

const DirectMap = direct(Map);

export default class Keyed extends Node {
  constructor(type, node, paths, key) {
    super(type, node, paths);
    this.key = key;
    this.map = new DirectMap;
  }
  /**
   * @param {import("../types.js").Update} update
   * @param {boolean} once
   * @returns {{update: (values: unknown[]) => GenericNode}}
   */
  create(update, once) {
    return {
      /**
       * @param {unknown[]} values 
       * @returns
       */
      update: values => {
        const { key, map } = this;
        const value = values[key];
        const info = map.get(value) || map.set(
          value, super.create(update, once)
        );
        return info.update(values);
      },
    };
  }
}
