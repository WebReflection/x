/** @typedef {import("../constants.js").ANY} ANY */
/** @typedef {import("../constants.js").ARRAY} ARRAY */
/** @typedef {import("../constants.js").HOLE} HOLE */
/** @typedef {import("../constants.js").OBJECT} OBJECT */
/** @typedef {KeyValue<string, string>} AttributeDetails */
/** @typedef {KeyValue<number, ANY | ARRAY | HOLE | OBJECT>} CommentDetails */
/** @typedef {(once: boolean) => (values: any[]) => Node} CreateUpdate */
/** @typedef {KeyValue<number, ARRAY | HOLE>} HoleDetails */
/** @typedef {KeyValue<HoleDetails[], CreateUpdate>} Keyed */
/** @typedef {KeyValue<HoleDetails[], CreateUpdate>} NonKeyed */
/** @typedef {KeyValue<Keyed | NonKeyed, any[]>} TagResult */
/** @template K,V */
export default class KeyValue<K, V> {
    /**
     * @param {K} key
     * @param {V} value
     */
    constructor(key: K, value: V);
    k: K;
    v: V;
}
export type ANY = 1;
export type ARRAY = 2;
export type HOLE = 3;
export type OBJECT = 4;
export type AttributeDetails = KeyValue<string, string>;
export type CommentDetails = KeyValue<number, ANY | ARRAY | HOLE | OBJECT>;
export type CreateUpdate = (once: boolean) => (values: any[]) => Node;
export type HoleDetails = KeyValue<number, ARRAY | HOLE>;
export type Keyed = KeyValue<HoleDetails[], CreateUpdate>;
export type NonKeyed = KeyValue<HoleDetails[], CreateUpdate>;
export type TagResult = KeyValue<Keyed | NonKeyed, any[]>;
