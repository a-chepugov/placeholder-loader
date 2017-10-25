const package = require('./package.json');
const packageName = package.name;
const loaderUtils = require('loader-utils');
const path = require('path');

function isString(string) {
	return typeof string === 'string' || string instanceof String
}

module.exports = function (source) {
	let {handler, placeholder} = loaderUtils.getOptions(this) || {};
	if (isString(source) && isString(placeholder)) {
		// Пытаемся найти placeholder
		let index = source.indexOf(placeholder);
		if (index !== -1) {
			// Если обработчик указан как строка, пытаемся найти в проекте соответствующий файл
			if (isString(handler)) {
				handlerPath = path.resolve(handler);
				try {
					handler = require(handlerPath);
				} catch (error) {
					error.message += `${packageName} => handler in ${handlerPath} is not found`;
					throw error;
				}
			}
			let replacement;
			if (handler instanceof Function) {
				// Получаем замену для placeholder'а
				replacement = handler.apply(this, [...arguments])
			} else {
				throw new Error(`${packageName} => handler in not a function`);
			}

			if (isString(replacement)) {
				// Подменяем placeholder на replacement
				return source.replace(placeholder, replacement)
			}
		}
	}
	return source;
};
