import Node from './node.js';

import { direct } from '../utils.js';

const DirectMap = direct(Map);

export default class Keyed extends Node {
  constructor(node, paths, update, key) {
    super(node, paths, update);
    this.key = key;
    this.map = new DirectMap;
  }
  /**
   * @param {import("../types.js").Update} update
   * @param {boolean} once
   * @returns {{update: (values: unknown[]) => GenericNode}}
   */
  create(once) {
    return {
      /**
       * @param {unknown[]} values 
       * @returns
       */
      update: values => {
        const { key, map } = this;
        const value = values[key];
        const info = map.get(value) || map.set(value, super.create(once));
        return info.update(values);
      },
    };
  }
}
