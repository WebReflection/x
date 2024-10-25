import { readFileSync, writeFileSync } from 'node:fs';

let x = readFileSync('./src/pony.js').toString('utf-8');

x = x.replace(/export /, 'return ');

writeFileSync('./src/pony.js', `
// ⚠️ AUTOMATICALLY GENERATED - DO NOT MODIFY
export default document => {
  const { constructor: DocumentFragment } = document.createDocumentFragment();

${x.replace(/^/gm, '  ').trimEnd()}
};
`);
