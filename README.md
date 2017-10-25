# placeholder-loader
webpack loader.
## Installation
```sh
npm install placeholder-loader --save
```
```sh
yarn add placeholder-loader
```
## Usage
### Loader options have been passed as an object
```js
const webpackConfig = {
  module: {
    rules: [{
      test: /\.(js|jsx|ts)$/,
      use: [{
          loader: 'placeholder-loader',
            options: {
              placeholder: 'anystringhere',
              handler: handler
          }
      }],
    }],
  },
}
````
### Loader options have been passed as a query string
```js
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
````
#### handler
`handler` is invoked if the string in `placeholder` been found in a processing file.

If `handler` return a string it will be used to replace `placeholder`.
```js
function handler() {
    console.dir(arguments, {colors: true, depth: null});
    console.dir(this, {colors: true, depth: null});
    // Do something
};
```
* **this** and **arguments** - same that in loader (see more [webpack Loader API](https://webpack.js.org/api/loaders/)).

In case option `handler` is a string, loader looking in project for a file with appropriate name and 'require' it'.

***handler.js:***
```js
module.exports = function() {
    // Do something
}
````
### Usage with the vue-loader
```js
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
