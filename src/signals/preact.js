import { effect } from '@preact/signals-core';
export * from '@preact/signals-core';

import custom from '../reactive.js';

const { render, tag, attr, diff, text } = custom(effect);

export { render };
export const html = tag(false, attr, diff, text);
export const svg = tag(true, attr, diff, text);
