# placeholder-loader

## Installation
```sh
npm install placeholder-loader --save
```
```sh
yarn add placeholder-loader
```
## Usage
#### Loader options have been passed as an object
```js
function handler() {
    // Do some stuff
    console.dir(arguments, {colors: true, depth: null});
    console.dir(this, {colors: true, depth: null});
};
const webpackConfig = {
  // Only showing relevant parts.
  module: {
    rules: [{
      // match files
      test: /\.(js|vue|jsx|ts)$/,
      use: [
       {
        loader: 'placeholder-loader',
        options: {
         placeholder: 'anystringhere',
         handler: handler
        }
       }
      ],
    }],
  },
  // ...
}
````
#### Loader options have been passed as loader a query string
```js
const webpackConfig = {
  // Only showing relevant parts.
  module: {
    rules: [{
      // match files
      test: /\.(js|vue|jsx|ts)$/,
      use: [
        'placeholder-loader?placeholder=anystringhere&handler=handlerPath'
      ],
    }],
  },
  // ...
}
````
In case `handler` option is a string, loader looking in project for a file with appropriate name.

`handler` is invoked if the string in `placeholder` been found in a processing file.

If `handler` return a string it will be used to replace `placeholder`.

##### In handler: 
* **this** refer to **this** in [webpack Loader API](https://webpack.js.org/api/loaders/).
* **arguments** - same that in loader.
#### Usage with the vue-loader
```js
const webpackConfig = {
  // Only showing relevant parts.
  module: {
    rules: [{
        test: /\.vue$/,
        use: [
            {
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
  // ...
}
````