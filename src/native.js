// https://github.com/WebReflection/custom-function/blob/main/esm/factory.js

const { setPrototypeOf } = Object;

export default Native => {
  function Class(target) {
    return setPrototypeOf(target, new.target.prototype);
  }
  Class.prototype = Native.prototype;
  return Class;
};
