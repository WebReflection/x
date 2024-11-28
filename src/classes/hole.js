// @ts-check

/** @template K,V */
export default class Hole {
  /**
   * @param {K} key
   * @param {V} value
   */
  constructor(key, value) {
    this.k = key;
    this.v = value;
  }
}
