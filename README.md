# placeholder-loader

webpack loader

Replace [placeholder](#placeholder) in module [sourcecode](#sourcecode) by value returned by [handler](#handler)

## Installation
#### From NPM
- via npm
```bash
npm install --save placeholder-loader 
```
- via yarn
```bash
yarn add placeholder-loader
```
#### From github.com
- via npm
```bash
npm install --save https://github.com/a-chepugov/placeholder-loader
```
- via yarn
```bash
yarn add https://github.com/a-chepugov/placeholder-loader 
```

**Usage**

```javascript
// Loader options have been passed as an object
// *** in webpack.config.js ***
function handler() {
  console.dir(arguments, {colors: true, depth: null});
  console.dir(this, {colors: true, depth: null});
  // Do something
};

const webpackConfig = {
  module: {
    rules: [{
      test: /\.(js|jsx|ts)$/,
      use: [{
          loader: 'placeholder-loader',
            options: {
              placeholder: 'any_stringhere',
              handler: handler
          }
      }],
    }],
  },
}

// Loader options have been passed as a query string
// In case option `handler` is a string, loader looking for a file with appropriate name and 'require' it'.
// *** handler.js ***
module.exports = function() {
    // Do something
}

// *** in webpack.config.js ***
const webpackConfig = {
  module: {
    rules: [{
      test: /\.(js|vue|jsx|ts)$/,
      use: [
        'placeholder-loader?placeholder=anystringhere&handler=handlerPath'
      ],
    }],
  },
}

// Usage with the vue-loader
const webpackConfig = {
  module: {
    rules: [{
    test: /\.vue$/,
      use: [{
        loader: 'vue-loader',
        options : {
          preLoaders: {
            js: 'placeholder-loader?placeholder=anystringhere&handler=handlerPath'
          }
         }
       }
     ]
    }],
  },
}
```

## handler

function which result uses to replace [placeholder](#placeholder)

`handler` will be invoked if the `placeholder` string have been founded in `source`

can be a string which is a path to a file with function implementation

If `handler` have returned a string it will be used to replace `placeholder` in `source`

**this** same that in webpack-loader

Type: [Function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)

**Parameters**

-   `args`  any number of arguments. same that in webpack-loader (see more [webpack Loader API](https://webpack.js.org/api/loaders/)).

## placeholder

string placed in [sourcecode](#sourcecode)

## sourcecode

source code of module which is processing by webpack
