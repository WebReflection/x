import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const plugins = [nodeResolve()];

export default [
  {
    plugins: plugins.concat(process.env.NO_MIN ? [] : [terser()]),
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
];
