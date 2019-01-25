const webpack = require('webpack');
const memoryfs = require('memory-fs');

module.exports.default = (config) => {
	const compiler = webpack(config);
	compiler.outputFileSystem = new memoryfs();

	return new Promise((resolve, reject) =>
		compiler.run((error, stats) =>
			error ?
				reject(error) :
				stats.hasErrors() ?
					reject(stats) :
					resolve(stats)
		)
	)
};
