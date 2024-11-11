import { kv } from '../literals.js';
import nonKeyed from './non-keyed.js';

const fr = new FinalizationRegistry(
  ([map, value]) => { map.delete(value) }
);

export default (node, paths, holes, update, key) => {
  const map = new Map;
  const { v: create } = nonKeyed(node, paths, holes, update);
  return kv(holes, once => function ref(values) {
    const value = values[key];
    let update = map.get(value);
    if (!update) {
      update = create(once);
      map.set(value, update);
      fr.register(ref, [map, value]);
    }
    return update(values);
  });
};
