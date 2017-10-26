import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import cleanup from 'rollup-plugin-cleanup';
import filesize from 'rollup-plugin-filesize';
import alias from 'rollup-plugin-alias';
import progress from 'rollup-plugin-progress';

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
        progress({
          clearLine: true // default: true
        }),
        replace({
            'DEBUG': true
        }),
        alias({
            synaptic: path.resolve( __dirname, 'vendor', 'synaptic', 'src', 'synaptic' )
        }),
        babel({
            babelrc: false,
            exclude: [
                'node_modules/**',
                'src/vendor/**/.babelrc'
            ],
            presets: [
                ["env", { "modules": false }]
            ],
            plugins: [
                "external-helpers",
                "transform-class-properties",
                "syntax-object-rest-spread",
                "transform-object-rest-spread",
                "transform-es2015-parameters",
                ["module-resolver", {
                    "root": ["./src"]
                }]
            ]
        }),
        resolve({
            jsnext: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        cleanup(),
        filesize()
    ]
};
