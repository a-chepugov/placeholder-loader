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
		 console.error(error)
		}
	 }
	 let replacement;
	 if (handler instanceof Function) {
		// Получаем замену для placeholder'а
		replacement = handler.apply(this, [...arguments])
	 }

	 if (isString(replacement)) {
		// Подменяем placeholder на replacement
		return source.replace(placeholder, replacement)
	 }
	}
 }
 return source;
};