// import empty from '@webreflection/empty/array';

const { isArray } = Array;
const { keys } = Object;
export { isArray, keys };

export const attribute = Symbol();

export const empty = [];

/**
 * @param {any} value
 * @returns
 */
export const isObject = value => typeof value === 'object' && value !== null;
