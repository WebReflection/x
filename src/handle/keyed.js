import KeyValue from '../classes/key-value.js';

import create from './creation.js';

const fr = new FinalizationRegistry(
  ([map, value]) => { map.delete(value) }
);

/**
 * @param {Node} node
 * @param {import("../classes/path.js").AnyPath[]} paths
 * @param {import("../tag.js").Update} update
 * @param {import("../classes/key-value.js").HoleDetails[]} holes
 * @param {number} key
 * @returns
 */
export default (node, paths, update, holes, key) => {
  const map = new Map;
  const lazy = create(node, paths, update);
  return new KeyValue(
    /**
     * @param {boolean} once
     * @returns {(values:any[]) => Node}
     */
    once => function held(values) {
      const value = values[key];
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
