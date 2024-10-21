import { render, tag } from './tag.js';
export { render };

import attrs from './attributes.js';
import differ from './differ.js';
export const html = tag(false, attrs, differ);
export const svg = tag(true, attrs, differ);

export const component = callback => (...args) => () => callback(...args);
