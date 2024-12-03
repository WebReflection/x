// @ts-check

import {
  attribute, empty,
  render as $render, tag,
  attr, diff, text,
} from './custom.js';

/** @typedef {import("./gone/key-value.js").TagResult} TagResult */

/**
 * Given an `effect` function that accepts `() => void` and return
 * a callback to dispose the effect, automatically create such effect
 * per each rendered container.
 * @param {(fx:() => void) => () => void} effect
 * @returns
 */
export default effect => {
  const fr = new FinalizationRegistry(dispose => { dispose() });

  const wm = new WeakMap;

  /**
   * @param {ParentNode} where
   * @param {() => TagResult} what
   * @returns
   */
  const render = (where, what) => {
    wm.get(where)?.();
    const wr = new WeakRef(where);
    const dispose = effect(() => {
      $render(/** @type {ParentNode} */(wr.deref()), what);
    });
    wm.set(where, dispose);
    fr.register(where, dispose);
    return where;
  };
  return {
    attribute, empty,
    render, tag,
    attr, diff, text,
  };
};
