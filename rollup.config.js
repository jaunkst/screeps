import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/main.js',
  output: {
    file: 'main.js',
    format: 'iife'
  },
  name: 'MyModule',
  plugins: [
    resolve({
        customResolveOptions: {
            moduleDirectory: 'src'
        }
    }),
    commonjs()
  ]
};
