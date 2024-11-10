import { render, tag } from './tag.js';
export { render };

import attr from './handle/attr.js';
import diff from './handle/diff.js';
import text from './handle/text.js';
export const html = tag(false, attr, diff, text);
export const svg = tag(true, attr, diff, text);
