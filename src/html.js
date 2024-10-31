import { render, tag } from './tag.js';
export { render };

import attrs from './lib/attributes.js';
import differ from './lib/differ.js';
import text from './lib/text.js';
export const html = tag(false, attrs, differ, text);
export const svg = tag(true, attrs, differ, text);

export const component = callback => (...args) => () => callback(...args);
