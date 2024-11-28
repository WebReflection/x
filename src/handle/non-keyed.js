// @ts-check

import { kv } from '../utils.js';
import create from './create.js';

/**
 * @param {Node} node
 * @param {import("../classes/path.js").AnyPath[]} paths
 * @param {import("../tag.js").Update} update
 * @param {import("../classes/key-value.js").HoleDetails[]} holes
 * @returns
 */
export default (node, paths, update, holes) => kv(
    create(node, paths, update),
    holes
);
