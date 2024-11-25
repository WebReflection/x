import empty from '@webreflection/empty/array';

const { isArray } = Array;

/**
 * @param {any} value
 * @returns
 */
const isObject = value => value != null && typeof value === 'object';

const attribute = Symbol();

const { keys } = Object;

export { attribute, empty, isArray, isObject, keys };
