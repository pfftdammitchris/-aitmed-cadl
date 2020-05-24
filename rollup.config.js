import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import babel from 'rollup-plugin-babel'

const extensions = ['.js', '.ts']

export default [
	// browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'index',
			file: pkg.browser,
			format: 'umd'
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
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/index.ts',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
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
		]
	},
	{
		input: 'src/testingPlayground',
		output: {
			file: 'public/bundle.js',
			format: 'iife', // immediately-invoked function expression — suitable for <script> tags
			sourcemap: true
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
		],

	}
];