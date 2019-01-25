const {getOptions} = require('loader-utils');
const validateOptions = require('schema-utils');
const packageJson = require('../package.json');

const schema = {
	type: 'object',
	properties: {
		handler: {
			anyOf: [
				{type: "string"},
				{instanceof: 'Function'}
			]
		},
		placeholder: {
			anyOf: [
				{type: "string"},
				{instanceof: 'RegExp'}
			]
		}
	},
	additionalProperties: false
};

/**
 * webpack loader
 *
 * Replace [placeholder](#placeholder) in [source](#source) with value returned by [handler](#handler)
 * @name placeholder-loader
 * @param {string} source
 * @returns {string} - source with {@link placeholder} replaced by value returned by {@link handler}
 * @example
 * // Loader options have been passed as an object
 * // *** in webpack.config.js ***
 * function handler() {
 *   console.dir(arguments, {colors: true, depth: null});
 *   console.dir(this, {colors: true, depth: null});
 *   // Do something
 * };
 *
 * const webpackConfig = {
 *   module: {
 *     rules: [{
 *       test: /\.(js|jsx|ts)$/,
 *       use: [{
 *           loader: 'placeholder-loader',
 *             options: {
 *               placeholder: 'any_string_here',
 *               handler
 *           }
 *       }],
 *     }],
 *   },
 * }
 *
 * // Loader options have been passed as a query string
 * // In case option `handler` is a string, loader looking for a file with appropriate name and 'require' it'.
 * // *** handler.js ***
 * module.exports = function() {
 *   // Do something
 * }
 *
 * // *** in webpack.config.js ***
 * const webpackConfig = {
 *   module: {
 *     rules: [{
 *       test: /\.(js|vue|jsx|ts)$/,
 *       use: [
 *         'placeholder-loader?placeholder=any_string_here&handler=handlerPath'
 *       ],
 *     }],
 *   },
 * }
 *
 * // Usage with the vue-loader
 * const webpackConfig = {
 *   module: {
 *     rules: [{
 *     test: /\.vue$/,
 *       use: [{
 *         loader: 'vue-loader',
 *         options : {
 *           preLoaders: {
 *             js: 'placeholder-loader?placeholder=any_string_here&handler=handlerPath'
 *           }
 *          }
 *        }
 *      ]
 *     }],
 *   },
 * }
 */
module.exports.default = function (source) {
	const options = getOptions(this);
	validateOptions(schema, options, packageJson.name);

	const {
		/*
		 * If defined as a string it will be used as a path to a file with function implementation
		 * If `handler` have returned a string it will be used to replace `placeholder` in `source`
		 * **this** same that in webpack-loader
		 * @name handler
		 * @callback
		 * @param [args] - any number of arguments. same that in webpack-loader (see more [webpack Loader API](https://webpack.js.org/api/loaders/)).
		 * @type {function|string}
		 * @return value which will be placed instead of {@link placeholder}
		 */
		handler,
		/**
		 * string placed in {@link source}
		 * @name {placeholder}
		 * @type {string|RegExp}
		 */
		placeholder
	} = getOptions(this) || {};

	const present = typeof placeholder === 'string' ? String.prototype.indexOf : String.prototype.search;

	if (present.call(source, placeholder) > -1) {

		const handlerActual = typeof handler === 'string' ?
			require(require('path').resolve(handler)) :
			handler;

		const replacement = handlerActual.apply(this, arguments);

		if (typeof replacement === 'string') {
			let result = source;
			while (present.call(result, placeholder) > -1) {
				result = result.replace(placeholder, replacement);
			}
			return result;
		} else {
			return source;
		}
	} else {
		return source;
	}
};
