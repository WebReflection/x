/**
 * @param {HTMLElement} node
 * @param {any?} content
 */
const setContent = (node, content) => {
  node.textContent = content ?? '';
};

/**
 * @param {HTMLElement} node
 * @param {void} prev
 * @returns {(curr:any?) => void}
 */
const multi = (node, prev) => curr => {
  if (prev != curr) {
    prev = curr;
    setContent(node, curr);
  }
};

/**
 * @param {HTMLElement} node
 * @returns {(curr:any?) => void}
 */
const oneOff = node => curr => setContent(node, curr);

/**
 * @param {HTMLElement} node
 * @param {boolean} once
 */
export default (node, once) => (once ? oneOff : multi)(node);
