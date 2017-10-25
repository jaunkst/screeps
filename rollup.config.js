import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';

export default {
    input: './src/main.js',
    resolveExternal: function ( id ) {
        return path.resolve( __dirname, 'src', id );
    },
    output: {
        file: 'main.js',
        format: 'iife'
    },
    globals: {},
    plugins: [
        replace({
            'DEBUG': true
        }),
        babel({
            "presets": [
                ["env", { "modules": false }]
            ],
            "plugins": [
                "external-helpers",
                "syntax-object-rest-spread",
                "transform-object-rest-spread",
                "transform-es2015-parameters",
                ["module-resolver", {
                    "root": ["./src"]
                }]
            ]
        }
    ),
    resolve({
        jsnext: true
    }),
    commonjs({
        include: 'node_modules/**'
    })
]
};
