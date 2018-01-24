"use strict";
const path = require('path');
const loaderUtils = require('loader-utils');
const packageData = require('./package.json');

const packageName = packageData.name;

function isString(string) {
	return typeof string === 'string' || string instanceof String
}

module.exports = function (source) {
	if (isString(source)) {
		let {handler, placeholder} = loaderUtils.getOptions(this) || {};
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
						error.message += `${packageName} => handler is not found in ${handlerPath}`;
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
