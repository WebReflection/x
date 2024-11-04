import Node from './node.js';

import { direct } from '../utils.js';

const DirectMap = direct(Map);

export default class Keyed extends Node {
  constructor(type, node, paths, key) {
    super(type, node, paths);
    this.key = key;
    this.map = new DirectMap;
  }
  create(update, once) {
    return {
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
