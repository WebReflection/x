import KeyValue from '../classes/key-value.js';

import create from './creation.js';

/**
 * @param {Node} node
 * @param {import("../classes/path.js").AnyPath[]} paths
 * @param {import("../tag.js").Update} update
 * @param {import("../classes/key-value.js").HoleDetails[]} holes
 * @returns
 */
export default (node, paths, update, holes) => new KeyValue(
    create(node, paths, update),
    holes
);
