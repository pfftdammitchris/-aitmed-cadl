import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import external from 'rollup-plugin-peer-deps-external'
import nodePolyfills from 'rollup-plugin-node-polyfills'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const extensions = ['.js', '.ts']
const _DEV_ = process.env.NODE_ENV === 'development'

export default [
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs', // CommonJS output
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es', // ES6 output - the preferred format
        sourcemap: true,
      },
      {
        file: 'dist/index.min.js',
        format: 'iife', // ES6 output - the preferred format
        sourcemap: true,
        name: 'aitmedCadl',
      },
    ],
    plugins: [
      external(),
      resolve({
        extensions,
        jsnext: true,
        preferBuiltins: true,
        browser: true,
      }), // so Rollup can find `ms`
      json(),
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        include: ['src/**/*'],
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions,
      }),
      nodePolyfills(),
      _DEV_ ? undefined : terser({ compress: true }),
    ],
  },
  {
    input: 'src/validator',
    output: {
      file: 'public/bundle.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
    plugins: [
      resolve({
        extensions,
        preferBuiltins: true,
        browser: true,
      }), // so Rollup can find `ms`
      commonjs(), // so Rollup can convert `ms` to an ES module
      babel({
        include: ['src/**/*'],
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions,
      }),
      json(),
      nodePolyfills(),
      terser({ compress: true }),
    ],
  },
  {
    input: 'src/testingPlayground/testingPlayground.ts',
    output: {
      file: 'test_public/bundle.js',
      format: 'iife', // immediately-invoked function expression — suitable for <script> tags
      name: 'aitmedNoodlSDK',
    },

    plugins: [
      resolve({
        extensions,
        preferBuiltins: true,
        browser: true,
      }), // so Rollup can find `ms`
      commonjs({
        CADL: ['default'],
      }), // so Rollup can convert `ms` to an ES module
      babel({
        include: ['src/**/*'],
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        extensions,
      }),
      json(),
      nodePolyfills(),
      copy({
        targets: [
          {
            src: 'node_modules/sql.js/dist/sql-wasm.wasm',
            dest: 'test_public',
          },
        ],
      }),
      terser({ compress: true }),
    ],
  },
]
