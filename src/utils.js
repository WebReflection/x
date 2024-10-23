const { isArray } = Array;
const attribute = Symbol();
export { isArray, attribute };

export const direct = Map => class extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}
