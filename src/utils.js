const { isArray } = Array;
const skip = Symbol();
export { isArray, skip };

export const direct = Map => class extends Map {
  set(key, value) {
    super.set(key, value);
    return value;
  }
}
