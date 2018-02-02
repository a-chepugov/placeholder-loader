"use strict";
const path = require('path');
const loaderUtils = require('loader-utils');
const packageData = require('./package.json');

const packageName = packageData.name;

function isString(string) {
	return typeof string === 'string' || string instanceof String
}

/**
 * webpack loader
 * @name placeholder-loader
 * @param {sourcecode} source - string
 * @returns {string} - sourcecode with {@link placeholder} replaced by value returned by {@link handler}
 * @example
 * // Loader options have been passed as an object
 * // *** in webpack.config.js ***
 * function handler() {
 * console.dir(arguments, {colors: true, depth: null});
 *     console.dir(this, {colors: true, depth: null});
 *     // Do something
 * };
 *
 * const webpackConfig = {
 *   module: {
 *     rules: [{
 *       test: /\.(js|jsx|ts)$/,
 *       use: [{
 *           loader: 'placeholder-loader',
 *             options: {
 *               placeholder: 'any_stringhere',
 *               handler: handler
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
 *     // Do something
 * }
 *
 * // *** in webpack.config.js ***
 * const webpackConfig = {
 *   module: {
 *     rules: [{
 *       test: /\.(js|vue|jsx|ts)$/,
 *       use: [
 *         'placeholder-loader?placeholder=anystringhere&handler=handlerPath'
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
 *             js: 'placeholder-loader?placeholder=anystringhere&handler=handlerPath'
 *           }
 *          }
 *        }
 *      ]
 *     }],
 *   },
 * }
 */
module.exports = function (source) {
	/**
	 * source code of module which is processing by webpack
	 * @name sourcecode
	 * @type {string}
	 */
	if (isString(source)) {
		let {
			/**
			 * function which result uses to replace {@link placeholder}
			 *
			 * `handler` will be invoked if the `placeholder` string have been founded in `source`
			 *
			 * can be a string which is a path to a file with function implementation
			 *
			 * If `handler` have returned a string it will be used to replace `placeholder` in `source`
			 *
			 * **this** same that in webpack-loader
			 * @name handler
			 * @callback
			 * @param [args] - any number of arguments. same that in webpack-loader (see more [webpack Loader API](https://webpack.js.org/api/loaders/)).
			 * @type {function|string}
			 */
			handler,
			/**
			 * string placed in {@link sourcecode}
			 * @name {placeholder}
			 * @type {string}
			 */
			placeholder
		} = loaderUtils.getOptions(this) || {};

		if (isString(placeholder)) {
			// Пытаемся найти placeholder
			let index = source.indexOf(placeholder);
			if (index !== -1) {
				// Если обработчик указан как строка, пытаемся найти в проекте соответствующий файл
				if (isString(handler)) {
					let handlerPath = path.resolve(handler);
					try {
						handler = require(handlerPath);
					} catch (error) {
						error.message += `${packageName} => handler havenot found in ${handlerPath}`;
						throw error;
					}
				}

				let replacement;
				if (handler instanceof Function) {
					// Получаем замену для placeholder'а
					replacement = handler.apply(this, arguments)
				} else {
					throw new Error(`${packageName} => handler in not a function`);
				}
				if (isString(replacement)) {
					if (isString(replacement)) {
						// Подменяем placeholder на replacement
						let result = source;
						while (result.includes(placeholder)) {
							result = result.replace(placeholder, replacement)
						}
						return result
					}
				}
			}
		}
	}
	return source;
};
