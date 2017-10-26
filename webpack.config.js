const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    target: 'node',
    entry: path.resolve(__dirname, 'src', 'main.js'),
    output: {
        path: path.resolve(__dirname),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins:[
                            "syntax-object-rest-spread",
                            "transform-object-rest-spread",
                            "transform-es2015-parameters",
                            ["module-resolver", {
                                "root": ["./src"]
                            }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
    new UglifyJSPlugin()
  ]
};
