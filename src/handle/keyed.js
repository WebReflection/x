// @ts-check

import { kv } from '../utils.js';
import create from './create.js';

const fr = new FinalizationRegistry(
  ([map, value]) => { map.delete(value) }
);

/**
 * @template E,H
 * @param {Node} node
 * @param {import("../parser.js").Path<import("../parser.js").Type,E>[] | never[]} paths
 * @param {import("../tag.js").Update} update
 * @param {H} holes
 * @param {number} i
 * @returns
 */
export default (node, paths, update, holes, i) => {
  const map = new Map;
  const lazy = create(node, paths, update);
  return kv(
    /**
     * @param {boolean} once
     * @returns {(values:any[]) => Node}
     */
    once => function held(values) {
      const value = values[i];
      let update = map.get(value);
      if (!update) {
        update = lazy(once);
        map.set(value, update);
        fr.register(held, [map, value]);
      }
      return update(values);
    },
    holes
  );
};
