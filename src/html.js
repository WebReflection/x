import { render, tag } from './tag.js';
import attrs from './attributes.js';
import differ from './differ.js';

const html = tag(false, attrs, differ);
const svg = tag(false, attrs, differ);

export { render, html, svg };
