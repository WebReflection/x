/** @typedef {import("./stack.js").default} Stack */
/** @typedef {Cache<import("../constants.js").ARRAY, Stack[]>} CachedArray */
/** @typedef {Cache<import("../constants.js").HOLE, Stack>} CachedStack */
/** @typedef {CachedArray | CachedStack} CachedEntries */

/** @template T,V */
export default class Cache {
  /**
   * @param {number} i
   * @param {T} type
   * @param {V} value
   */
  constructor(i, type, value) {
    this.i = i;
    this.type = type;
    this.value = value;
  }
}
