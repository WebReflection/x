import Lazy from './lazy.js';
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
    const { key, map } = this;
    return new Lazy(key, map, () => super.create(update, once));
  }
}
