/** @typedef {Cache<import("../constants.js").ARRAY, import("./stack.js").default[]>} CachedArray */
/** @typedef {Cache<import("../constants.js").HOLE, import("./stack.js").default>} CachedStack */
/** @typedef {CachedArray | CachedStack} CachedEntries */
/** @template T,V */
export default class Cache<T, V> {
    /**
     * @param {number} i
     * @param {T} type
     * @param {V} value
     */
    constructor(i: number, type: T, value: V);
    i: number;
    type: T;
    value: V;
}
export type CachedArray = Cache<import("../constants.js").ARRAY, import("./stack.js").default[]>;
export type CachedStack = Cache<import("../constants.js").HOLE, import("./stack.js").default>;
export type CachedEntries = CachedArray | CachedStack;
