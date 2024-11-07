const { isArray } = Array;
const attribute = Symbol();
export { isArray, attribute };

export const isObject = value => value && typeof value === 'object';

export const direct = Map => class extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
};

export const asString = value => value == null ? '' : value;

export const asStringProp = prop => (ref, value) => {
  ref[prop] = asString(value);
};
