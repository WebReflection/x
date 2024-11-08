import empty from '@webreflection/empty/array';

const { isArray } = Array;
const isObject = value => value != null && typeof value === 'object';

const attribute = Symbol();

const direct = Map => class extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
};

export { attribute, direct, empty, isArray, isObject };
