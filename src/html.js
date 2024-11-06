import { render, tag } from './tag.js';
export { render };

import attr from './lib/attributes.js';
import diff from './lib/differ.js';
import text from './lib/text.js';
export const html = tag(false, attr, diff, text);
export const svg = tag(true, attr, diff, text);

// export const component = callback => (...args) => () => callback(...args);
