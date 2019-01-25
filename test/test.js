const expect = require('chai').expect;
const path = require('path');
const compiler = require('./compiler.js').default;

describe('placeholder-loader', () => {

	function factory({entry, placeholder, handler}) {
		return {
			context: __dirname,
			entry,
			output: {
				path: path.resolve(__dirname),
				filename: 'bundle',
			},
			module: {
				rules: [{
					test: /\.js/,
					use: {
						loader: path.resolve(__dirname, '../index.js'),
						options: {
							placeholder, handler
						}
					}
				}]
			}
		};
	}

	describe('placeholder string', () => {

		it('variable', () => {
			const config = factory({entry: './mocks/variable.js', placeholder: '[name]', handler: () => 'Alice'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = \'Alice\';\n'))
		});

		it('expression', () => {
			const config = factory({entry: './mocks/expression.js', placeholder: 'b + c', handler: () => 'c + d'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = c + d;\n'))
		});

		it('comment', () => {
			const config = factory({entry: './mocks/comment.js', placeholder: '// placeholder', handler: () => '= TARGET'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = TARGET\n'))
		});

		it('comment.multiline', () => {
			const config = factory({entry: './mocks/comment.multiline.js', placeholder: '/**\n * placeholder\n */', handler: () => 'var a = 1'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = 1\nvar b = a;\n'))
		});

		it('absent', () => {
			const config = factory({entry: './mocks/absent.js', placeholder: '[name1]', handler: () => 'Alice'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = \'[name]\';\n'))
		});

	});

	describe('placeholder RegExp', () => {

		it('digits', () => {
			const config = factory({entry: './mocks/RegExp.js', placeholder: /\d-placeholder-\d/, handler: () => 'Alice'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a /* Alice */\n'))
		});

		it('absent', () => {
			const config = factory({entry: './mocks/absent.js', placeholder: /1-placeholder-2/, handler: () => 'Alice'});
			return compiler(config)
				.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = \'[name]\';\n'))
		});

	});

	it('function by path', () => {
		const config = factory({entry: './mocks/expression.js', placeholder: 'b + c', handler: './test/mocks/__handler.js'});
		return compiler(config)
			.then((result) => expect(result.toJson().modules[0].source).to.be.equal('var a = \'___\';\n'))
	});

});
