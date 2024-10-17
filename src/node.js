import { cache, tag, update } from './create.js';
import { skip } from './utils.js';
import attributes from './attributes.js';
import differ from './differ.js';

const html = tag(false, attributes, differ);
const svg = tag(true, attributes, differ);

export { html, svg, skip, cache, update };
