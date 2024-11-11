export default class Stack {
    static diff: (stack: Stack, { k, v }: TagResult) => KeyValue<boolean, Node>;
    create: null;
    /** @type {null | (values: any[]) => Node} */
    update: null | ((values: any[]) => Node);
    /** @type {never[] | CachedEntries[]} */
    cache: never[] | CachedEntries[];
    /**
     * @param {Keyed | NonKeyed} updater
     * @returns
     */
    as({ k: holes, v: create }: Keyed | NonKeyed): boolean;
    /**
     * @param {any[]} values
     * @returns {Node}
     */
    get(values: any[]): Node;
}
export type ReplaceChildren = {
    replaceChildren: (node: Node) => void;
};
export type CachedEntries = import("./cache.js").CachedEntries;
export type Keyed = import("./key-value.js").Keyed;
export type NonKeyed = import("./key-value.js").NonKeyed;
export type TagResult = import("./key-value.js").TagResult;
import KeyValue from './key-value.js';
