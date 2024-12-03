import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [nodeResolve()].concat(process.env.NO_MIN ? [] : [terser()]);

export default [
  {
    plugins,
    input: './src/html.js',
    output: {
      esModule: true,
      file: './x.js',
    }
  },
  {
    plugins,
    input: './src/html.js',
    output: {
      esModule: true,
      file: './src/pony.js',
    }
  },
  {
    plugins,
    input: './src/custom.js',
    output: {
      esModule: true,
      file: './custom.js',
    }
  },
  {
    plugins,
    input: './src/signals/preact.js',
    output: {
      esModule: true,
      file: './preactive.js',
    }
  },
  {
    plugins,
    input: './src/reactive.js',
    output: {
      esModule: true,
      file: './reactive.js',
    }
  },
];
