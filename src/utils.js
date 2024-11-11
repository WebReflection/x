import empty from '@webreflection/empty/array';

const { isArray } = Array;

/**
 * @param {any} value
 * @returns 
 */
const isObject = value => value != null && typeof value === 'object';

const attribute = Symbol();

/**
 * @param {any} Map
 * @returns
 */
const direct = Map => class extends Map {
  /**
   * @template T
   * @param {string|WeakKey} key
   * @param {T} value
   * @returns {T}
   */
  set(key, value) {
    super.set(key, value);
    return value;
  }
};

const { keys } = Object;

export { attribute, direct, empty, isArray, isObject, keys };
