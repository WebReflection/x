const { readFileSync, writeFileSync } = require('node:fs');

const x = readFileSync('./src/x.js').toString('utf-8');

writeFileSync(
  './src/custom.js',
  `
export default ({ DOMParser, document, transform = (v => v) } = globalThis) => {
  ${x
    .replace(/^(\S|  )/gm, '  $1')
    .replace('export default', 'return')
    .replace('values[i - 1]', 'transform(values[i - 1])')
    .trim()
}
}
`.trimStart()
);
