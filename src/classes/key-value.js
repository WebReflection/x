/** @typedef {import("../constants.js").ANY} ANY */
/** @typedef {import("../constants.js").ARRAY} ARRAY */
/** @typedef {import("../constants.js").HOLE} HOLE */
/** @typedef {import("../constants.js").OBJECT} OBJECT */

/** @typedef {KeyValue<string, string>} AttributeDetails */
/** @typedef {KeyValue<number, ANY | ARRAY | HOLE | OBJECT>} CommentDetails */
/** @typedef {(once: boolean) => (values: any[]) => Node} CreateUpdate */
/** @typedef {KeyValue<number, ARRAY | HOLE>} HoleDetails */
/** @typedef {KeyValue<CreateUpdate, HoleDetails[]>} Keyed */
/** @typedef {KeyValue<CreateUpdate, HoleDetails[]>} NonKeyed */
/** @typedef {KeyValue<Keyed | NonKeyed, any[]>} TagResult */

/** @template K,V */
export default class KeyValue {
  /**
   * @param {K} key
   * @param {V} value
   */
  constructor(key, value) {
    this.k = key;
    this.v = value;
  }
}
