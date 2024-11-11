import KeyValue from '../classes/key-value.js';

import nonKeyed from './non-keyed.js';

const fr = new FinalizationRegistry(
  ([map, value]) => { map.delete(value) }
);

/**
 * @param {Node} node
 * @param {import("../classes/path.js").AnyPath[]} paths
 * @param {import("../classes/key-value.js").HoleDetails[]} holes
 * @param {import("../tag.js").Update} update
 * @param {number} key
 * @returns
 */
export default (node, paths, holes, update, key) => {
  const map = new Map;
  const { k: create } = nonKeyed(node, paths, holes, update);
  return new KeyValue(
    /**
     * @param {boolean} once
     * @returns {(values:any[]) => Node}
     */
    once => function ref(values) {
      const value = values[key];
      let update = map.get(value);
      if (!update) {
        update = create(once);
        map.set(value, update);
        fr.register(ref, [map, value]);
      }
      return update(values);
    },
    holes
  );
};
