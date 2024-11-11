
/** @typedef {Cache<import("../constants.js").ARRAY, import("./stack.js").default[]>} CachedArray */
/** @typedef {Cache<import("../constants.js").HOLE, import("./stack.js").default>} CachedStack */
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
