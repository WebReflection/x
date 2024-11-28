// @ts-check

import { kv } from '../utils.js';
import create from './create.js';

/**
 * @template E,H
 * @param {Node} node
 * @param {import("../parser.js").Path<import("../parser.js").Type,E>[] | never[]} paths
 * @param {import("../tag.js").Update} update
 * @param {H} holes
 * @returns
 */
export default (node, paths, update, holes) => kv(
    create(node, paths, update),
    holes
);
